// oxlint-disable max-classes-per-file
import { Chained } from "./ChainedMap.js";
import { cloneValue } from "./clone.js";

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
    // Mutate the existing Set instead of replacing it so references held by
    // other code stay valid; an existing value is moved to the front.
    this.store.delete(value);
    const values = [value, ...this.store];

    this.store.clear();

    for (const item of values) this.store.add(item);

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
    return [...this.store].map((value) => cloneValue(value));
  }

  has(key: Value): boolean {
    return this.store.has(key);
  }

  merge(value: Value | Value[]): this {
    this.isSet = true;

    for (const item of Array.isArray(value) ? value : [value]) this.store.add(item);

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
