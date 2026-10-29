import { readFileSync } from "node:fs";
import path from "node:path";
import { runInNewContext } from "node:vm";

import { describe, expect, it } from "vitest";
import { DefinePlugin, validate } from "webpack";
import type { Configuration } from "webpack";

import { Config } from "../src/index.js";

const readme = readFileSync(new URL("../README.md", import.meta.url), "utf8");

const getGettingStartedExample = (): string => {
  const example = /## Getting Started\s+```(?:js|javascript)\n(?<example>[\s\S]*?)```/u.exec(readme)
    ?.groups?.example;

  if (!example) throw new Error("README has no Getting Started JavaScript example");

  return example;
};

class StubCleanWebpackPlugin {
  // oxlint-disable-next-line class-methods-use-this
  apply = (): boolean => true;
}

const readmeModules: Record<string, unknown> = {
  "clean-webpack-plugin": { CleanWebpackPlugin: StubCleanWebpackPlugin },
  "node:path": path,
  "webpack-v5-chain": { Config },
};

const readmeRequire = (id: string): unknown => {
  const module = readmeModules[id];

  if (module === undefined) throw new Error(`Unexpected require in README example: ${id}`);

  return module;
};

describe("rEADME Getting Started example", () => {
  it("is a valid webpack configuration", () => {
    const sandbox = {
      __dirname: "/app",
      module: { exports: {} as unknown },
      require: readmeRequire,
    };

    runInNewContext(getGettingStartedExample(), sandbox, { filename: "README.md" });

    const exported = sandbox.module.exports as Configuration;

    expect(Object.keys(exported).length).toBeGreaterThan(0);
    expect(() => validate(exported)).not.toThrow();
  });

  it("validates a fully configured chain config", () => {
    const config = new Config();

    config.entry("main").add("./src/index.js");
    config.output.path("/app/dist").filename("[name].js");
    config.resolve.extensions.add(".ts");
    config.module.rule("ts").test(/\.ts$/u).use("ts-loader").loader("ts-loader");
    config.optimization.splitChunks({ chunks: "all" });
    config.performance.hints(false);
    config.devServer.port(8080);
    config.plugin("define").use(DefinePlugin, [{ __DEV__: JSON.stringify(true) }]);

    expect(() => validate(config.toConfig())).not.toThrow();
  });

  it.each([
    ["output", (config: Config) => config.output.path("/app/dist")],
    ["resolve", (config: Config) => config.resolve.extensions.add(".ts")],
    ["resolveLoader", (config: Config) => config.resolveLoader.modules.add("node_modules")],
    ["devServer", (config: Config) => config.devServer.port(8080)],
    ["module", (config: Config) => config.module.rule("js").test(/\.js$/u)],
    ["optimization", (config: Config) => config.optimization.minimize(false)],
    ["performance", (config: Config) => config.performance.hints(false)],
    ["entry", (config: Config) => config.entry("main").add("./src/index.js")],
  ])("validates a %s-only config", (_name, applyOption) => {
    const config = new Config();

    applyOption(config);

    expect(() => validate(config.toConfig())).not.toThrow();
  });
});
