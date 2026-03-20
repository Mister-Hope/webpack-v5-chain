// oxlint-disable max-classes-per-file
import merge from "deepmerge";

export class Chained<Parent> {
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

export class TypedChainedMap<Parent, OptionsType> extends Chained<Parent> {
  store: Map<string, unknown>;
  shorthands: string[];

  constructor(parent?: Parent) {
    super(parent);
    this.store = new Map();
    this.shorthands = [];
  }

  extend(methods: string[]): this {
    this.shorthands = methods;

    for (const method of methods) {
      // oxlint-disable-next-line typescript/no-explicit-any, typescript/no-unsafe-member-access
      (this as any)[method] = (value: unknown) => this.set(method as keyof OptionsType & string, value as OptionsType[keyof OptionsType]);
    }

    return this;
  }

  clear(): this {
    this.store.clear();

    return this;
  }

  delete(key: string): this {
    this.store.delete(key);

    return this;
  }

  order(): { entries: Record<string, unknown>; order: string[] } {
    // oxlint-disable-next-line unicorn/no-array-reduce
    const entries = [...this.store].reduce(
      (acc, [key, value]) => {
        acc[key] = value;

        return acc;
      },
      {} as Record<string, unknown>,
    );
    const names = Object.keys(entries);
    const order = [...names];

    for (const name of names) {
      if (!entries[name]) continue;

      // oxlint-disable-next-line typescript/no-explicit-any, typescript/no-unsafe-member-access
      const { __before, __after } = entries[name] as any;

      if (__before && order.includes(__before as string)) {
        order.splice(order.indexOf(name), 1);
        order.splice(order.indexOf(__before as string), 0, name);
      } else if (__after && order.includes(__after as string)) {
        order.splice(order.indexOf(name), 1);
        order.splice(order.indexOf(__after as string) + 1, 0, name);
      }
    }

    return { entries, order };
  }

  entries(): OptionsType {
    const { entries, order } = this.order();

    if (order.length > 0) return entries as OptionsType;

    return undefined as unknown as OptionsType;
  }

  values<OptionKey extends keyof OptionsType>(): Array<OptionsType[OptionKey]> {
    const { entries, order } = this.order();

    return order.map((name) => entries[name] as OptionsType[OptionKey]);
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
    this.store.set(key as string, value);

    return this;
  }

  merge(obj: Partial<OptionsType>, omit: string[] = []): this {
    for (const key of Object.keys(obj)) {
      if (omit.includes(key)) continue;

      // oxlint-disable-next-line typescript/no-explicit-any, typescript/no-unsafe-member-access
      const value = (obj as any)[key];

      if (
        (!Array.isArray(value) && typeof value !== "object") ||
        value == null ||
        !this.has(key)
      ) {
        // oxlint-disable-next-line typescript/no-explicit-any
        this.set(key as any, value);
      } else {
        // oxlint-disable-next-line typescript/no-explicit-any
        this.set(key as any, merge(this.get(key as any), value));
      }
    }

    return this;
  }

  // oxlint-disable-next-line class-methods-use-this
  omitEmpty(obj: Record<string, unknown>): Record<string, unknown> {
    return Object.keys(obj).reduce(
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
      {} as Record<string, unknown>,
    );
  }

  when(
    condition: boolean,
    // oxlint-disable-next-line typescript/no-unsafe-function-type
    whenTruthy: (obj: this) => void = () => {},
    // oxlint-disable-next-line typescript/no-unsafe-function-type
    whenFalsy: (obj: this) => void = () => {},
  ): this {
    if (condition) whenTruthy(this);
    else whenFalsy(this);

    return this;
  }
}

// oxlint-disable-next-line typescript/no-explicit-any
export class ChainedMap<Parent> extends TypedChainedMap<Parent, any> {}
