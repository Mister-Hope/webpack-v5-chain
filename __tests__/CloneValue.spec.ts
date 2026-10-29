import { describe, expect, it } from "vitest";

import { Config } from "../src/index.js";
import { cloneValue } from "../src/utils/clone.js";

interface UseOptions {
  nested: { a: number };
  presets: string[];
}

interface RuleConfig {
  use: { options: UseOptions }[];
}

const getUseOptions = (config: Config): UseOptions => {
  const rules = config.toConfig().module?.rules as unknown as RuleConfig[];

  return rules[0].use[0].options;
};

describe(cloneValue, () => {
  it("clones nested plain objects, arrays and null-prototype objects", () => {
    const nested = { value: 1 };
    const array = [nested];
    const nullPrototype = Object.create(null) as Record<string, unknown>;

    nullPrototype.nested = { value: 1 };

    const source = { array, nullPrototype };
    const clone = cloneValue(source);

    expect(clone).not.toBe(source);
    expect(clone.array).not.toBe(array);
    expect(clone.array[0]).not.toBe(nested);
    expect(clone.array[0]).toStrictEqual({ value: 1 });
    expect(clone.nullPrototype).not.toBe(nullPrototype);
    expect(Object.getPrototypeOf(clone.nullPrototype)).toBeNull();
  });

  it("preserves special values by reference", () => {
    const regexp = /value/u;
    const date = new Date(0);
    const map = new Map([["key", "value"]]);

    expect(cloneValue(regexp)).toBe(regexp);
    expect(cloneValue(date)).toBe(date);
    expect(cloneValue(map)).toBe(map);
  });

  it("preserves cyclic structures", () => {
    const source: Record<string, unknown> = { value: 1 };

    source.self = source;

    const clone = cloneValue(source);

    expect(clone).not.toBe(source);
    expect(clone.self).toBe(clone);
  });
});

describe("toConfig value isolation", () => {
  it("does not expose stored plain options", () => {
    const config = new Config();
    const options = { nested: { a: 1 }, presets: ["alpha"] };

    config.module.rule("babel").test(/\.js$/u).use("babel").loader("babel-loader").options(options);

    const first = getUseOptions(config);

    first.nested.a = 2;
    first.presets.push("beta");

    expect(getUseOptions(config)).toStrictEqual({ nested: { a: 1 }, presets: ["alpha"] });
  });

  it("does not expose entry description objects", () => {
    const config = new Config();

    config.entry("main").add({ filename: "main.js", import: ["./src/index.js"] });

    const firstEntry = (config.toConfig().entry as unknown as Record<string, { filename: string }>)
      .main;

    firstEntry.filename = "MUTATED";

    const secondEntry = (config.toConfig().entry as unknown as Record<string, { filename: string }>)
      .main;

    expect(secondEntry.filename).toBe("main.js");
  });

  it("does not expose rule include/exclude arrays", () => {
    const config = new Config();

    config.module.rule("test").include.add(["./src", "./test"]);

    const firstInclude = (
      config.toConfig().module as unknown as { rules: { include: string[][] }[] }
    ).rules[0].include;

    firstInclude[0].push("./other");

    const secondInclude = (
      config.toConfig().module as unknown as { rules: { include: string[][] }[] }
    ).rules[0].include;

    expect(secondInclude).toStrictEqual([["./src", "./test"]]);
  });

  it("does not expose output.library objects", () => {
    const config = new Config();

    config.output.library({ name: "alpha", type: "var" });

    const firstLibrary = config.toConfig().output?.library as unknown as { name: string };
    firstLibrary.name = "MUTATED";

    const secondLibrary = config.toConfig().output?.library as unknown as { name: string };
    expect(secondLibrary.name).toBe("alpha");
  });

  it("does not expose callable splitChunks values", () => {
    const config = new Config();
    const test = /node_modules/u;

    config.optimization.splitChunks({ cacheGroups: { vendors: { test } }, chunks: "all" });

    const first = config.toConfig().optimization as unknown as {
      splitChunks: { cacheGroups: { vendors: { test: RegExp } } };
    };

    first.splitChunks.cacheGroups.vendors.test = /changed/u;

    const second = config.toConfig().optimization as unknown as {
      splitChunks: { cacheGroups: { vendors: { test: RegExp } } };
    };

    expect(second.splitChunks.cacheGroups.vendors.test).toBe(test);
  });

  it("keeps special values by reference in the generated config", () => {
    const regexp = /\.ts$/u;
    const config = new Config();

    config.module.rule("typescript").test(regexp);

    const { rules } = config.toConfig().module as unknown as { rules: { test: RegExp }[] };
    const [rule] = rules;

    expect(rule.test).toBe(regexp);
  });
});
