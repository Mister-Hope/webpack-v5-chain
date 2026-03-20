export interface Orderable {
  before(name: string): this;
  after(name: string): this;
}

// oxlint-disable-next-line typescript/no-explicit-any
export const createOrderable = <TBase extends new (...args: any[]) => any>(
  superClass: TBase,
) =>
  class OrderableClass extends superClass {
    __before?: string;
    __after?: string;

    before(name: string): this {
      if (this.__after) {
        throw new Error(
          `Unable to set .before(${JSON.stringify(name)}) with existing value for .after()`,
        );
      }

      this.__before = name;

      return this;
    }

    after(name: string): this {
      if (this.__before) {
        throw new Error(
          `Unable to set .after(${JSON.stringify(name)}) with existing value for .before()`,
        );
      }

      this.__after = name;

      return this;
    }

    merge(obj: Record<string, unknown>, omit: string[] = []): this {
      if ("before" in obj) this.before(obj.before as string);

      if ("after" in obj) this.after(obj.after as string);

      return super.merge(obj, [...omit, "before", "after"]);
    }
  };
