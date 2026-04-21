// oxlint-disable max-classes-per-file
import { Chained } from "./ChainedMap.js";

export class TypedChainedSet<Parent = unknown, Value = unknown> extends Chained<Parent> {
  public store: Set<Value>;

  public constructor(parent?: Parent) {
    super(parent);
    this.store = new Set();
  }

  public add(value: Value): this {
    this.store.add(value);

    return this;
  }

  public prepend(value: Value): this {
    this.store = new Set([value, ...this.store]);

    return this;
  }

  public clear(): this {
    this.store.clear();

    return this;
  }

  public delete(key: string): this {
    // oxlint-disable-next-line typescript/no-explicit-any, typescript/no-unsafe-argument
    this.store.delete(key as any);

    return this;
  }

  public values(): Value[] {
    return [...this.store];
  }

  public has(key: string): boolean {
    // oxlint-disable-next-line typescript/no-explicit-any, typescript/no-unsafe-argument
    return this.store.has(key as any);
  }

  public merge(arr: Value[]): this {
    this.store = new Set([...this.store, ...arr]);

    return this;
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
export class ChainedSet<Parent = unknown> extends TypedChainedSet<Parent, any> {}
