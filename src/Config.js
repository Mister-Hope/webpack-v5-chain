import { stringify } from "javascript-stringify";

import { DevServer } from "./DevServer.js";
import { Module } from "./Module.js";
import { Optimization } from "./Optimization.js";
import { Output } from "./Output.js";
import { Performance } from "./Performance.js";
import { Plugin } from "./Plugin.js";
import { Resolve } from "./Resolve.js";
import { ResolveLoader } from "./ResolveLoader.js";
import { ChainedMap, ChainedSet } from "./utils/index.js";

export class Config extends ChainedMap {
  constructor() {
    super();
    // https://webpack.js.org/configuration/entry-context/#entry
    this.entryPoints = new ChainedMap(this);
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
    this.plugins = new ChainedMap(this);
    // https://webpack.js.org/configuration/dev-server/
    this.devServer = new DevServer(this);
    // https://webpack.js.org/configuration/performance/
    this.performance = new Performance(this);
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

  static toString(config, { verbose = false, configPrefix = "config" } = {}) {
    return stringify(
      config,
      (value, indent, stringify) => {
        // improve plugin output
        if (value?.__pluginName) {
          const prefix = `/* ${configPrefix}.${value.__pluginType}('${value.__pluginName}') */\n`;
          const constructorExpression = value.__pluginPath
            ? // The path is stringified to ensure special characters are escaped
              // (such as the backslashes in Windows-style paths).
              `(require(${stringify(value.__pluginPath)}))`
            : value.__pluginConstructorName;

          if (constructorExpression) {
            // get correct indentation for args by stringifying the args array and
            // discarding the square brackets.
            const args = stringify(value.__pluginArgs).slice(1, -1);

            return `${prefix}new ${constructorExpression}(${args})`;
          }

          return (
            prefix +
            stringify(
              value.__pluginArgs?.length ? { args: value.__pluginArgs } : {},
            )
          );
        }

        // improve rule/use output
        if (value?.__ruleNames) {
          const ruleTypes = value.__ruleTypes;
          const prefix = `/* ${configPrefix}.module${value.__ruleNames
            .map(
              (r, index) => `.${ruleTypes ? ruleTypes[index] : "rule"}('${r}')`,
            )
            .join("")}${
            value.__useName ? `.use('${value.__useName}')` : ``
          } */\n`;

          return prefix + stringify(value);
        }

        if (value?.__expression) {
          return value.__expression;
        }

        // shorten long functions
        if (typeof value === "function") {
          if (!verbose && value.toString().length > 100) {
            return `function () { /* omitted long function */ }`;
          }
        }

        return stringify(value);
      },
      2,
    );
  }

  entry(name) {
    return this.entryPoints.getOrCompute(name, () => new ChainedSet(this));
  }

  plugin(name) {
    return this.plugins.getOrCompute(name, () => new Plugin(this, name));
  }

  toConfig() {
    const entryPoints = this.entryPoints.entries() || {};
    const baseConfig = this.entries() || {};

    return this.clean(
      Object.assign(baseConfig, {
        output: this.output.entries(),
        resolve: this.resolve.toConfig(),
        resolveLoader: this.resolveLoader.toConfig(),
        devServer: this.devServer.toConfig(),
        module: this.module.toConfig(),
        optimization: this.optimization.toConfig(),
        plugins: this.plugins.values().map((plugin) => plugin.toConfig()),
        performance: this.performance.entries(),
        entry: Object.keys(entryPoints).reduce(
          (acc, key) =>
            Object.assign(acc, { [key]: entryPoints[key].values() }),
          {},
        ),
      }),
    );
  }

  toString(options) {
    return Config.toString(this.toConfig(), options);
  }

  merge(obj = {}, omit = []) {
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
      Object.keys(obj.entry).forEach((name) =>
        this.entry(name).merge([].concat(obj.entry[name])),
      );
    }

    if (!omit.includes("plugin") && "plugin" in obj) {
      Object.keys(obj.plugin).forEach((name) =>
        this.plugin(name).merge(obj.plugin[name]),
      );
    }

    omissions.forEach((key) => {
      if (!omit.includes(key) && key in obj) {
        this[key].merge(obj[key]);
      }
    });

    return super.merge(obj, [...omit, ...omissions, "entry", "plugin"]);
  }
}
