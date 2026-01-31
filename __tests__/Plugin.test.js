import { createRequire } from "node:module";

import { expect, it } from "vitest";
import EnvironmentPlugin from "webpack/lib/EnvironmentPlugin";

import { Plugin } from "../src/Plugin.js";

const require = createRequire(import.meta.url);

class StringifyPlugin {
  constructor(...args) {
    this.values = args;
  }

  apply() {
    return JSON.stringify(this.values);
  }
}

it("is Chainable", () => {
  const parent = { parent: true };
  const plugin = new Plugin(parent);

  expect(plugin.end()).toBe(parent);
});

it("use", () => {
  const plugin = new Plugin();
  const instance = plugin.use(StringifyPlugin, ["alpha", "beta"]);

  expect(instance).toBe(plugin);
  expect(plugin.get("plugin")).toBe(StringifyPlugin);
  expect(plugin.get("args")).toStrictEqual(["alpha", "beta"]);
});

it("tap", () => {
  const plugin = new Plugin();

  plugin.use(StringifyPlugin, ["alpha", "beta"]);

  const instance = plugin.tap(() => ["gamma", "delta"]);

  expect(instance).toBe(plugin);
  expect(plugin.get("args")).toStrictEqual(["gamma", "delta"]);
});

it("init", () => {
  const plugin = new Plugin();

  plugin.use(StringifyPlugin);

  const instance = plugin.init((Plugin, args) => {
    expect(args).toStrictEqual([]);

    return new Plugin("gamma", "delta");
  });
  const initialized = plugin.get("init")(plugin.get("plugin"), plugin.get("args"));

  expect(instance).toBe(plugin);
  expect(initialized instanceof StringifyPlugin).toBeTruthy();
  expect(initialized.values).toStrictEqual(["gamma", "delta"]);
});

it("args is validated as being an array", () => {
  const plugin = new Plugin();

  expect(() => plugin.use(StringifyPlugin, { foo: true })).toThrow(
    "args must be an array of arguments",
  );

  plugin.use(StringifyPlugin);

  expect(() => plugin.tap(() => ({ foo: true }))).toThrow("args must be an array of arguments");
  expect(() => plugin.merge({ args: 5000 })).toThrow("args must be an array of arguments");
  expect(() => plugin.set("args", null)).toThrow("args must be an array of arguments");
});

it("toConfig", () => {
  const plugin = new Plugin(null, "gamma");

  plugin.use(StringifyPlugin, ["delta"]);

  const initialized = plugin.toConfig();

  expect(initialized instanceof StringifyPlugin).toBeTruthy();
  expect(initialized.values).toStrictEqual(["delta"]);
  expect(initialized.__pluginName).toBe("gamma");
  expect(initialized.__pluginType).toBe("plugin");
  expect(initialized.__pluginArgs).toStrictEqual(["delta"]);
  expect(initialized.__pluginConstructorName).toBe("StringifyPlugin");
});

it("toConfig with custom type", () => {
  const plugin = new Plugin(null, "gamma", "optimization.minimizer");

  plugin.use(StringifyPlugin);

  expect(plugin.toConfig().__pluginType).toBe("optimization.minimizer");
});

it("toConfig with custom expression", () => {
  const plugin = new Plugin(null, "gamma");

  class TestPlugin {}
  TestPlugin.__expression = `require('my-plugin')`;

  plugin.use(TestPlugin);

  const initialized = plugin.toConfig();

  expect(initialized.__pluginConstructorName).toBe(`(require('my-plugin'))`);
});

it("toConfig with object literal plugin", () => {
  const plugin = new Plugin(null, "gamma");

  const TestPlugin = {
    apply() {},
  };

  plugin.use(TestPlugin);

  const initialized = plugin.toConfig();

  expect(initialized).toBe(TestPlugin);
});

it("toConfig with plugin as path", () => {
  const plugin = new Plugin(null, "gamma");
  const envPluginPath = require.resolve("webpack/lib/EnvironmentPlugin");

  plugin.use(envPluginPath);

  const initialized = plugin.toConfig();

  expect(initialized instanceof EnvironmentPlugin).toBeTruthy();
  expect(initialized.__pluginConstructorName).toBe("EnvironmentPlugin");
  expect(initialized.__pluginPath).toBe(envPluginPath);
});

it("toConfig without having called use()", () => {
  const plugin = new Plugin(null, "gamma", "optimization.minimizer");

  expect(() => plugin.toConfig()).toThrow(
    "Invalid optimization.minimizer configuration: optimization.minimizer('gamma').use(<Plugin>) was not called to specify the plugin",
  );
});

it("tap() without having called use()", () => {
  const plugin = new Plugin(null, "gamma", "optimization.minimizer");

  expect(() => plugin.tap(() => [])).toThrow(
    "Cannot call .tap() on a plugin that has not yet been defined. Call optimization.minimizer('gamma').use(<Plugin>) first.",
  );
});

it("throws on tap without plugin", () => {
  const plugin = new Plugin(null, "my-plugin");
  expect(() => plugin.tap((args) => args)).toThrow("my-plugin");
});

it("merge without plugin or args", () => {
  const plugin = new Plugin();
  plugin.merge({ another: 1 });
  expect(plugin.has("plugin")).toBeFalsy();
  expect(plugin.get("another")).toBe(1);
});

it("merge without omit arg", () => {
  const plugin = new Plugin();
  plugin.merge({ plugin: class {} });
  expect(plugin.has("plugin")).toBeTruthy();
});

it("merge and tap edge cases", () => {
  const plugin = new Plugin();
  plugin.use(StringifyPlugin);

  // Test merge with plugin and args
  plugin.merge({
    plugin: class AnotherPlugin {},
    args: ["another"],
  });
  expect(plugin.get("args")).toStrictEqual(["another"]);

  // Test tap with fallback to empty array (if args was somehow missing)
  const plugin2 = new Plugin();
  plugin2.set("plugin", StringifyPlugin);
  plugin2.tap((args) => {
    expect(args).toStrictEqual([]);
    return ["new"];
  });
  expect(plugin2.get("args")).toStrictEqual(["new"]);
});
