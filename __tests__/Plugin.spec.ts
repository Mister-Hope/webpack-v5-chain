import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import path from "node:path";

import { describe, expect, it, onTestFinished } from "vitest";
import { EnvironmentPlugin } from "webpack";

import { Config } from "../src/Config.js";
import { Plugin } from "../src/Plugin.js";

const require = createRequire(import.meta.url);

/**
 * Write an ES module plugin to a temporary file.
 *
 * `require()` of an ES module returns the module namespace object, which is what
 * `Plugin.toConfig()` has to unwrap.
 *
 * @param source Source code of the ES module
 * @returns Absolute path of the written module
 */
const writeEsmPlugin = (source: string): string => {
  const directory = mkdtempSync(path.join(tmpdir(), "webpack-v5-chain-plugin-"));
  const pluginPath = path.join(directory, "plugin.mjs");

  writeFileSync(pluginPath, source);
  onTestFinished(() => rmSync(directory, { recursive: true, force: true }));

  return pluginPath;
};

class StringifyPlugin {
  values!: unknown[];

  constructor(...args: unknown[]) {
    this.values = args;
  }

  apply(): string {
    return JSON.stringify(this.values);
  }
}

describe("plugin", () => {
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
    expect(initialized instanceof StringifyPlugin).toBe(true);
    expect(initialized.values).toStrictEqual(["gamma", "delta"]);
  });

  it("args is validated as being an array", () => {
    const plugin = new Plugin();

    expect(() => plugin.use(StringifyPlugin, { foo: true } as any)).toThrow(
      "args must be an array of arguments",
    );

    plugin.use(StringifyPlugin);

    expect(() => plugin.tap(() => ({ foo: true }) as any)).toThrow(
      "args must be an array of arguments",
    );
    expect(() => plugin.merge({ args: 5000 })).toThrow("args must be an array of arguments");
    expect(() => plugin.set("args", null)).toThrow("args must be an array of arguments");
  });

  it("init defaults args to an empty array", () => {
    const plugin = new Plugin();

    plugin.use(StringifyPlugin);

    const init = plugin.get("init") as (Plugin: unknown, args?: unknown[]) => StringifyPlugin;
    const initialized = init(StringifyPlugin);

    expect(initialized).toBeInstanceOf(StringifyPlugin);
    expect(initialized.values).toStrictEqual([]);
  });

  it("toConfig", () => {
    const plugin = new Plugin(null, "gamma");

    plugin.use(StringifyPlugin, ["delta"]);

    const initialized = plugin.toConfig();

    expect(initialized instanceof StringifyPlugin).toBe(true);
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
    (TestPlugin as any).__expression = `require('my-plugin')`;

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
    const envPluginPath = require.resolve("webpack/lib/define/EnvironmentPlugin");

    plugin.use(envPluginPath);

    const initialized = plugin.toConfig();

    expect(initialized instanceof EnvironmentPlugin).toBe(true);
    expect(initialized.__pluginConstructorName).toBe("EnvironmentPlugin");
    expect(initialized.__pluginPath).toBe(envPluginPath);
  });

  it("rejects relative plugin paths with a clear error", () => {
    const plugin = new Plugin(null, "relative");

    plugin.use("./relative-plugin.js");

    expect(() => plugin.toConfig()).toThrow(
      "received a relative path; use an absolute path or an installed module name",
    );
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
    expect(plugin.has("plugin")).toBe(false);
    expect(plugin.get("another")).toBe(1);
  });

  it("merge without omit arg", () => {
    const plugin = new Plugin();
    plugin.merge({ plugin: class {} });
    expect(plugin.has("plugin")).toBe(true);
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

  it("before and after ordering", () => {
    const plugin = new Plugin();
    plugin.before("other");
    expect(plugin.__before).toBe("other");

    const plugin2 = new Plugin();
    plugin2.after("other");
    expect(plugin2.__after).toBe("other");
  });

  it("before throws when __after is already set", () => {
    const plugin = new Plugin();
    plugin.after("beta");
    expect(() => plugin.before("alpha")).toThrow("Unable to set .before");
  });

  it("after throws when __before is already set", () => {
    const plugin = new Plugin();
    plugin.before("alpha");
    expect(() => plugin.after("beta")).toThrow("Unable to set .after");
  });

  it("merge with before and after in object", () => {
    const plugin = new Plugin();
    plugin.merge({ before: "other-plugin" });
    expect(plugin.__before).toBe("other-plugin");

    const plugin2 = new Plugin();
    plugin2.merge({ after: "some-plugin" });
    expect(plugin2.__after).toBe("some-plugin");
  });

  it("toConfig with plugin instance", () => {
    const instance = new StringifyPlugin("alpha");
    const plugin = new Plugin(null, "instance");

    plugin.use(instance);

    const initialized = plugin.toConfig();

    expect(initialized).toBe(instance);
    expect(initialized.values).toStrictEqual(["alpha"]);
    expect(initialized.__pluginName).toBe("instance");
    expect(initialized.__pluginArgs).toStrictEqual([]);
  });

  it("throws for a null plugin", () => {
    const plugin = new Plugin(null, "gamma");

    plugin.use(null as any);

    expect(() => plugin.toConfig()).toThrow(
      "Invalid plugin configuration: plugin('gamma').use(<Plugin>) was not called to specify the plugin",
    );
  });

  it("supports reusing a plugin instance across Configs", () => {
    const instance = new StringifyPlugin("shared");
    const alphaConfig = new Config();
    const betaConfig = new Config();

    alphaConfig.plugin("alpha").use(instance, ["alpha"]);
    betaConfig.plugin("beta").use(instance, ["beta"]);

    expect(alphaConfig.toConfig().plugins?.[0]).toBe(instance);
    expect(betaConfig.toConfig().plugins?.[0]).toBe(instance);
    expect((instance as any).__pluginName).toBe("beta");
    expect((instance as any).__pluginArgs).toStrictEqual(["beta"]);
    expect(() => alphaConfig.toString()).not.toThrow();
    expect(() => betaConfig.toString()).not.toThrow();
  });

  it("supports frozen plugin instances", () => {
    const instance = Object.freeze(new StringifyPlugin("frozen"));
    const config = new Config();

    config.plugin("frozen").use(instance);

    expect(config.toConfig().plugins?.[0]).toBe(instance);
    expect(Object.isExtensible(instance)).toBe(false);
    expect(instance).not.toHaveProperty("__pluginName");
    expect(() => config.toString()).not.toThrow();
  });

  describe("es module plugins", () => {
    it("unwraps the default export of a plugin loaded by path", () => {
      const pluginPath = writeEsmPlugin(`
export default class EsmStringifyPlugin {
  constructor(...args) {
    this.values = args;
  }

  apply() {}
}
`);
      const plugin = new Plugin(null, "esm");

      plugin.use(pluginPath, ["alpha"]);

      const initialized = plugin.toConfig();

      expect(initialized.constructor.name).toBe("EsmStringifyPlugin");
      expect(initialized.values).toStrictEqual(["alpha"]);
      expect(initialized.apply).toBeTypeOf("function");
      expect(initialized.__pluginName).toBe("esm");
      expect(initialized.__pluginPath).toBe(pluginPath);
      expect(initialized.__pluginConstructorName).toBe("EsmStringifyPlugin");
    });

    it("renders ES module plugins in Config.toString()", () => {
      const pluginPath = writeEsmPlugin(`export default class EsmPlugin { apply() {} }`);
      const config = new Config();

      config.plugin("esm").use(pluginPath);

      const output = config.toString();

      expect(output).toContain("/* config.plugin('esm') */");
      expect(output).toContain("new (require(");
    });

    it("unwraps { default: Plugin } wrappers", () => {
      class WrappedPlugin {
        applied = false;
        values!: unknown[];

        constructor(...args: unknown[]) {
          this.values = args;
        }

        apply() {
          this.applied = true;
        }
      }

      const plugin = new Plugin(null, "wrapped");

      plugin.use({ default: WrappedPlugin }, ["alpha"]);

      const initialized = plugin.toConfig();

      expect(initialized).toBeInstanceOf(WrappedPlugin);
      expect(initialized.values).toStrictEqual(["alpha"]);
      expect(initialized.__pluginName).toBe("wrapped");
    });

    it("unwraps object default exports", () => {
      const wrappedPlugin = { apply() {} };
      const plugin = new Plugin(null, "object-default");

      plugin.use({ default: wrappedPlugin });

      const initialized = plugin.toConfig();

      expect(initialized).toBe(wrappedPlugin);
      expect(initialized.__pluginName).toBe("object-default");
    });

    it("keeps plugin instances that happen to expose a default property", () => {
      class DefaultPropertyPlugin {
        applied = false;
        default = "not a plugin";

        apply() {
          this.applied = true;
        }
      }

      const instance = new DefaultPropertyPlugin();
      const plugin = new Plugin(null, "default-property");

      plugin.use(instance);

      expect(plugin.toConfig()).toBe(instance);
    });

    it("throws a clear error for ES modules without a default export", () => {
      const pluginPath = writeEsmPlugin(`export const apply = () => {};`);
      const plugin = new Plugin(null, "no-default");

      plugin.use(pluginPath);

      expect(() => plugin.toConfig()).toThrow(
        "Invalid plugin configuration: plugin('no-default').use(<Plugin>) received an ES module without a default export",
      );
    });

    it("throws a clear error when the default export is not a plugin", () => {
      const pluginPath = writeEsmPlugin(`export default 42;`);
      const plugin = new Plugin(null, "invalid-default");

      plugin.use(pluginPath);

      expect(() => plugin.toConfig()).toThrow(
        "Invalid plugin configuration: plugin('invalid-default').use(<Plugin>) received a default export that is not a plugin class or instance",
      );
    });
  });
});
