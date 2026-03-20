// oxlint-disable max-classes-per-file
import { Chained } from "./ChainedMap.js";

export class TypedChainedSet<Parent, Value> extends Chained<Parent> {
  store: Set<Value>;

  constructor(parent?: Parent) {
    super(parent);
    this.store = new Set();
  }

  add(value: Value): this {
    this.store.add(value);

    return this;
  }

  prepend(value: Value): this {
    this.store = new Set([value, ...this.store]);

    return this;
  }

  clear(): this {
    this.store.clear();

    return this;
  }

  delete(key: string): this {
    // oxlint-disable-next-line typescript/no-explicit-any
    this.store.delete(key as any);

    return this;
  }

  values(): Value[] {
    return [...this.store];
  }

  has(key: string): boolean {
    // oxlint-disable-next-line typescript/no-explicit-any
    return this.store.has(key as any);
  }

  merge(arr: Value[]): this {
    this.store = new Set([...this.store, ...arr]);

    return this;
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
export class ChainedSet<Parent> extends TypedChainedSet<Parent, any> {}
