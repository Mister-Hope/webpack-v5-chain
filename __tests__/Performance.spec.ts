import { describe, expect, it } from "vitest";

import { Performance } from "../src/Performance.js";

describe("performance", () => {
  it("is Chainable", () => {
    const parent = { parent: true };
    const performance = new Performance(parent as any);

    expect(performance.end()).toBe(parent);
  });

  it("supports webpack 5.112 performance options", () => {
    const performance = new Performance();

    performance
      .all(true)
      .analyzableBailouts(true)
      .asyncChunkWaterfalls(false)
      .conflictingResourceHints(true)
      .scopeHoistingBailouts(false)
      .splitChunksCapped(true)
      .topLevelThis(false)
      .unsplitVendors(true)
      .unusedConfig(false)
      .unusedModules(true);

    expect(performance.entries()).toStrictEqual({
      all: true,
      analyzableBailouts: true,
      asyncChunkWaterfalls: false,
      conflictingResourceHints: true,
      scopeHoistingBailouts: false,
      splitChunksCapped: true,
      topLevelThis: false,
      unsplitVendors: true,
      unusedConfig: false,
      unusedModules: true,
    });
  });

  it("shorthand methods", () => {
    const performance = new Performance();
    const obj = {};

    performance.shorthands.forEach((method) => {
      (obj as any)[method] = "alpha";
      expect((performance as any)[method]("alpha")).toBe(performance);
    });

    expect(performance.entries()).toStrictEqual(obj);
  });
});
