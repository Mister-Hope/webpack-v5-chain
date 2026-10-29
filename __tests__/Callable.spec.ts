import { describe, expect, it } from "vitest";

import { Callable } from "../src/utils/Callable.js";

describe("callable", () => {
  it("callable will throw not implemented", () => {
    const callable = new Callable();

    expect(() => callable()).toThrow("not implemented");
  });

  it("callable will call parent fn", () => {
    class Demo extends Callable {
      // oxlint-disable-next-line class-methods-use-this
      override classCall(...args: unknown[]): unknown[] {
        return args;
      }
    }
    const demo = new Demo();
    const result = demo(1, 2);

    expect(result).toStrictEqual([1, 2]);
  });

  it("keeps instanceof and binds this to the callable proxy", () => {
    class Demo extends Callable {
      readonly #value = 42;

      override classCall(...args: unknown[]): unknown[] {
        return [this.#value, ...args, this];
      }
    }

    const demo = new Demo();
    const result = demo("arg");

    expect(demo).toBeInstanceOf(Callable);
    expect(demo).toBeInstanceOf(Demo);
    expect(result).toStrictEqual([42, "arg", demo]);
  });
});
