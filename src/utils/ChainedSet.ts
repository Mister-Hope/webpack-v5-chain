// oxlint-disable max-classes-per-file
import { Chained } from "./ChainedMap.js";

export class TypedChainedSet<Parent = unknown, Value = unknown> extends Chained<Parent> {
  isSet: boolean;
  store: Set<Value>;

  constructor(parent?: Parent) {
    super(parent);
    this.isSet = false;
    this.store = new Set();
  }

  add(value: Value): this {
    this.isSet = true;
    this.store.add(value);

    return this;
  }

  prepend(value: Value): this {
    this.isSet = true;
    this.store = new Set([value, ...this.store]);

    return this;
  }

  clear(): this {
    this.isSet = true;
    this.store.clear();

    return this;
  }

  delete(key: Value): this {
    // Deleting a missing value is a no-op and must not turn an unset
    // collection into an explicitly empty one.
    if (this.store.delete(key)) this.isSet = true;

    return this;
  }

  values(): Value[] {
    return [...this.store];
  }

  has(key: Value): boolean {
    return this.store.has(key);
  }

  merge(value: Value | Value[]): this {
    this.isSet = true;
    this.store = new Set([...this.store, ...(Array.isArray(value) ? value : [value])]);

    return this;
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
export class ChainedSet<Parent = unknown> extends TypedChainedSet<Parent, any> {}
