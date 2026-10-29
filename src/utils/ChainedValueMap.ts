import { Callable } from "./Callable.js";
import { cloneValue } from "./clone.js";
import { mergeValues } from "./merge.js";
import { orderEntries } from "./order.js";

// oxlint-disable-next-line no-redeclare, typescript/no-unsafe-declaration-merging
export class ChainedValueMap<Parent> extends Callable {
  parent: Parent;
  store: Map<string, unknown>;
  shorthands: string[];
  value: unknown;
  useMap: boolean;

  constructor(parent?: Parent) {
    super();
    this.parent = parent as Parent;
    this.store = new Map();
    this.shorthands = [];
    // oxlint-disable-next-line no-undefined
    this.value = undefined;
    this.useMap = true;
  }

  end(): Parent {
    return this.parent;
  }

  batch(handler: (chained: this) => void): this {
    handler(this);

    return this;
  }

  extend(methods: string[]): this {
    const previousShorthands = this.shorthands;

    this.shorthands = methods;

    for (const method of methods) {
      // Re-extending a previously generated shorthand is fine (for example
      // RuleResolve re-declares fullySpecified); shadowing a real method is not.
      if (method in this && !previousShorthands.includes(method)) {
        throw new Error(
          `Cannot extend the chained map with "${method}": the method already exists`,
        );
      }

      // oxlint-disable-next-line typescript/no-explicit-any, typescript/no-unsafe-member-access, typescript/explicit-function-return-type
      (this as any)[method] = (value: unknown) => this.set(method, value);
    }

    return this;
  }

  order(): { entries: Record<string, unknown>; order: string[] } {
    return orderEntries(this.store);
  }

  clear(): this {
    // oxlint-disable-next-line no-undefined
    this.value = undefined;
    this.store.clear();
    // Reset to map mode as well, so a cleared callable map behaves like an
    // empty map (`values()` returns `[]`) instead of returning `undefined`.
    this.useMap = true;

    return this;
  }

  delete(key: string): this {
    this.store.delete(key);

    return this;
  }

  has(key: string): boolean {
    return this.store.has(key);
  }

  set(key: string, value: unknown): this {
    this.useMap = true;
    // oxlint-disable-next-line no-undefined
    this.value = undefined;
    this.store.set(key, value);

    return this;
  }

  get(key: string): unknown {
    return this.store.get(key);
  }

  getOrCompute(key: string, fn: () => unknown): unknown {
    if (!this.has(key)) this.set(key, fn());

    return this.get(key);
  }

  override classCall(value: unknown): Parent {
    this.clear();
    this.useMap = false;
    this.value = value;

    return this.parent;
  }

  entries(): unknown {
    if (this.useMap) {
      const { entries, order } = this.order();

      if (order.length > 0) return cloneValue(entries);

      // oxlint-disable-next-line no-undefined
      return undefined;
    }

    return cloneValue(this.value);
  }

  values(): unknown {
    if (this.useMap) {
      const { entries, order } = this.order();

      return order.map((name) => cloneValue(entries[name]));
    }

    return cloneValue(this.value);
  }

  merge(obj: Record<string, unknown>, omit: string[] = []): this {
    if (Object.keys(obj).length === 0) {
      // E.g. performance: {} / optimization.splitChunks: {} in a raw config map:
      // an empty object explicitly selects the callable form with an empty value,
      // which is different from leaving the option unset.
      if (this.store.size === 0 && this.value == null) this.classCall({});

      return this;
    }

    for (const key of Object.keys(obj)) {
      if (omit.includes(key)) continue;

      const value = obj[key];

      this.set(key, mergeValues(this.get(key), value));
    }

    return this;
  }

  // oxlint-disable-next-line class-methods-use-this
  omitEmpty(obj: Record<string, unknown>, keep: string[] = []): Record<string, unknown> {
    return Object.keys(obj).reduce<Record<string, unknown>>((acc, key) => {
      const value = obj[key];

      // oxlint-disable-next-line no-undefined
      if (value === undefined) return acc;

      if (keep.includes(key)) {
        acc[key] = value;

        return acc;
      }

      if (Array.isArray(value) && value.length === 0) return acc;

      if (
        Object.prototype.toString.call(value) === "[object Object]" &&
        Object.keys(value as object).length === 0
      )
        return acc;

      acc[key] = value;

      return acc;
    }, {});
  }

  when(
    condition: boolean,
    // oxlint-disable-next-line no-empty-function
    whenTruthy: (obj: this) => void = () => {},
    // oxlint-disable-next-line no-empty-function
    whenFalsy: (obj: this) => void = () => {},
  ): this {
    if (condition) whenTruthy(this);
    else whenFalsy(this);

    return this;
  }
}

// Interface merging adds the call signature so ChainedValueMap instances are callable
export interface ChainedValueMap<Parent> {
  // oxlint-disable-next-line typescript/prefer-function-type
  (value: unknown): Parent;
}
