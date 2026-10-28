import merge from "deepmerge";

// Only plain objects are merged recursively. Values such as RegExp, Date, Map,
// Set or class instances are valid webpack configuration values and must be
// kept by reference instead of being turned into plain objects by deepmerge.
export const isPlainObject = (value: unknown): value is Record<string, unknown> => {
  if (typeof value !== "object" || value == null) return false;

  const prototype: unknown = Object.getPrototypeOf(value);

  return prototype === Object.prototype || prototype == null;
};

const mergeOptions = {
  // Arrays keep the historical concatenation behaviour; everything which is
  // not a plain object or an array (RegExp, Date, Map, Set, class instances,
  // ...) is replaced as a whole instead of being turned into a plain object.
  isMergeableObject: (value: unknown): boolean => isPlainObject(value) || Array.isArray(value),
};

// Deep merge two configuration values when both are arrays or plain objects,
// otherwise replace the previous value.
export const mergeValues = <Value>(target: unknown, source: Value): Value => {
  if (Array.isArray(target) && Array.isArray(source))
    return merge(target, source, mergeOptions) as Value;

  if (!isPlainObject(target) || !isPlainObject(source)) return source;

  return merge(target, source, mergeOptions) as Value;
};
