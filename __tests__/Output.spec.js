import { expect, it } from "vitest";

import { Output } from "../src/Output.js";

it("is Chainable", () => {
  const parent = { parent: true };
  const output = new Output(parent);

  expect(output.end()).toBe(parent);
});

it("shorthand methods", () => {
  const output = new Output();
  const obj = {};

  output.shorthands.forEach((method) => {
    obj[method] = "alpha";
    expect(output[method]("alpha")).toBe(output);
  });

  expect(output.entries()).toStrictEqual(obj);
});
