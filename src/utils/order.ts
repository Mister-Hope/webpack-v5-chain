interface OrderConstraint {
  target: string;
  type: "before" | "after";
}

const isObjectLike = (value: unknown): value is Record<string, unknown> =>
  (typeof value === "object" && value != null) || typeof value === "function";

const getConstraint = (
  value: unknown,
  name: string,
  names: Set<string>,
): OrderConstraint | null => {
  if (!isObjectLike(value)) return null;

  const { __after, __before } = value;
  // Match the historical `if (__before && order.includes(__before)) ... else if
  // (__after && ...)` semantics: empty strings and unknown targets fall through
  // to the `__after` constraint. The keys compared here are the string keys of
  // the entries object, so numeric Map keys work like they did before.
  const isValidTarget = (target: unknown): target is string =>
    typeof target === "string" && target !== "" && target !== name && names.has(target);

  if (isValidTarget(__before)) return { target: __before, type: "before" };

  if (isValidTarget(__after)) return { target: __after, type: "after" };

  return null;
};

// Historical single pass over the entries. Kept as the primary pass so
// configurations which already produced a valid order keep their exact
// ordering.
const resolveLegacyOrder = (
  names: string[],
  constraints: Map<string, OrderConstraint>,
): string[] => {
  const order = [...names];

  for (const name of names) {
    const constraint = constraints.get(name);

    if (!constraint) continue;

    order.splice(order.indexOf(name), 1);
    order.splice(
      constraint.type === "before"
        ? order.indexOf(constraint.target)
        : order.indexOf(constraint.target) + 1,
      0,
      name,
    );
  }

  return order;
};

// Whether the given order honors every declared constraint.
const isOrderSatisfied = (order: string[], constraints: Map<string, OrderConstraint>): boolean => {
  const positions: Record<string, number> = Object.fromEntries(
    order.map((name, index) => [name, index]),
  );

  return [...constraints].every(([name, { target, type }]) =>
    type === "before" ? positions[name] < positions[target] : positions[name] > positions[target],
  );
};

// Stable topological sort using the historical order as tie-breaker. Used when
// the historical order violates a constraint, e.g. for constraint chains or
// crossing constraints.
const sortTopologically = (
  names: string[],
  constraints: Map<string, OrderConstraint>,
  positions: Record<string, number>,
): string[] => {
  // Null prototype so entry names such as `__proto__` or `constructor` are
  // stored as own keys instead of hitting Object.prototype.
  const successors = Object.create(null) as Record<string, Set<string>>;
  const indegrees = Object.create(null) as Record<string, number>;

  for (const name of names) {
    successors[name] = new Set();
    indegrees[name] = 0;
  }

  for (const [name, { target, type }] of constraints) {
    const from = type === "before" ? name : target;
    const to = type === "before" ? target : name;

    if (successors[from].has(to)) continue;

    successors[from].add(to);
    indegrees[to] += 1;
  }

  const emitted = new Set<string>();
  const sorted: string[] = [];

  for (;;) {
    let next: string | null = null;

    for (const name of names) {
      if (emitted.has(name) || indegrees[name] !== 0) continue;

      if (next == null || positions[name] < positions[next]) next = name;
    }

    if (next == null) break;

    emitted.add(next);
    sorted.push(next);

    for (const successor of successors[next]) indegrees[successor] -= 1;
  }

  // Cycles cannot be satisfied: append all entries which could not be emitted
  // (the cycle members and the entries only reachable through them) in their
  // historical order to keep the result deterministic.
  for (const name of names
    .filter((entry) => !emitted.has(entry))
    .toSorted((a, b) => positions[a] - positions[b]))
    sorted.push(name);

  return sorted;
};

// Build the entries object of the map, keeping the insertion order.
const createEntries = (store: Map<string, unknown>, names: string[]): Record<string, unknown> => {
  const entries: Record<string, unknown> = {};

  for (const name of names) {
    // defineProperty keeps names such as `__proto__` as own properties instead
    // of triggering the accumulator prototype setter.
    Object.defineProperty(entries, name, {
      configurable: true,
      enumerable: true,
      value: store.get(name),
      writable: true,
    });
  }

  return entries;
};

// Resolve the order of the entries of a chained map from the `__before` /
// `__after` constraints stored on their values.
//
// The historical single-pass order is kept as the primary result because it is
// the observable behaviour of the previous releases; when it violates a
// declared constraint the entries are re-ordered with a stable topological
// sort which uses the historical order as tie-breaker.
//
// Constraints pointing at a missing entry or at the entry itself are ignored.
// Cycles cannot be satisfied: every entry which cannot be emitted (the cycle
// members and entries only reachable through them) is appended after the
// ordered ones, in the historical order, so the result stays deterministic.
export const orderEntries = (
  store: Map<string, unknown>,
): {
  entries: Record<string, unknown>;
  order: string[];
} => {
  const entries = createEntries(store, [...store.keys()]);
  // Object.keys also orders integer-like names first, matching the previous
  // implementation which derived the names from the entries object.
  const names = Object.keys(entries);
  const constraints = new Map<string, OrderConstraint>();
  const namesSet = new Set(names);

  for (const name of names) {
    const constraint = getConstraint(entries[name], name, namesSet);

    if (constraint) constraints.set(name, constraint);
  }

  const order = resolveLegacyOrder(names, constraints);

  if (isOrderSatisfied(order, constraints)) return { entries, order };

  const positions: Record<string, number> = Object.fromEntries(
    order.map((name, index) => [name, index]),
  );

  return {
    entries,
    order: sortTopologically(names, constraints, positions),
  };
};
