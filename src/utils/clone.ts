import { isPlainObject } from "./merge.js";

/**
 * Deep clone plain configuration values (objects and arrays) while keeping special values such as
 * RegExp, Date, Map, Set, functions and class instances by reference.
 *
 * `toConfig()` must not expose the mutable objects stored on a chain instance, otherwise mutating
 * the returned configuration would change later results.
 *
 * @param value Value to clone
 * @param seen Already cloned objects, used to preserve cyclic structures
 * @returns Cloned value for plain objects/arrays, the original value otherwise
 */
export const cloneValue = <Value>(value: Value, seen = new WeakMap<object, unknown>()): Value => {
  if (!Array.isArray(value) && !isPlainObject(value)) return value;

  if (seen.has(value)) return seen.get(value) as Value;

  if (Array.isArray(value)) {
    const clone: unknown[] = [];

    seen.set(value, clone);

    for (const item of value) clone.push(cloneValue(item, seen));

    return clone as Value;
  }

  const plainValue = value as Record<string, unknown>;
  const clone: Record<string, unknown> = Object.create(
    Reflect.getPrototypeOf(plainValue),
  ) as Record<string, unknown>;

  seen.set(value, clone);

  for (const [key, item] of Object.entries(plainValue)) {
    Object.defineProperty(clone, key, {
      configurable: true,
      enumerable: true,
      value: cloneValue(item, seen),
      writable: true,
    });
  }

  return clone as Value;
};
