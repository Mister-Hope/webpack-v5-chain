import { describe, expect, it } from "vitest";

import { Config } from "../src/index.js";
import { ChainedValueMap } from "../src/utils/index.js";

describe("omitEmpty keeps explicitly emptied values", () => {
  it("keeps explicit empty values in a ChainedValueMap", () => {
    const map = new ChainedValueMap();

    expect(map.omitEmpty({ alpha: [], beta: [], gamma: {} }, ["alpha", "gamma"])).toStrictEqual({
      alpha: [],
      gamma: {},
    });
  });

  it("keeps explicitly cleared resolve sets", () => {
    const config = new Config();

    config.resolve.extensions.clear();

    expect(config.toConfig().resolve).toStrictEqual({ extensions: [] });
  });

  it("keeps every explicitly cleared resolve array option", () => {
    const config = new Config();
    const { resolve } = config;

    resolve.aliasFields.clear();
    resolve.conditionNames.clear();
    resolve.descriptionFiles.clear();
    resolve.exportsFields.clear();
    resolve.extensions.clear();
    resolve.importsFields.clear();
    resolve.mainFields.clear();
    resolve.mainFiles.clear();
    resolve.modules.clear();
    resolve.restrictions.clear();
    resolve.roots.clear();

    expect(config.toConfig().resolve).toStrictEqual({
      aliasFields: [],
      conditionNames: [],
      descriptionFiles: [],
      exportsFields: [],
      extensions: [],
      importsFields: [],
      mainFields: [],
      mainFiles: [],
      modules: [],
      restrictions: [],
      roots: [],
    });
  });

  it("keeps merging arrays incremental when a value already exists", () => {
    const config = new Config();

    config.resolve.extensions.add(".ts");
    config.merge({ resolve: { extensions: [] } });

    // merge() is additive for chained sets, so an empty array does not clear
    // existing values; clearing requires an explicit clear().
    expect(config.toConfig().resolve).toStrictEqual({ extensions: [".ts"] });
  });

  it("omits untouched resolve sets", () => {
    expect(new Config().toConfig().resolve).toBeUndefined();
  });

  it("keeps explicitly cleared resolveLoader sets", () => {
    const config = new Config();

    config.resolveLoader.modules.clear();

    expect(config.toConfig().resolveLoader).toStrictEqual({ modules: [] });
  });

  it("does not treat deleting a missing value as an explicit empty", () => {
    const config = new Config();

    config.resolve.extensions.delete(".ts");

    expect(config.toConfig().resolve).toBeUndefined();
  });

  it("keeps an empty set after deleting its last value", () => {
    const config = new Config();

    config.resolve.extensions.add(".ts").delete(".ts");

    expect(config.toConfig().resolve).toStrictEqual({ extensions: [] });
  });

  it("keeps an explicit empty array coming from Config.merge", () => {
    const config = new Config();

    config.merge({ resolve: { extensions: [] } });

    expect(config.toConfig().resolve).toStrictEqual({ extensions: [] });
  });

  it("keeps an explicitly empty devServer collection", () => {
    const config = new Config();

    config.devServer.static([]);

    expect(config.toConfig().devServer).toStrictEqual({ static: [] });
  });

  it("omits an explicitly cleared devServer.allowedHosts", () => {
    const config = new Config();

    config.devServer.allowedHosts.clear();

    // webpack-dev-server requires at least one item, so [] is not a legal
    // representation of "no allowed hosts"; omitting the key keeps the default.
    expect(config.toConfig().devServer).toBeUndefined();
  });

  it("omits an explicitly cleared devServer.headers", () => {
    const config = new Config();

    config.devServer.headers([]);

    expect(config.toConfig().devServer).toBeUndefined();
  });

  it("keeps other empty devServer arrays that are legal in webpack-dev-server", () => {
    const config = new Config();

    config.devServer.open([]);
    config.devServer.proxy([]);
    config.devServer.static([]);
    config.devServer.watchFiles([]);

    expect(config.toConfig().devServer).toStrictEqual({
      open: [],
      proxy: [],
      static: [],
      watchFiles: [],
    });
  });

  it("omits untouched devServer options", () => {
    expect(new Config().toConfig().devServer).toBeUndefined();
  });

  it("keeps an explicitly cleared rule include and exclude", () => {
    const config = new Config();

    config.module.rule("test").include.clear();
    config.module.rule("test").exclude.clear();

    expect(config.toConfig().module?.rules).toStrictEqual([{ include: [], exclude: [] }]);
  });

  it("keeps callable splitChunks, even when empty", () => {
    const config = new Config();

    config.optimization.splitChunks({});

    expect(config.toConfig().optimization).toStrictEqual({ splitChunks: {} });
  });

  it("omits untouched splitChunks", () => {
    expect(new Config().toConfig().optimization).toBeUndefined();
  });

  it("keeps an explicitly configured performance object", () => {
    const config = new Config();

    config.merge({ performance: {} });

    expect(config.toConfig().performance).toStrictEqual({});
  });

  it("keeps an explicitly configured splitChunks object through Config.merge", () => {
    const config = new Config();

    config.merge({ optimization: { splitChunks: {} } });

    expect(config.toConfig().optimization).toStrictEqual({ splitChunks: {} });
  });

  it("keeps an explicitly false performance", () => {
    const config = new Config();

    config.performance(false);

    expect(config.toConfig().performance).toBe(false);
  });

  it("omits untouched performance options", () => {
    expect(new Config().toConfig().performance).toBeUndefined();
  });

  it("treats an empty merge as an explicit empty callable value", () => {
    const map = new ChainedValueMap();

    map.merge({});

    expect(map.useMap).toBe(false);
    expect(map.entries()).toStrictEqual({});
  });

  it("ignores an empty merge when map entries exist", () => {
    const map = new ChainedValueMap();

    map.set("alpha", 1);
    map.merge({});

    expect(map.useMap).toBe(true);
    expect(map.entries()).toStrictEqual({ alpha: 1 });
  });

  it("ignores an empty merge when a callable value is set", () => {
    const map = new ChainedValueMap();

    map.classCall({ alpha: 1 });
    map.merge({});

    expect(map.values()).toStrictEqual({ alpha: 1 });
  });
});
