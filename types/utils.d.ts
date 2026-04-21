// oxlint-disable max-classes-per-file
export interface Orderable {
  before(name: string): this;
  after(name: string): this;
}

// oxlint-disable-next-line typescript/no-unnecessary-type-parameters
export class Chained<Parent> {
  public batch(handler: (chained: this) => void): this;
  public end(): Parent;
}

export class TypedChainedMap<Parent, OptionsType> extends Chained<Parent> {
  public clear(): this;
  public delete(key: string): this;
  public has(key: string): boolean;
  public get<OptionKey extends keyof OptionsType>(key: OptionKey): OptionsType[OptionKey];
  public getOrCompute<OptionKey extends keyof OptionsType>(
    key: OptionKey,
    compute: () => OptionsType[OptionKey],
  ): OptionsType[OptionKey];
  public set<OptionKey extends keyof OptionsType>(
    key: OptionKey,
    value: OptionsType[OptionKey],
  ): this;
  public merge(obj: Partial<OptionsType>): this;
  public entries(): OptionsType;
  public values<OptionKey extends keyof OptionsType>(): [OptionsType[OptionKey]][];
  public when(
    condition: boolean,
    trueHandler: (obj: this) => void,
    falseHandler?: (obj: this) => void,
  ): this;
}

// oxlint-disable-next-line typescript/no-explicit-any
export class ChainedMap<Parent> extends TypedChainedMap<Parent, any> {}

export class TypedChainedSet<Parent, Value> extends Chained<Parent> {
  public add(value: Value): this;
  public prepend(value: Value): this;
  public clear(): this;
  public delete(key: string): this;
  public has(key: string): boolean;
  public merge(arr: Value[]): this;
  public values(): Value[];
  public when(
    condition: boolean,
    trueHandler: (obj: this) => void,
    falseHandler?: (obj: this) => void,
  ): this;
}

// oxlint-disable-next-line typescript/no-explicit-any
export class ChainedSet<Parent> extends TypedChainedSet<Parent, any> {}
