import { expect, it } from "vitest";

import { ChainedSet } from "../src/utils/ChainedSet.js";

it("is Chainable", () => {
  const parent = { parent: true };
  const set = new ChainedSet(parent);

  expect(set.end()).toBe(parent);
});

it("creates a backing Set", () => {
  const set = new ChainedSet();

  expect(set.store instanceof Set).toBeTruthy();
});

it("add", () => {
  const set = new ChainedSet();

  expect(set.add("alpha")).toBe(set);
  expect(set.store.has("alpha")).toBeTruthy();
  expect(set.store.size).toBe(1);
});

it("prepend", () => {
  const set = new ChainedSet();

  set.add("alpha");

  expect(set.prepend("beta")).toBe(set);
  expect(set.store.has("beta")).toBeTruthy();
  expect([...set.store]).toStrictEqual(["beta", "alpha"]);
});

it("clear", () => {
  const set = new ChainedSet();

  set.add("alpha");
  set.add("beta");
  set.add("gamma");

  expect(set.store.size).toBe(3);
  expect(set.clear()).toBe(set);
  expect(set.store.size).toBe(0);
});

it("delete", () => {
  const set = new ChainedSet();

  set.add("alpha");
  set.add("beta");
  set.add("gamma");

  expect(set.delete("beta")).toBe(set);
  expect(set.store.size).toBe(2);
  expect(set.store.has("beta")).toBeFalsy();
});

it("has", () => {
  const set = new ChainedSet();

  set.add("alpha");
  set.add("beta");
  set.add("gamma");

  expect(set.has("beta")).toBeTruthy();
  expect(set.has("delta")).toBeFalsy();
  expect(set.has("beta")).toBe(set.store.has("beta"));
});

it("values", () => {
  const set = new ChainedSet();

  set.add("alpha");
  set.add("beta");
  set.add("gamma");

  expect(set.values()).toStrictEqual(["alpha", "beta", "gamma"]);
});

it("merge with no values", () => {
  const set = new ChainedSet();
  const arr = ["alpha", "beta", "gamma"];

  expect(set.merge(arr)).toBe(set);
  expect(set.values()).toStrictEqual(arr);
});

it("merge with existing values", () => {
  const set = new ChainedSet();
  const arr = ["alpha", "beta", "gamma"];

  set.add("delta");

  expect(set.merge(arr)).toBe(set);
  expect(set.values()).toStrictEqual(["delta", "alpha", "beta", "gamma"]);
});

it("when true", () => {
  const set = new ChainedSet();
  const right = (instance) => {
    expect(instance).toBe(set);
    instance.add("alpha");
  };
  const left = (instance) => {
    instance.add("beta");
  };

  expect(set.when(true, right, left)).toBe(set);
  expect(set.has("alpha")).toBeTruthy();
  expect(set.has("beta")).toBeFalsy();
});

it("when false", () => {
  const set = new ChainedSet();
  const right = (instance) => {
    instance.add("alpha");
  };
  const left = (instance) => {
    expect(instance).toBe(set);
    instance.add("beta");
  };

  expect(set.when(false, right, left)).toBe(set);
  expect(set.has("alpha")).toBeFalsy();
  expect(set.has("beta")).toBeTruthy();
});
