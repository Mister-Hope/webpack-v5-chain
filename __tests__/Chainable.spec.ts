import { describe, expect, it } from "vitest";

import { Chainable } from "../src/utils/Chainable.js";

describe("chainable", () => {
  it("calling .end() returns parent", () => {
    const parent = { parent: true };
    const chain = new Chainable(parent);

    expect(chain.end()).toBe(parent);
  });

  it("using .batch() receives context", () => {
    const chain = new Chainable();
    const context = chain.batch((current) => {
      expect(current).toBe(chain);
    });

    expect(context).toBe(chain);
  });
});
