// oxlint-disable max-classes-per-file
import { cloneValue } from "./clone.js";
import { mergeValues } from "./merge.js";
import { orderEntries } from "./order.js";

export class Chained<Parent = unknown> {
  // oxlint-disable-next-line typescript/parameter-properties
  parent: Parent;

  constructor(parent?: Parent) {
    this.parent = parent as Parent;
  }

  batch(handler: (chained: this) => void): this {
    handler(this);

    return this;
  }

  end(): Parent {
    return this.parent;
  }
}

export class TypedChainedMap<Parent = unknown, OptionsType = unknown> extends Chained<Parent> {
  setKeys: Set<string>;
  store: Map<string, unknown>;
  shorthands: string[];

  constructor(parent?: Parent) {
    super(parent);
    this.setKeys = new Set();
    this.store = new Map();
    this.shorthands = [];
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
      (this as any)[method] = (value: unknown) =>
        this.set(method as keyof OptionsType & string, value as OptionsType[keyof OptionsType]);
    }

    return this;
  }

  clear(): this {
    this.setKeys.clear();
    this.store.clear();

    return this;
  }

  delete(key: string): this {
    this.setKeys.delete(key);
    this.store.delete(key);

    return this;
  }

  order(): { entries: Record<string, unknown>; order: string[] } {
    return orderEntries(this.store);
  }

  entries(): OptionsType {
    const { entries, order } = this.order();

    if (order.length > 0) return cloneValue(entries) as OptionsType;

    // oxlint-disable-next-line no-undefined
    return undefined as unknown as OptionsType;
  }

  values<OptionKey extends keyof OptionsType>(): OptionsType[OptionKey][] {
    const { entries, order } = this.order();

    return order.map((name) => cloneValue(entries[name]) as OptionsType[OptionKey]);
  }

  get<OptionKey extends keyof OptionsType>(key: OptionKey): OptionsType[OptionKey] {
    return this.store.get(key as string) as OptionsType[OptionKey];
  }

  getOrCompute<OptionKey extends keyof OptionsType>(
    key: OptionKey,
    fn: () => OptionsType[OptionKey],
  ): OptionsType[OptionKey] {
    if (!this.has(key as string)) this.set(key, fn());

    return this.get(key);
  }

  has(key: string): boolean {
    return this.store.has(key);
  }

  set<OptionKey extends keyof OptionsType>(key: OptionKey, value: OptionsType[OptionKey]): this {
    this.setKeys.add(key as string);
    this.store.set(key as string, value);

    return this;
  }

  merge(obj: Partial<OptionsType>, omit: string[] = []): this {
    for (const key of Object.keys(obj)) {
      if (omit.includes(key)) continue;

      // oxlint-disable-next-line typescript/no-explicit-any, typescript/no-unsafe-member-access, typescript/no-unsafe-assignment
      const value = (obj as any)[key];

      // oxlint-disable-next-line typescript/no-explicit-any, typescript/no-unsafe-argument
      this.set(key as any, mergeValues(this.get(key as any), value));
    }

    return this;
  }

  // oxlint-disable-next-line class-methods-use-this
  omitEmpty(obj: Record<string, unknown>, keep: string[] = []): Record<string, unknown> {
    return Object.keys(obj).reduce<Record<string, unknown>>((acc, key) => {
      const value = obj[key];

      // oxlint-disable-next-line no-undefined
      if (value === undefined) return acc;

      // Empty values are only meaningful when they were set explicitly (e.g.
      // `resolve.extensions.clear()` disables extension resolution), so keep
      // them for the keys the caller marked as explicit.
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

// oxlint-disable-next-line typescript/no-explicit-any
export class ChainedMap<Parent = unknown> extends TypedChainedMap<Parent, any> {}
