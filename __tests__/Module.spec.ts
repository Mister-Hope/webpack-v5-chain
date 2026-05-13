import { describe, expect, it } from "vitest";

import { Module } from "../src/Module.js";

describe("module", () => {
  it("is Chainable", () => {
    const parent = { parent: true };
    const module = new Module(parent as any);

    expect(module.end()).toBe(parent);
  });

  it("is ChainedMap", () => {
    const module = new Module();

    module.set("a", "alpha");

    expect(module.get("a")).toBe("alpha");
  });

  it("rule", () => {
    const module = new Module();
    const instance = module.rule("compile").end();

    expect(instance).toBe(module);
    expect(module.rules.has("compile")).toBe(true);
  });

  it("defaultRule", () => {
    const module = new Module();
    const instance = module.defaultRule("banner").end();

    expect(instance).toBe(module);
    expect(module.defaultRules.has("banner")).toBe(true);
  });

  it("toConfig empty", () => {
    const module = new Module();

    expect(module.toConfig()).toStrictEqual({});
  });

  it("toConfig with values", () => {
    const module = new Module();

    module.rule("compile").test(/\.js$/u);
    module.noParse(/.min.js/u);

    expect(module.toConfig()).toStrictEqual({
      rules: [{ test: /\.js$/u }],
      noParse: /.min.js/u,
    });
  });

  it("merge", () => {
    const module = new Module();

    module.merge({
      noParse: /.min.js/u,
      rule: {
        compile: {
          test: /\.js$/u,
        },
      },
      defaultRule: {
        banner: {
          test: /\.css$/u,
        },
      },
    });

    expect(module.toConfig()).toStrictEqual({
      noParse: /.min.js/u,
      rules: [{ test: /\.js$/u }],
      defaultRules: [{ test: /\.css$/u }],
    });
  });

  it("merge with omit", () => {
    const module = new Module();

    module.merge(
      {
        rule: {
          compile: {
            test: /\.js$/u,
          },
        },
        defaultRule: {
          banner: {
            test: /\.css$/u,
          },
        },
      },
      ["rule", "defaultRule"],
    );

    expect(module.toConfig()).toStrictEqual({});
  });
});
