// oxlint-disable max-classes-per-file
import { stringify } from "javascript-stringify";
import type { Configuration, ResolveOptions, WebpackPluginInstance } from "webpack";

import { DevServer } from "./DevServer.js";
import { Module } from "./Module.js";
import { Optimization } from "./Optimization.js";
import { Output } from "./Output.js";
import { Performance } from "./Performance.js";
import { Plugin } from "./Plugin.js";
import { Resolve } from "./Resolve.js";
import { ResolveLoader } from "./ResolveLoader.js";
import { ChainedMap, TypedChainedMap, TypedChainedSet } from "./utils/index.js";

type WebpackConfig = Required<Configuration>;
type ResolvePlugin = Exclude<NonNullable<ResolveOptions["plugins"]>[number], "...">;
type WebpackEntry = NonNullable<Configuration["entry"]>;
type WebpackEntryObject = Exclude<
  WebpackEntry,
  // oxlint-disable-next-line typescript/ban-types, typescript/no-unsafe-function-type
  string | string[] | Function
>[string];

export class EntryPoint extends TypedChainedSet<Config, WebpackEntryObject> {}

export class Plugins<
  Parent,
  PluginType extends WebpackPluginInstance,
> extends TypedChainedMap<Parent, Record<string, Plugin<Parent, PluginType>>> {}

export type PluginClass<PluginType extends WebpackPluginInstance | ResolvePlugin> = new (
  // oxlint-disable-next-line typescript/no-explicit-any
  ...opts: any[]
) => PluginType;

export class Config extends ChainedMap<void> {
  entryPoints: TypedChainedMap<Config, Record<string, EntryPoint>>;
  output: Output;
  module: Module;
  optimization: Optimization;
  performance: Performance & ((value: boolean) => this);
  plugins: Plugins<this, WebpackPluginInstance>;
  resolve: Resolve;
  resolveLoader: ResolveLoader;
  devServer: DevServer;

  constructor() {
    super();
    // https://webpack.js.org/configuration/entry-context/#entry
    this.entryPoints = new TypedChainedMap(this);
    // https://webpack.js.org/configuration/output/
    this.output = new Output(this);
    // https://webpack.js.org/configuration/module/
    this.module = new Module(this);
    // https://webpack.js.org/configuration/resolve
    this.resolve = new Resolve(this);
    // https://webpack.js.org/configuration/resolve/#resolveloader
    this.resolveLoader = new ResolveLoader(this);
    // https://webpack.js.org/configuration/optimization/
    this.optimization = new Optimization(this);
    // https://webpack.js.org/configuration/plugins/
    this.plugins = new TypedChainedMap(this) as Plugins<this, WebpackPluginInstance>;
    // https://webpack.js.org/configuration/dev-server/
    this.devServer = new DevServer(this);
    // https://webpack.js.org/configuration/performance/
    this.performance = new Performance(this) as Performance & ((value: boolean) => this);
    this.extend([
      // https://webpack.js.org/configuration/entry-context/
      "context",
      // https://webpack.js.org/configuration/mode/
      "mode",
      // https://webpack.js.org/configuration/cache/
      "cache",
      // https://webpack.js.org/configuration/devtool/
      "devtool",
      // https://webpack.js.org/configuration/target/
      "target",
      // https://webpack.js.org/configuration/watch/
      "watch",
      "watchOptions",
      // https://webpack.js.org/configuration/externals/
      "externals",
      "externalsType",
      "externalsPresets",
      // https://webpack.js.org/configuration/dotenv/
      "dotenv",
      // https://webpack.js.org/configuration/node/
      "node",
      // https://webpack.js.org/configuration/stats/
      "stats",
      // https://webpack.js.org/configuration/experiments/
      "experiments",
      // https://webpack.js.org/configuration/infrastructureLogging/
      "infrastructureLogging",
      // https://webpack.js.org/configuration/other-options/
      "amd",
      "bail",
      "dependencies",
      "ignoreWarnings",
      "loader",
      "name",
      "parallelism",
      "profile",
      "recordsInputPath",
      "recordsOutputPath",
      "recordsPath",
      "snapshot",
    ]);
  }

  declare context: (value: WebpackConfig["context"]) => this;
  declare mode: (value: WebpackConfig["mode"]) => this;
  declare cache: (value: WebpackConfig["cache"]) => this;
  declare devtool: (value: WebpackConfig["devtool"]) => this;
  declare target: (value: WebpackConfig["target"]) => this;
  declare watch: (value: WebpackConfig["watch"]) => this;
  declare watchOptions: (value: WebpackConfig["watchOptions"]) => this;
  declare externals: (value: WebpackConfig["externals"]) => this;
  declare externalsType: (value: WebpackConfig["externalsType"]) => this;
  declare externalsPresets: (value: WebpackConfig["externalsPresets"]) => this;
  declare dotenv: (value: WebpackConfig["dotenv"]) => this;
  declare node: (value: WebpackConfig["node"]) => this;
  declare stats: (value: WebpackConfig["stats"]) => this;
  declare experiments: (value: WebpackConfig["experiments"]) => this;
  declare infrastructureLogging: (value: WebpackConfig["infrastructureLogging"]) => this;
  declare amd: (value: WebpackConfig["amd"]) => this;
  declare bail: (value: WebpackConfig["bail"]) => this;
  declare dependencies: (value: WebpackConfig["dependencies"]) => this;
  declare ignoreWarnings: (value: WebpackConfig["ignoreWarnings"]) => this;
  declare loader: (value: WebpackConfig["loader"]) => this;
  declare name: (value: WebpackConfig["name"]) => this;
  declare parallelism: (value: WebpackConfig["parallelism"]) => this;
  declare profile: (value: WebpackConfig["profile"]) => this;
  declare recordsInputPath: (value: WebpackConfig["recordsInputPath"]) => this;
  declare recordsOutputPath: (value: WebpackConfig["recordsOutputPath"]) => this;
  declare recordsPath: (value: WebpackConfig["recordsPath"]) => this;
  declare snapshot: (value: WebpackConfig["snapshot"]) => this;

  static toString(
    config: Configuration,
    { verbose = false, configPrefix = "config" } = {},
  ): string {
    // oxlint-disable-next-line typescript/non-nullable-type-assertion-style
    return stringify(
      config,
      (value, indent, jsonStringify) => {
        // improve plugin output
        // oxlint-disable-next-line typescript/strict-boolean-expressions
        if ((value as Record<string, unknown>)?.__pluginName) {
          // oxlint-disable-next-line id-length
          const v = value as Record<string, unknown>;
          const prefix = `/* ${configPrefix}.${v.__pluginType as string}('${v.__pluginName as string}') */\n`;
          // oxlint-disable-next-line typescript/strict-boolean-expressions
          const constructorExpression = v.__pluginPath
            ? // The path is stringified to ensure special characters are escaped
              // (such as the backslashes in Windows-style paths).
              `(require(${jsonStringify(v.__pluginPath)}))`
            : (v.__pluginConstructorName as string);

          if (constructorExpression) {
            // get correct indentation for args by stringifying the args array and
            // discarding the square brackets.
            const args = jsonStringify(v.__pluginArgs)?.slice(1, -1);

            return `${prefix}new ${constructorExpression}(${args})`;
          }

          return (
            prefix +
            jsonStringify(
              (v.__pluginArgs as unknown[])?.length ? { args: v.__pluginArgs } : {},
            )
          );
        }

        // improve rule/use output
        // oxlint-disable-next-line typescript/strict-boolean-expressions
        if ((value as Record<string, unknown>)?.__ruleNames) {
          // oxlint-disable-next-line id-length
          const v = value as Record<string, unknown>;
          const ruleTypes = v.__ruleTypes as string[] | undefined;
          const prefix = `/* ${configPrefix}.module${(v.__ruleNames as string[])
            .map(
              (rule, index) =>
                `.${ruleTypes ? ruleTypes[index] : "rule"}('${rule}')`,
            )
            // oxlint-disable-next-line typescript/strict-boolean-expressions
            .join("")}${v.__useName ? `.use('${v.__useName as string}')` : ``} */\n`;

          return prefix + jsonStringify(value);
        }

        // oxlint-disable-next-line typescript/strict-boolean-expressions
        if ((value as Record<string, unknown>)?.__expression)
          return (value as Record<string, unknown>).__expression as string;

        // shorten long functions
        // oxlint-disable-next-line typescript/no-unsafe-call, typescript/no-unsafe-member-access
        if (typeof value === "function" && !verbose && value.toString().length > 100)
          return `function () { /* omitted long function */ }`;

        return jsonStringify(value);
      },
      2,
    ) as string;
  }

  entry(name: string): EntryPoint {
    return this.entryPoints.getOrCompute(name, () => new EntryPoint(this));
  }

  plugin(name: string): Plugin<this, WebpackPluginInstance> {
    return this.plugins.getOrCompute(name, () => new Plugin(this, name));
  }

  toConfig(): Configuration {
    const entryPoints = this.entryPoints.entries() ?? {};
    // oxlint-disable-next-line typescript/no-unsafe-assignment
    const baseConfig = this.entries() ?? {};

    return this.omitEmpty(
      // oxlint-disable-next-line typescript/no-unsafe-argument
      Object.assign(baseConfig, {
        // oxlint-disable-next-line typescript/no-unsafe-assignment
        output: this.output.entries(),
        resolve: this.resolve.toConfig(),
        resolveLoader: this.resolveLoader.toConfig(),
        devServer: this.devServer.toConfig(),
        module: this.module.toConfig(),
        optimization: this.optimization.toConfig(),
        plugins: this.plugins.values().map((plugin) => plugin.toConfig()),
        performance: this.performance.entries(),
        entry: Object.fromEntries(
          Object.keys(entryPoints).map((key) => [key, entryPoints[key].values()]),
        ),
      }),
    ) as Configuration;
  }

  toString(options?: { verbose?: boolean; configPrefix?: string }): string {
    return Config.toString(this.toConfig(), options);
  }

  override merge(obj: Record<string, unknown> = {}, omit: string[] = []): this {
    const omissions = [
      "output",
      "resolve",
      "resolveLoader",
      "devServer",
      "optimization",
      "performance",
      "module",
    ];

    if (!omit.includes("entry") && "entry" in obj) {
      Object.keys(obj.entry as object).forEach((name) =>
        this.entry(name).merge(
          // oxlint-disable-next-line unicorn/prefer-spread
          ([] as WebpackEntryObject[]).concat(
            (obj.entry as Record<string, WebpackEntryObject>)[name],
          ),
        ),
      );
    }

    if (!omit.includes("plugin") && "plugin" in obj)
      {Object.keys(obj.plugin as object).forEach((name) =>
        this.plugin(name).merge((obj.plugin as Record<string, Record<string, unknown>>)[name]),
      );}

    for (const key of omissions) {
      if (!omit.includes(key) && key in obj)
        // oxlint-disable-next-line typescript/no-explicit-any, typescript/no-unsafe-call, typescript/no-unsafe-member-access
        (this as any)[key].merge((obj)[key]);
    }

    return super.merge(obj, [...omit, ...omissions, "entry", "plugin"]);
  }
}
