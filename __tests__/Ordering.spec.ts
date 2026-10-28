import { describe, expect, it } from "vitest";

import { Config } from "../src/index.js";
import { ChainedMap } from "../src/utils/ChainedMap.js";
import { ChainedValueMap } from "../src/utils/ChainedValueMap.js";

interface OrderedValue {
  name: string;
}

const buildMap = (names: string[]): ChainedMap => {
  const map = new ChainedMap();

  for (const name of names) map.set(name, { name });

  return map;
};

const orderOf = (map: ChainedMap): string[] =>
  map.values().map((value) => (value as OrderedValue).name);

const permutations = <Value>(values: Value[]): Value[][] => {
  if (values.length <= 1) return [values];

  const result: Value[][] = [];

  for (const [index, value] of values.entries()) {
    for (const rest of permutations([...values.slice(0, index), ...values.slice(index + 1)]))
      result.push([value, ...rest]);
  }

  return result;
};

describe("before/after ordering", () => {
  it("keeps insertion order without constraints", () => {
    const map = buildMap(["a", "b", "c"]);

    expect(orderOf(map)).toStrictEqual(["a", "b", "c"]);
    expect(map.order().order).toStrictEqual(["a", "b", "c"]);
  });

  it("orders a single before constraint", () => {
    const map = buildMap(["b", "a"]);

    Object.assign(map.get("a"), { __before: "b" });

    expect(orderOf(map)).toStrictEqual(["a", "b"]);
  });

  it("orders a single after constraint", () => {
    const map = buildMap(["a", "b"]);

    Object.assign(map.get("b"), { __after: "a" });

    expect(orderOf(map)).toStrictEqual(["a", "b"]);
  });

  it("resolves transitive after constraints", () => {
    const map = buildMap(["a", "b", "c"]);

    Object.assign(map.get("a"), { __after: "b" });
    Object.assign(map.get("b"), { __after: "c" });

    expect(orderOf(map)).toStrictEqual(["c", "b", "a"]);
  });

  it("resolves transitive before constraints", () => {
    const map = buildMap(["c", "b", "a"]);

    Object.assign(map.get("a"), { __before: "b" });
    Object.assign(map.get("b"), { __before: "c" });

    expect(orderOf(map)).toStrictEqual(["a", "b", "c"]);
  });

  it("resolves a four entry after chain for every insertion order", () => {
    for (const names of permutations(["a", "b", "c", "d"])) {
      const map = buildMap(names);

      Object.assign(map.get("a"), { __after: "b" });
      Object.assign(map.get("b"), { __after: "c" });
      Object.assign(map.get("c"), { __after: "d" });

      expect(orderOf(map)).toStrictEqual(["d", "c", "b", "a"]);
    }
  });

  it("resolves crossing before constraints", () => {
    const map = buildMap(["a", "b", "c"]);

    Object.assign(map.get("a"), { __before: "c" });
    Object.assign(map.get("c"), { __before: "b" });

    expect(orderOf(map)).toStrictEqual(["a", "c", "b"]);
  });

  it("handles both ends of the same constraint", () => {
    const map = buildMap(["b", "a"]);

    Object.assign(map.get("a"), { __before: "b" });
    Object.assign(map.get("b"), { __after: "a" });

    expect(orderOf(map)).toStrictEqual(["a", "b"]);
  });

  it("ignores self references", () => {
    const map = buildMap(["a", "b", "c"]);

    Object.assign(map.get("c"), { __before: "c" });

    expect(orderOf(map)).toStrictEqual(["a", "b", "c"]);
  });

  it("ignores constraints pointing at missing entries", () => {
    const map = buildMap(["a", "b"]);

    Object.assign(map.get("a"), { __before: "missing" });
    Object.assign(map.get("b"), { __after: "missing" });

    expect(orderOf(map)).toStrictEqual(["a", "b"]);
  });

  it("ignores missing after targets while repairing", () => {
    const map = buildMap(["a", "b", "c", "d"]);

    Object.assign(map.get("a"), { __after: "missing" });
    Object.assign(map.get("b"), { __after: "c" });
    Object.assign(map.get("c"), { __after: "d" });

    expect(orderOf(map)).toStrictEqual(["a", "d", "c", "b"]);
  });

  it("falls back to after when before is unusable", () => {
    const emptyBefore = buildMap(["a", "b"]);

    Object.assign(emptyBefore.get("a"), { __before: "", __after: "b" });

    expect(orderOf(emptyBefore)).toStrictEqual(["b", "a"]);

    const missingBefore = buildMap(["a", "b"]);

    Object.assign(missingBefore.get("a"), { __before: "missing", __after: "b" });

    expect(orderOf(missingBefore)).toStrictEqual(["b", "a"]);
  });

  it("falls back to after when before is a self reference", () => {
    const map = buildMap(["a", "b"]);

    Object.assign(map.get("a"), { __before: "a", __after: "b" });

    expect(orderOf(map)).toStrictEqual(["b", "a"]);
  });

  it("keeps a deterministic order for cycles", () => {
    const forward = buildMap(["a", "b"]);

    Object.assign(forward.get("a"), { __before: "b" });
    Object.assign(forward.get("b"), { __before: "a" });

    // Unsatisfiable constraints cannot be honored; the historical order wins.
    expect(orderOf(forward)).toStrictEqual(["b", "a"]);

    const backward = buildMap(["b", "a"]);

    Object.assign(backward.get("a"), { __before: "b" });
    Object.assign(backward.get("b"), { __before: "a" });

    expect(orderOf(backward)).toStrictEqual(["a", "b"]);
  });

  it("deduplicates crossing constraints while repairing", () => {
    const map = buildMap(["a", "b", "x", "y", "z"]);

    Object.assign(map.get("a"), { __before: "b" });
    Object.assign(map.get("b"), { __after: "a" });
    Object.assign(map.get("x"), { __after: "y" });
    Object.assign(map.get("y"), { __after: "z" });

    expect(orderOf(map)).toStrictEqual(["a", "b", "z", "y", "x"]);
  });

  it("keeps entries outside a cycle ordered", () => {
    const map = buildMap(["a", "b", "c"]);

    Object.assign(map.get("a"), { __before: "b" });
    Object.assign(map.get("b"), { __before: "a" });

    // The cycle takes part of the entries; unconstrained entries stay ordered.
    expect(orderOf(map)).toStrictEqual(["c", "b", "a"]);
    expect(map.order().order).toStrictEqual(["c", "b", "a"]);
  });

  it("ignores non-object values and supports function values", () => {
    const map = new ChainedMap();

    map.set("nil", null);
    map.set("alpha", "alpha");
    map.set(
      "fn",
      Object.assign(() => "fn", { __before: "alpha" }),
    );

    expect(map.order().order).toStrictEqual(["nil", "fn", "alpha"]);
  });

  it("keeps every entry name in the entries object", () => {
    const map = new ChainedMap();

    map.set("__proto__", { name: "proto" });
    map.set("normal", { name: "normal" });

    const { entries } = map.order();

    expect(Object.keys(entries)).toStrictEqual(["__proto__", "normal"]);
    expect(Object.getPrototypeOf(entries)).toBe(Object.prototype);
    expect(Object.getOwnPropertyDescriptor(entries, "__proto__")?.value).toStrictEqual({
      name: "proto",
    });
  });

  it("keeps the historical order for integer-like entry names", () => {
    const map = buildMap(["2", "1", "b", "a"]);

    expect(map.order().order).toStrictEqual(["1", "2", "b", "a"]);
    expect(Object.keys(map.order().entries)).toStrictEqual(["1", "2", "b", "a"]);
  });

  it("supports numeric Map keys as constraint targets", () => {
    const map = new ChainedMap();

    map.set(1, { name: "one" });
    map.set("a", { name: "a", __before: "1" });
    map.set("b", { name: "b" });

    expect(orderOf(map)).toStrictEqual(["a", "one", "b"]);

    const after = new ChainedMap();

    after.set("a", { name: "a" });
    after.set(2, { name: "two", __after: "a" });
    after.set("b", { name: "b" });

    expect(orderOf(after)).toStrictEqual(["a", "two", "b"]);

    const numericTarget = new ChainedMap();

    numericTarget.set(2, { name: "two" });
    numericTarget.set(1, { name: "one", __before: "2" });

    expect(orderOf(numericTarget)).toStrictEqual(["one", "two"]);
  });

  it("orders __proto__ entry names when repairing", () => {
    const map = buildMap(["a", "b", "__proto__"]);

    Object.assign(map.get("b"), { __after: "__proto__" });
    Object.assign(map.get("a"), { __after: "b" });

    expect(orderOf(map)).toStrictEqual(["__proto__", "b", "a"]);
  });

  it("orders ChainedValueMap entries", () => {
    const map = new ChainedValueMap();

    map.set("a", { name: "a" });
    map.set("b", { name: "b" });
    map.set("c", { name: "c" });

    Object.assign(map.get("a") as object, { __after: "b" });
    Object.assign(map.get("b") as object, { __after: "c" });

    expect((map.values() as OrderedValue[]).map((value) => value.name)).toStrictEqual([
      "c",
      "b",
      "a",
    ]);
  });

  it("ignores missing plugin order targets", () => {
    const config = new Config();

    config
      .plugin("a")
      .use(class PluginA {})
      .after("missing");
    config
      .plugin("b")
      .use(class PluginB {})
      .after("c");
    config
      .plugin("c")
      .use(class PluginC {})
      .after("d");
    config.plugin("d").use(class PluginD {});

    expect(
      config
        .toConfig()
        .plugins?.map((plugin) => (plugin as unknown as { __pluginName: string }).__pluginName),
    ).toStrictEqual(["a", "d", "c", "b"]);
  });

  it("falls back to after when before is an empty name", () => {
    const config = new Config();

    config.plugin("a").use(class PluginA {});
    config.plugin("b").use(class PluginB {});
    config.plugin("a").before("").after("b");

    expect(
      config
        .toConfig()
        .plugins?.map((plugin) => (plugin as unknown as { __pluginName: string }).__pluginName),
    ).toStrictEqual(["b", "a"]);
  });

  it("orders plugins through the public Config API", () => {
    const config = new Config();

    config.plugin("a").use(class PluginA {});
    config.plugin("b").use(class PluginB {});
    config.plugin("c").use(class PluginC {});

    config.plugin("a").after("b");
    config.plugin("b").after("c");

    expect(
      config
        .toConfig()
        .plugins?.map((plugin) => (plugin as unknown as { __pluginName: string }).__pluginName),
    ).toStrictEqual(["c", "b", "a"]);
  });
});
