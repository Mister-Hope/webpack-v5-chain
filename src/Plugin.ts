import type { ResolveOptions, WebpackPluginInstance } from "webpack";

import { ChainedMap } from "./utils/index.js";

type ResolvePlugin = Exclude<NonNullable<ResolveOptions["plugins"]>[number], "...">;

// oxlint-disable-next-line typescript/no-explicit-any
export class Plugin<Parent = unknown, PluginType extends WebpackPluginInstance | ResolvePlugin = any>
  extends ChainedMap<Parent>
{
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
    this.set("init" as any, (Plugin: unknown, args: unknown[] = []) => {
      if (typeof Plugin === "function") return new (Plugin as new (...a: unknown[]) => unknown)(...args);

      return Plugin;
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
    this.set("args", func(this.get("args") ?? []));

    return this;
  }

  // oxlint-disable-next-line typescript/no-explicit-any
  override set(key: any, value: unknown): this {
    if (key === "args" && !Array.isArray(value))
      throw new Error("args must be an array of arguments");

    // oxlint-disable-next-line typescript/no-explicit-any
    return super.set(key as any, value as any);
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
      // oxlint-disable-next-line import/no-dynamic-require, node/global-require
      plugin = require(pluginPath) as PluginType;
    }

    if (typeof plugin !== "object" && typeof plugin !== "function") {
      throw new TypeError(
        `Invalid ${this.type} configuration: ${this.type}('${this.name}').use(<Plugin>) was not called to specify the plugin`,
      );
    }

    const constructorName = (plugin as Record<string, unknown>).__expression
      ? `(${(plugin as Record<string, unknown>).__expression as string})`
      : (plugin as { name?: string }).name;

    const config = init(plugin, args);

    Object.defineProperties(config, {
      __pluginName: { value: this.name },
      __pluginType: { value: this.type },
      __pluginArgs: { value: args },
      __pluginConstructorName: { value: constructorName },
      __pluginPath: { value: pluginPath },
    });

    return config;
  }
}
