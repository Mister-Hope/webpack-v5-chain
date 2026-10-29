import type { ResolveOptions, WebpackPluginInstance } from "webpack";

import { ChainedMap } from "./utils/index.js";

type ResolvePlugin = Exclude<NonNullable<ResolveOptions["plugins"]>[number], "...">;

/**
 * Check whether a value is an ES module namespace object.
 *
 * `require()` of an ES module returns the module namespace object instead of its default export.
 * Such an object is not extensible and can never be used as a plugin itself, so it has to be
 * unwrapped first.
 *
 * @param value Value to check
 * @returns Whether the value is an ES module namespace object
 */
const isModuleNamespace = (value: object): boolean =>
  Object.prototype.toString.call(value) === "[object Module]";

export class Plugin<
  Parent = unknown,
  // oxlint-disable-next-line typescript/no-explicit-any
  PluginType extends WebpackPluginInstance | ResolvePlugin = any,
> extends ChainedMap<Parent> {
  name: string;
  type: string;
  __before?: string;
  __after?: string;

  constructor(parent?: Parent, name?: string, type = "plugin") {
    super(parent);
    this.name = name ?? "";
    this.type = type;
    this.extend(["init"]);

    // oxlint-disable-next-line typescript/no-explicit-any
    this.set("init" as any, (PluginConstructor: unknown, args: unknown[] = []) => {
      if (typeof PluginConstructor === "function")
        return new (PluginConstructor as new (...a: unknown[]) => unknown)(...args);

      return PluginConstructor;
    });
  }

  declare init: (
    value: (
      plugin: PluginType | (new (...opts: unknown[]) => PluginType),
      args: unknown[],
    ) => PluginType,
  ) => this;

  use(
    plugin: string | PluginType | (new (...opts: unknown[]) => PluginType),
    args: unknown[] = [],
  ): this {
    return this.set("plugin", plugin).set("args", args);
  }

  tap(func: (args: unknown[]) => unknown[]): this {
    if (!this.has("plugin")) {
      throw new Error(
        `Cannot call .tap() on a plugin that has not yet been defined. Call ${this.type}('${this.name}').use(<Plugin>) first.`,
      );
    }
    // oxlint-disable-next-line typescript/no-unsafe-argument
    this.set("args", func(this.get("args") ?? []));

    return this;
  }

  // oxlint-disable-next-line typescript/no-explicit-any, typescript/explicit-module-boundary-types
  override set(key: any, value: unknown): this {
    if (key === "args" && !Array.isArray(value))
      throw new Error("args must be an array of arguments");

    // oxlint-disable-next-line typescript/no-explicit-any
    return super.set(key, value as any);
  }

  before(name: string): this {
    if (this.__after) {
      throw new Error(
        `Unable to set .before(${JSON.stringify(name)}) with existing value for .after()`,
      );
    }

    this.__before = name;

    return this;
  }

  after(name: string): this {
    if (this.__before) {
      throw new Error(
        `Unable to set .after(${JSON.stringify(name)}) with existing value for .before()`,
      );
    }

    this.__after = name;

    return this;
  }

  override merge(obj: Record<string, unknown>, omit: string[] = []): this {
    if ("before" in obj) this.before(obj.before as string);

    if ("after" in obj) this.after(obj.after as string);

    if ("plugin" in obj) this.set("plugin", obj.plugin);

    if ("args" in obj) this.set("args", obj.args);

    return super.merge(obj, [...omit, "before", "after", "args", "plugin"]);
  }

  toConfig(): PluginType {
    const init = this.get("init") as (plugin: unknown, args: unknown[]) => PluginType;
    let plugin = this.get("plugin") as string | PluginType;
    const args = this.get("args") as unknown[];
    let pluginPath: string | null = null;

    // Support using the path to a plugin rather than the plugin itself,
    // allowing expensive require()s to be skipped in cases where the plugin
    // or webpack configuration won't end up being used.
    if (typeof plugin === "string") {
      pluginPath = plugin;

      if (pluginPath.startsWith(".")) {
        throw new TypeError(
          `Invalid ${this.type} configuration: ${this.type}('${this.name}').use(${JSON.stringify(pluginPath)}) received a relative path; use an absolute path or an installed module name instead`,
        );
      }

      // oxlint-disable-next-line typescript/no-require-imports, typescript/no-var-requires, unicorn/prefer-module, import/no-dynamic-require
      plugin = require(pluginPath) as PluginType;
    }

    if (plugin == null || (typeof plugin !== "object" && typeof plugin !== "function")) {
      throw new TypeError(
        `Invalid ${this.type} configuration: ${this.type}('${this.name}').use(<Plugin>) was not called to specify the plugin`,
      );
    }

    // Plugins imported from an ES module are exposed as `{ default: plugin }`
    // (a module namespace object), and transpiled plugins can be wrapped the
    // same way. Unwrap the default export so both `.use("/path/to/plugin.mjs")`
    // and `.use({ default: Plugin })` work like passing the plugin directly.
    const pluginModule = plugin as Record<string, unknown>;

    if (typeof plugin === "object" && "default" in pluginModule) {
      // A module namespace is never a plugin itself, even if it exposes an
      // `apply` named export, while a real plugin instance takes precedence
      // over a coincidental `default` property.
      if (isModuleNamespace(pluginModule) || typeof pluginModule.apply !== "function") {
        const defaultExport = pluginModule.default;

        if (typeof defaultExport !== "object" && typeof defaultExport !== "function") {
          throw new TypeError(
            `Invalid ${this.type} configuration: ${this.type}('${this.name}').use(<Plugin>) received a default export that is not a plugin class or instance`,
          );
        }

        plugin = defaultExport as PluginType;
      }
    } else if (isModuleNamespace(pluginModule)) {
      throw new TypeError(
        `Invalid ${this.type} configuration: ${this.type}('${this.name}').use(<Plugin>) received an ES module without a default export`,
      );
    }

    // oxlint-disable-next-line typescript/strict-boolean-expressions
    const constructorName = (plugin as Record<string, unknown>).__expression
      ? `(${(plugin as Record<string, unknown>).__expression as string})`
      : (plugin as { name?: string }).name;

    const config = init(plugin, args);

    // These properties only carry information for `Config.toString()`, so the
    // user provided plugin instance must not be broken by them:
    // - make them configurable so the same instance can be reused by several
    //   Configs with different names/arguments;
    // - skip them for non-extensible instances (e.g. `Object.freeze`d ones),
    //   where `Config.toString()` falls back to plain serialization.
    if (Object.isExtensible(config)) {
      Object.defineProperties(config, {
        __pluginName: { value: this.name, configurable: true },
        __pluginType: { value: this.type, configurable: true },
        __pluginArgs: { value: args, configurable: true },
        __pluginConstructorName: { value: constructorName, configurable: true },
        __pluginPath: { value: pluginPath, configurable: true },
      });
    }

    return config;
  }
}
