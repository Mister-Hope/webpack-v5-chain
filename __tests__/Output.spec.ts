import { describe, expect, it } from "vitest";

import { Output } from "../src/Output.js";

describe("output", () => {
  it("is Chainable", () => {
    const parent = { parent: true };
    const output = new Output(parent as any);

    expect(output.end()).toBe(parent);
  });

  it("shorthand methods", () => {
    const output = new Output();
    const obj = {};

    output.shorthands.forEach((method) => {
      (obj as any)[method] = "alpha";
      expect((output as any)[method]("alpha")).toBe(output);
    });

    expect(output.entries()).toStrictEqual(obj);
  });
});
