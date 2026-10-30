export const omitEmpty = (obj: Record<string, unknown>, keep: string[]): Record<string, unknown> =>
  Object.keys(obj).reduce<Record<string, unknown>>((acc, key) => {
    const value = obj[key];

    // oxlint-disable-next-line no-undefined
    if (value === undefined) return acc;

    if (keep.includes(key)) {
      acc[key] = value;

      return acc;
    }

    if (Array.isArray(value) && value.length === 0) return acc;

    if (
      Object.prototype.toString.call(value) === "[object Object]" &&
      Object.keys(value as object).length === 0
    )
      return acc;

    acc[key] = value;

    return acc;
  }, {});

export const when = <Target>(
  target: Target,
  condition: boolean,
  whenTruthy: (obj: Target) => void,
  whenFalsy: (obj: Target) => void,
): Target => {
  if (condition) whenTruthy(target);
  else whenFalsy(target);

  return target;
};
