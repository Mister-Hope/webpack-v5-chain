import { describe, expect, it } from "vitest";

import { Config } from "../src/index.js";
import { Use } from "../src/Use.js";
import { ChainedMap } from "../src/utils/ChainedMap.js";
import { ChainedValueMap } from "../src/utils/ChainedValueMap.js";

class OptionsInstance {
  value = 1;
}

describe("merge values", () => {
  it("deep merges plain objects", () => {
    const map = new ChainedMap();

    map.set("nested", { alpha: 1, deep: { beta: 2 } });
    map.merge({ nested: { deep: { gamma: 3 } } });

    expect(map.get("nested")).toStrictEqual({ alpha: 1, deep: { beta: 2, gamma: 3 } });
  });

  it("merges objects without a prototype", () => {
    const map = new ChainedMap();
    const target = Object.create(null) as Record<string, unknown>;

    target.alpha = 1;
    map.set("value", target);
    map.merge({ value: { beta: 2 } });

    expect(map.get("value")).toStrictEqual({ alpha: 1, beta: 2 });
  });

  it.each([
    ["RegExp", /alpha/u, /beta/u],
    ["Date", new Date(0), new Date(1000)],
    ["Map", new Map([["alpha", 1]]), new Map([["beta", 2]])],
    ["Set", new Set(["alpha"]), new Set(["beta"])],
    ["class instance", new OptionsInstance(), new OptionsInstance()],
  ])("replaces %s values instead of merging them", (_name, target, source) => {
    const map = new ChainedMap();

    map.set("value", target);
    map.merge({ value: source });

    expect(map.get("value")).toBe(source);
  });

  it("concatenates arrays", () => {
    const map = new ChainedMap();

    map.set("list", ["alpha", "beta"]);
    map.merge({ list: ["gamma"] });

    expect(map.get("list")).toStrictEqual(["alpha", "beta", "gamma"]);
  });

  it("keeps concatenating nested arrays and replaces nested special values", () => {
    const map = new ChainedMap();

    map.set("value", { list: ["alpha"], test: /alpha/u });
    map.merge({ value: { list: ["beta"], test: /beta/u } });

    expect(map.get("value")).toStrictEqual({ list: ["alpha", "beta"], test: /beta/u });
  });

  it("replaces values when the existing value is not a plain object", () => {
    const map = new ChainedMap();

    map.set("value", "alpha");
    map.merge({ value: { nested: true } });

    expect(map.get("value")).toStrictEqual({ nested: true });

    map.merge({ value: null });

    expect(map.get("value")).toBeNull();
  });

  it("keeps concatenating arrays through the public API", () => {
    const config = new Config();

    config.ignoreWarnings([/first/u]);
    config.merge({ ignoreWarnings: [/second/u] });

    expect(config.toConfig().ignoreWarnings).toStrictEqual([/first/u, /second/u]);
  });

  it("keeps nested special values while merging plain objects", () => {
    const map = new ChainedMap();

    map.set("value", { list: [/alpha/u], nested: { date: new Date(0), map: new Map() } });
    map.merge({ value: { list: [/beta/u], nested: { date: new Date(1000) } } });

    const merged = map.get("value") as {
      list: RegExp[];
      nested: { date: Date; map: Map<unknown, unknown> };
    };

    expect(merged.list).toStrictEqual([/alpha/u, /beta/u]);
    expect(merged.nested.date).toStrictEqual(new Date(1000));
    expect(merged.nested.map).toBeInstanceOf(Map);
  });

  it("merges ChainedValueMap objects", () => {
    const map = new ChainedValueMap();

    map.set("value", { alpha: 1 });
    map.merge({ value: { beta: 2 } });

    expect(map.get("value")).toStrictEqual({ alpha: 1, beta: 2 });
  });

  it("merges Use options without losing special values", () => {
    const use = new Use();

    use.options({ alpha: 1, nested: { beta: 2 }, test: /alpha/u });
    use.merge({ options: { nested: { gamma: 3 }, test: /beta/u } });

    expect(use.get("options")).toStrictEqual({
      alpha: 1,
      nested: { beta: 2, gamma: 3 },
      test: /beta/u,
    });
  });

  it("merges Use options when no previous options exist", () => {
    const use = new Use();

    use.merge({ options: { alpha: 1 } });

    expect(use.get("options")).toStrictEqual({ alpha: 1 });
  });

  it("keeps module.noParse RegExp values when merging configs", () => {
    const config = new Config();

    config.module.noParse(/first/u);
    config.merge({ module: { noParse: /second/u } });

    expect(config.toConfig().module?.noParse).toStrictEqual(/second/u);
  });

  it("keeps rule resource RegExp values when merging configs", () => {
    const config = new Config();

    config.module.rule("images").resource(/static/u);
    config.merge({ module: { rule: { images: { resource: /assets/u } } } });

    expect(config.toConfig().module?.rules).toStrictEqual([{ resource: /assets/u }]);
  });

  it("keeps externals RegExp values when merging configs", () => {
    const config = new Config();

    config.externals(/alpha/u);
    config.merge({ externals: /beta/u });

    expect(config.toConfig().externals).toStrictEqual(/beta/u);
  });

  it("keeps nested special values when merging through the public API", () => {
    const config = new Config();

    config.merge({ optimization: { splitChunks: { cacheGroups: { alpha: { test: /alpha/u } } } } });
    config.merge({ optimization: { splitChunks: { cacheGroups: { beta: { test: /beta/u } } } } });

    expect((config.toConfig().optimization as any).splitChunks.cacheGroups.beta.test).toStrictEqual(
      /beta/u,
    );
  });
});
