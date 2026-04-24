export interface Orderable {
  before(name: string): this;
  after(name: string): this;
}

// oxlint-disable-next-line typescript/no-explicit-any, typescript/explicit-module-boundary-types
export const createOrderable = <TBase extends new (...args: any[]) => any>(
  superClass: TBase,
  // oxlint-disable-next-line typescript/explicit-function-return-type
) =>
  class OrderableClass extends superClass {
    public __before?: string;
    public __after?: string;

    public before(name: string): this {
      if (this.__after) {
        throw new Error(
          `Unable to set .before(${JSON.stringify(name)}) with existing value for .after()`,
        );
      }

      this.__before = name;

      return this;
    }

    public after(name: string): this {
      if (this.__before) {
        throw new Error(
          `Unable to set .after(${JSON.stringify(name)}) with existing value for .before()`,
        );
      }

      this.__after = name;

      return this;
    }

    public merge(obj: Record<string, unknown>, omit: string[] = []): this {
      if ("before" in obj) this.before(obj.before as string);

      if ("after" in obj) this.after(obj.after as string);

      // oxlint-disable-next-line typescript/no-unsafe-return, typescript/no-unsafe-call, typescript/no-unsafe-member-access
      return super.merge(obj, [...omit, "before", "after"]);
    }
  };
