export interface Orderable {
  before: (name: string) => this;
  after: (name: string) => this;
}

export interface OrderableEntry {
  __before?: string;
  __after?: string;
}

/**
 * Set a `before` ordering constraint.
 *
 * @param entry Entry to update
 * @param name Name of the entry this one must precede
 */
export const setBefore = (entry: OrderableEntry, name: string): void => {
  if (entry.__before != null)
    throw new Error(`Unable to set .before(${JSON.stringify(name)}) twice for the same entry`);

  if (entry.__after) {
    throw new Error(
      `Unable to set .before(${JSON.stringify(name)}) with existing value for .after()`,
    );
  }

  entry.__before = name;
};

/**
 * Set an `after` ordering constraint.
 *
 * @param entry Entry to update
 * @param name Name of the entry this one must follow
 */
export const setAfter = (entry: OrderableEntry, name: string): void => {
  if (entry.__after != null)
    throw new Error(`Unable to set .after(${JSON.stringify(name)}) twice for the same entry`);

  if (entry.__before) {
    throw new Error(
      `Unable to set .after(${JSON.stringify(name)}) with existing value for .before()`,
    );
  }

  entry.__after = name;
};

// oxlint-disable-next-line typescript/no-explicit-any
export const createOrderable = <TBase extends new (...args: any[]) => any>(
  superClass: TBase,
): new (
  ...args: ConstructorParameters<TBase>
) => InstanceType<TBase> & Orderable & { __before?: string; __after?: string } =>
  class OrderableClass extends superClass {
    __before?: string;
    __after?: string;

    before(name: string): this {
      setBefore(this, name);

      return this;
    }

    after(name: string): this {
      setAfter(this, name);

      return this;
    }

    merge(obj: Record<string, unknown>, omit: string[] = []): this {
      if ("before" in obj) this.before(obj.before as string);

      if ("after" in obj) this.after(obj.after as string);

      // oxlint-disable-next-line typescript/no-unsafe-return, typescript/no-unsafe-call, typescript/no-unsafe-member-access
      return super.merge(obj, [...omit, "before", "after"]);
    }
  };
