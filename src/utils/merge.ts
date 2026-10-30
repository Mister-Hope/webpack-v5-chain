import merge from "deepmerge";

// Only plain objects are merged recursively. Values such as RegExp, Date, Map,
// Set or class instances are valid webpack configuration values and must be
// kept by reference instead of being turned into plain objects by deepmerge.
export const isPlainObject = (value: unknown): value is Record<string, unknown> => {
  if (typeof value !== "object" || value == null) return false;

  const prototype: unknown = Object.getPrototypeOf(value);

  return prototype === Object.prototype || prototype == null;
};

// deepmerge recurses forever on cyclic plain objects/arrays. Cyclic values are
// rare in webpack configs and cannot be merged meaningfully, so fall back to
// replacing the previous value instead of crashing.
const hasCycle = (value: unknown, stack: object[] = []): boolean => {
  if (!Array.isArray(value) && !isPlainObject(value)) return false;

  if (stack.includes(value as object)) return true;

  stack.push(value as object);

  const children: unknown[] = Array.isArray(value) ? value : Object.values(value);
  const cyclic = children.some((child) => hasCycle(child, stack));

  stack.pop();

  return cyclic;
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
  if (Array.isArray(target) && Array.isArray(source)) {
    return (
      hasCycle(target) || hasCycle(source) ? source : merge(target, source, mergeOptions)
    ) as Value;
  }

  if (!isPlainObject(target) || !isPlainObject(source)) return source;

  return (
    hasCycle(target) || hasCycle(source) ? source : merge(target, source, mergeOptions)
  ) as Value;
};

// Merge an object's entries into a chained map through the provided accessors.
export const mergeEntries = (
  entries: Record<string, unknown>,
  omit: string[],
  get: (key: string) => unknown,
  set: (key: string, value: unknown) => void,
): void => {
  for (const key of Object.keys(entries)) {
    if (omit.includes(key)) continue;

    set(key, mergeValues(get(key), entries[key]));
  }
};
