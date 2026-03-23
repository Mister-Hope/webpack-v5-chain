import merge from "deepmerge";

import { Callable } from "./Callable.js";

// oxlint-disable-next-line typescript/no-unsafe-declaration-merging
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
    this.shorthands = methods;

    for (const method of methods) {
      // oxlint-disable-next-line typescript/no-explicit-any, typescript/no-unsafe-member-access, typescript/explicit-function-return-type
      (this as any)[method] = (value: unknown) => this.set(method, value);
    }

    return this;
  }

  order(): { entries: Record<string, unknown>; order: string[] } {
    const entries = [...this.store].reduce< Record<string, unknown>>(
      (acc, [key, value]) => {
        acc[key] = value;

        return acc;
      },
      {},
    );
    const names = Object.keys(entries);
    const order = [...names];

    for (const name of names) {
      // oxlint-disable-next-line typescript/strict-boolean-expressions
      if (!entries[name]) continue;

      // oxlint-disable-next-line typescript/no-explicit-any, typescript/no-unsafe-assignment
      const { __before, __after } = entries[name] as any;

      // oxlint-disable-next-line typescript/strict-boolean-expressions
      if (__before && order.includes(__before as string)) {
        order.splice(order.indexOf(name), 1);
        order.splice(order.indexOf(__before as string), 0, name);
      // oxlint-disable-next-line typescript/strict-boolean-expressions
      } else if (__after && order.includes(__after as string)) {
        order.splice(order.indexOf(name), 1);
        order.splice(order.indexOf(__after as string) + 1, 0, name);
      }
    }

    return { entries, order };
  }

  clear(): this {
    // oxlint-disable-next-line no-undefined
    this.value = undefined;
    this.store.clear();

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

      if (order.length > 0) return entries;

      // oxlint-disable-next-line no-undefined
      return undefined;
    }

    return this.value;
  }

  values(): unknown {
    if (this.useMap) {
      const { entries, order } = this.order();

      return order.map((name) => entries[name]);
    }

    return this.value;
  }

  merge(obj: Record<string, unknown>, omit: string[] = []): this {
    for (const key of Object.keys(obj)) {
      if (omit.includes(key)) continue;

      const value = obj[key];

      if (
        (!Array.isArray(value) && typeof value !== "object") ||
        value == null ||
        !this.has(key)
      ) 
        this.set(key, value);
       else 
        this.set(key, merge(this.get(key) as object, value));
      
    }

    return this;
  }

  // oxlint-disable-next-line class-methods-use-this
  omitEmpty(obj: Record<string, unknown>): Record<string, unknown> {
    return Object.keys(obj).reduce< Record<string, unknown>>(
      (acc, key) => {
        const value = obj[key];

        // oxlint-disable-next-line no-undefined
        if (value === undefined) return acc;

        if (Array.isArray(value) && value.length === 0) return acc;

        if (
          Object.prototype.toString.call(value) === "[object Object]" &&
          Object.keys(value as object).length === 0
        )
          return acc;

        acc[key] = value;

        return acc;
      },
      {},
    );
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
