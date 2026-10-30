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

export interface OrderableTarget extends OrderableEntry {
  after: (name: string) => unknown;
  before: (name: string) => unknown;
}

/**
 * Apply `before`/`after` fields from a merged object.
 *
 * @param target Entry to update
 * @param obj Object which may contain before/after fields
 */
export const mergeOrdering = (target: OrderableTarget, obj: Record<string, unknown>): void => {
  if ("before" in obj) target.before(obj.before as string);

  if ("after" in obj) target.after(obj.after as string);
};
