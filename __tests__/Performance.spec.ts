import { describe, expect, it } from "vitest";

import { Performance } from "../src/Performance.js";

describe("performance", () => {
  it("is Chainable", () => {
    const parent = { parent: true };
    const performance = new Performance(parent as any);

    expect(performance.end()).toBe(parent);
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
