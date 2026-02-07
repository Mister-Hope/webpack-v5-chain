// oxlint-disable max-classes-per-file
export interface Orderable {
  before(name: string): this;
  after(name: string): this;
}

export class Chained<Parent> {
  batch(handler: (chained: this) => void): this;
  end(): Parent;
}

export class TypedChainedMap<Parent, OptionsType> extends Chained<Parent> {
  clear(): this;
  delete(key: string): this;
  has(key: string): boolean;
  get<OptionKey extends keyof OptionsType>(key: OptionKey): OptionsType[OptionKey];
  getOrCompute<OptionKey extends keyof OptionsType>(
    key: OptionKey,
    compute: () => OptionsType[OptionKey],
  ): OptionsType[OptionKey];
  set<OptionKey extends keyof OptionsType>(key: OptionKey, value: OptionsType[OptionKey]): this;
  merge(obj: Partial<OptionsType>): this;
  entries(): OptionsType;
  values<OptionKey extends keyof OptionsType>(): [OptionsType[OptionKey]][];
  when(
    condition: boolean,
    trueHandler: (obj: this) => void,
    falseHandler?: (obj: this) => void,
  ): this;
}

// oxlint-disable-next-line typescript/no-explicit-any
export class ChainedMap<Parent> extends TypedChainedMap<Parent, any> {}

export class TypedChainedSet<Parent, Value> extends Chained<Parent> {
  add(value: Value): this;
  prepend(value: Value): this;
  clear(): this;
  delete(key: string): this;
  has(key: string): boolean;
  merge(arr: Value[]): this;
  values(): Value[];
  when(
    condition: boolean,
    trueHandler: (obj: this) => void,
    falseHandler?: (obj: this) => void,
  ): this;
}

// oxlint-disable-next-line typescript/no-explicit-any
export class ChainedSet<Parent> extends TypedChainedSet<Parent, any> {}
