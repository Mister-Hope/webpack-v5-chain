import { expect, it } from "vitest";

import { Module } from "../src/Module.js";

it("is Chainable", () => {
  const parent = { parent: true };
  const module = new Module(parent);

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
  expect(module.rules.has("compile")).toBeTruthy();
});

it("defaultRule", () => {
  const module = new Module();
  const instance = module.defaultRule("banner").end();

  expect(instance).toBe(module);
  expect(module.defaultRules.has("banner")).toBeTruthy();
});

it("toConfig empty", () => {
  const module = new Module();

  expect(module.toConfig()).toStrictEqual({});
});

it("toConfig with values", () => {
  const module = new Module();

  module.rule("compile").test(/\.js$/);
  module.noParse(/.min.js/);

  expect(module.toConfig()).toStrictEqual({
    rules: [{ test: /\.js$/ }],
    noParse: /.min.js/,
  });
});

it("merge", () => {
  const module = new Module();

  module.merge({
    noParse: /.min.js/,
    rule: {
      compile: {
        test: /\.js$/,
      },
    },
    defaultRule: {
      banner: {
        test: /\.css$/,
      },
    },
  });

  expect(module.toConfig()).toStrictEqual({
    noParse: /.min.js/,
    rules: [{ test: /\.js$/ }],
    defaultRules: [{ test: /\.css$/ }],
  });
});

it("merge with omit", () => {
  const module = new Module();

  module.merge(
    {
      rule: {
        compile: {
          test: /\.js$/,
        },
      },
      defaultRule: {
        banner: {
          test: /\.css$/,
        },
      },
    },
    ["rule", "defaultRule"],
  );

  expect(module.toConfig()).toStrictEqual({});
});
