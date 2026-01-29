import { expect, it } from "vitest";

import { ChainedMap } from "../src/utils/ChainedMap.js";
import { createOrderable } from "../src/utils/Orderable.js";

const Ordered = createOrderable(class Test extends ChainedMap {});

it("before", () => {
  const ordered = new Ordered();
  const instance = ordered.set("gamma").before("beta");

  expect(instance).toBe(ordered);
  expect(ordered.__before).toBe("beta");
});

it("after", () => {
  const ordered = new Ordered();
  const instance = ordered.set("gamma").after("alpha");

  expect(instance).toBe(ordered);
  expect(ordered.__after).toBe("alpha");
});

it("before throws with after", () => {
  const ordered = new Ordered();

  expect(() => ordered.after("alpha").before("beta")).toThrow();
});

it("after throws with before", () => {
  const ordered = new Ordered();

  expect(() => ordered.before("beta").after("alpha")).toThrow();
});

it("ordering before", () => {
  const map = new ChainedMap();

  map.set("beta", new Ordered().set("beta", "beta"));
  map.set("alpha", new Ordered().set("alpha", "alpha").before("beta"));

  expect(map.values().map((item) => item.values())).toStrictEqual([["alpha"], ["beta"]]);
});

it("ordering after", () => {
  const map = new ChainedMap();

  map.set("beta", new Ordered().set("beta", "beta").after("alpha"));
  map.set("alpha", new Ordered().set("alpha", "alpha"));

  expect(map.values().map((item) => item.values())).toStrictEqual([["alpha"], ["beta"]]);
});

it("ordering before and after", () => {
  const map = new ChainedMap();

  map.set("beta", new Ordered().set("beta", "beta"));
  map.set("gamma", new Ordered().set("gamma", "gamma").after("beta"));
  map.set("alpha", new Ordered().set("alpha", "alpha").before("beta"));

  expect(map.values().map((item) => item.values())).toStrictEqual([["alpha"], ["beta"], ["gamma"]]);
});

it("merge with before", () => {
  const ordered = new Ordered();
  const instance = ordered.set("gamma").merge({
    before: "beta",
  });

  expect(instance).toBe(ordered);
  expect(ordered.__before).toBe("beta");
});

it("merge with after", () => {
  const ordered = new Ordered();
  const instance = ordered.set("gamma").merge({
    after: "alpha",
  });

  expect(instance).toBe(ordered);
  expect(ordered.__after).toBe("alpha");
});

it("merging throws using before with after", () => {
  expect(() => new Ordered().merge({ before: "beta", after: "alpha" })).toThrow();
});
