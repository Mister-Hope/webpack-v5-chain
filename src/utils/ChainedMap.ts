// oxlint-disable max-classes-per-file
import merge from "deepmerge";

export class Chained<Parent = unknown> {
  // oxlint-disable-next-line typescript/parameter-properties
  public parent: Parent;

  public constructor(parent?: Parent) {
    this.parent = parent as Parent;
  }

  public batch(handler: (chained: this) => void): this {
    handler(this);

    return this;
  }

  public end(): Parent {
    return this.parent;
  }
}

export class TypedChainedMap<Parent = unknown, OptionsType = unknown> extends Chained<Parent> {
  public store: Map<string, unknown>;
  public shorthands: string[];

  public constructor(parent?: Parent) {
    super(parent);
    this.store = new Map();
    this.shorthands = [];
  }

  public extend(methods: string[]): this {
    this.shorthands = methods;

    for (const method of methods) {
      // oxlint-disable-next-line typescript/no-explicit-any, typescript/no-unsafe-member-access, typescript/explicit-function-return-type
      (this as any)[method] = (value: unknown) =>
        this.set(method as keyof OptionsType & string, value as OptionsType[keyof OptionsType]);
    }

    return this;
  }

  public clear(): this {
    this.store.clear();

    return this;
  }

  public delete(key: string): this {
    this.store.delete(key);

    return this;
  }

  public order(): { entries: Record<string, unknown>; order: string[] } {
    const entries = [...this.store].reduce<Record<string, unknown>>((acc, [key, value]) => {
      acc[key] = value;

      return acc;
    }, {});
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

  public entries(): OptionsType {
    const { entries, order } = this.order();

    if (order.length > 0) return entries as OptionsType;

    // oxlint-disable-next-line no-undefined
    return undefined as unknown as OptionsType;
  }

  public values<OptionKey extends keyof OptionsType>(): OptionsType[OptionKey][] {
    const { entries, order } = this.order();

    return order.map((name) => entries[name] as OptionsType[OptionKey]);
  }

  public get<OptionKey extends keyof OptionsType>(key: OptionKey): OptionsType[OptionKey] {
    return this.store.get(key as string) as OptionsType[OptionKey];
  }

  public getOrCompute<OptionKey extends keyof OptionsType>(
    key: OptionKey,
    fn: () => OptionsType[OptionKey],
  ): OptionsType[OptionKey] {
    if (!this.has(key as string)) this.set(key, fn());

    return this.get(key);
  }

  public has(key: string): boolean {
    return this.store.has(key);
  }

  public set<OptionKey extends keyof OptionsType>(
    key: OptionKey,
    value: OptionsType[OptionKey],
  ): this {
    this.store.set(key as string, value);

    return this;
  }

  public merge(obj: Partial<OptionsType>, omit: string[] = []): this {
    for (const key of Object.keys(obj)) {
      if (omit.includes(key)) continue;

      // oxlint-disable-next-line typescript/no-explicit-any, typescript/no-unsafe-member-access, typescript/no-unsafe-assignment
      const value = (obj as any)[key];

      if ((!Array.isArray(value) && typeof value !== "object") || value == null || !this.has(key)) {
        // oxlint-disable-next-line typescript/no-explicit-any, typescript/no-unsafe-argument
        this.set(key as any, value);
      } else {
        // oxlint-disable-next-line typescript/no-explicit-any, typescript/no-unsafe-argument
        this.set(key as any, merge(this.get(key as any), value));
      }
    }

    return this;
  }

  // oxlint-disable-next-line class-methods-use-this
  public omitEmpty(obj: Record<string, unknown>): Record<string, unknown> {
    return Object.keys(obj).reduce<Record<string, unknown>>((acc, key) => {
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
    }, {});
  }

  public when(
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
