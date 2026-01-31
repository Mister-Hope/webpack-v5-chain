import { expect, it } from "vitest";

import { ChainedMap } from "../src/utils/ChainedMap.js";

it("is Chainable", () => {
  const parent = { parent: true };
  const map = new ChainedMap(parent);

  expect(map.end()).toBe(parent);
});

it("creates a backing Map", () => {
  const map = new ChainedMap();

  expect(map.store instanceof Map).toBeTruthy();
});

it("set", () => {
  const map = new ChainedMap();

  expect(map.set("a", "alpha")).toBe(map);
  expect(map.store.get("a")).toBe("alpha");
});

it("get", () => {
  const map = new ChainedMap();

  expect(map.set("a", "alpha")).toBe(map);
  expect(map.get("a")).toBe("alpha");
});

it("getOrCompute", () => {
  const map = new ChainedMap();

  expect(map.get("a")).toBeUndefined();
  expect(map.getOrCompute("a", () => "alpha")).toBe("alpha");
  expect(map.get("a")).toBe("alpha");
});

it("clear", () => {
  const map = new ChainedMap();

  map.set("a", "alpha");
  map.set("b", "beta");
  map.set("c", "gamma");

  expect(map.store.size).toBe(3);
  expect(map.clear()).toBe(map);
  expect(map.store.size).toBe(0);
});

it("delete", () => {
  const map = new ChainedMap();

  map.set("a", "alpha");
  map.set("b", "beta");
  map.set("c", "gamma");

  expect(map.delete("b")).toBe(map);
  expect(map.store.size).toBe(2);
  expect(map.store.has("b")).toBeFalsy();
});

it("has", () => {
  const map = new ChainedMap();

  map.set("a", "alpha");
  map.set("b", "beta");
  map.set("c", "gamma");

  expect(map.has("b")).toBeTruthy();
  expect(map.has("d")).toBeFalsy();
  expect(map.has("b")).toBe(map.store.has("b"));
});

it("values", () => {
  const map = new ChainedMap();

  map.set("a", "alpha");
  map.set("b", "beta");
  map.set("c", "gamma");

  expect(map.values()).toStrictEqual(["alpha", "beta", "gamma"]);
});

it("entries with values", () => {
  const map = new ChainedMap();

  map.set("a", "alpha");
  map.set("b", "beta");
  map.set("c", "gamma");

  expect(map.entries()).toStrictEqual({ a: "alpha", b: "beta", c: "gamma" });
});

it("entries with no values", () => {
  const map = new ChainedMap();

  expect(map.entries()).toBeUndefined();
});

it("merge with no values", () => {
  const map = new ChainedMap();
  const obj = { a: "alpha", b: "beta", c: "gamma" };

  expect(map.merge(obj)).toBe(map);
  expect(map.entries()).toStrictEqual(obj);
});

it("merge with existing values", () => {
  const map = new ChainedMap();
  const obj = { a: "alpha", b: "beta", c: "gamma" };

  map.set("d", "delta");

  expect(map.merge(obj)).toBe(map);
  expect(map.entries()).toStrictEqual({
    a: "alpha",
    b: "beta",
    c: "gamma",
    d: "delta",
  });
});

it("merge with overriding values", () => {
  const map = new ChainedMap();
  const obj = { a: "alpha", b: "beta", c: "gamma" };

  map.set("b", "delta");

  expect(map.merge(obj)).toBe(map);
  expect(map.entries()).toStrictEqual({ a: "alpha", b: "beta", c: "gamma" });
});

it("merge with omitting keys", () => {
  const map = new ChainedMap();
  const obj = { a: "alpha", b: "beta", c: "gamma" };

  map.merge(obj, ["b"]);

  expect(map.entries()).toStrictEqual({ a: "alpha", c: "gamma" });
});

it("when true", () => {
  const map = new ChainedMap();
  const right = (instance) => {
    expect(instance).toBe(map);
    instance.set("alpha", "a");
  };
  const left = (instance) => {
    instance.set("beta", "b");
  };

  expect(map.when(true, right, left)).toBe(map);
  expect(map.has("alpha")).toBeTruthy();
  expect(map.has("beta")).toBeFalsy();
});

it("when false", () => {
  const map = new ChainedMap();
  const right = (instance) => {
    instance.set("alpha", "a");
  };
  const left = (instance) => {
    expect(instance).toBe(map);
    instance.set("beta", "b");
  };

  expect(map.when(false, right, left)).toBe(map);
  expect(map.has("alpha")).toBeFalsy();
  expect(map.has("beta")).toBeTruthy();
});

it("clean undefined", () => {
  const map = new ChainedMap();

  map.set("alpha", undefined);
  map.set("beta", "b");

  expect("alpha" in map.entries()).toBeTruthy();
  expect("alpha" in map.clean(map.entries())).toBeFalsy();
  expect("beta" in map.clean(map.entries())).toBeTruthy();
});

it("clean empty array", () => {
  const map = new ChainedMap();

  map.set("alpha", []);
  expect("alpha" in map.entries()).toBeTruthy();
  expect("alpha" in map.clean(map.entries())).toBeFalsy();
});

it("clean empty object", () => {
  const map = new ChainedMap();

  map.set("alpha", {});
  expect("alpha" in map.entries()).toBeTruthy();
  expect("alpha" in map.clean(map.entries())).toBeFalsy();
});

it("merge with nested object deep merge", () => {
  const map = new ChainedMap();
  map.set("nested", { a: 1 });
  map.merge({
    nested: { b: 2 },
  });
  expect(map.get("nested")).toStrictEqual({ a: 1, b: 2 });
});

it("when with defaults", () => {
  const map = new ChainedMap();
  map.when(true);
  map.when(false);
});
