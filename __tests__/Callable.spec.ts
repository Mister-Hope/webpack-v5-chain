import { expect, it } from "vitest";

import { Callable } from "../src/utils/Callable.js";

it("callable will throw not implemented", () => {
  const callable = new Callable();

  expect(() => callable()).toThrow("not implemented");
});

it("callable will call parent fn", () => {
  class Demo extends Callable {
    // oxlint-disable-next-line class-methods-use-this
    classCall(...args) {
      return args;
    }
  }
  const demo = new Demo();
  const result = demo(1, 2);

  expect(result).toStrictEqual([1, 2]);
});
