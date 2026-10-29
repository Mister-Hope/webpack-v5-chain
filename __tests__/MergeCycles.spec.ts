import { describe, expect, it } from "vitest";

import { ChainedMap } from "../src/utils/ChainedMap.js";

interface Cyclic {
  self?: Cyclic;
  value?: number;
}

describe("cyclic merge values", () => {
  it("replaces a cyclic source instead of overflowing", () => {
    const map = new ChainedMap();
    const target: Cyclic = { value: 1 };
    const source: Cyclic = { value: 2 };

    target.self = target;
    source.self = source;
    map.set("value", target);

    expect(() => map.merge({ value: source })).not.toThrow();
    expect(map.get("value")).toBe(source);
  });

  it("replaces a non-cyclic target when the source is cyclic", () => {
    const map = new ChainedMap();
    const source: Cyclic = { value: 2 };

    source.self = source;
    map.set("value", { value: 1 });

    map.merge({ value: source });

    expect(map.get("value")).toBe(source);
  });

  it("does not scan deeply nested non-cyclic targets for scalar sources", () => {
    const map = new ChainedMap();
    let target: Record<string, unknown> = {};

    for (let index = 0; index < 3000; index += 1) target = { next: target };

    map.set("value", target);
    map.merge({ value: 1 });

    expect(map.get("value")).toBe(1);
  });

  it("does not treat shared non-cyclic references as cycles", () => {
    const map = new ChainedMap();
    const shared = { value: 1 };
    const source = { first: shared, second: shared };

    map.set("value", { first: { value: 2 }, second: { value: 3 } });
    map.merge({ value: source });

    expect(map.get("value")).toStrictEqual(source);
  });

  it("replaces cyclic arrays instead of overflowing", () => {
    const map = new ChainedMap();
    const source: unknown[] = [1];

    source.push(source);
    map.set("value", [0]);

    expect(() => map.merge({ value: source })).not.toThrow();
    expect(map.get("value")).toBe(source);
  });
});
