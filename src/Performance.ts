import type { Configuration } from "webpack";

import type { Config } from "./Config.js";
import { ChainedValueMap } from "./utils/index.js";

type WebpackPerformance = Exclude<Required<NonNullable<Configuration["performance"]>>, false>;

// oxlint-disable-next-line no-redeclare, typescript/no-unsafe-declaration-merging
export class Performance extends ChainedValueMap<Config> {
  constructor(parent?: Config) {
    super(parent);
    this.extend([
      "all",
      "analyzableBailouts",
      "assetFilter",
      "asyncChunkWaterfalls",
      "broadContexts",
      "cacheEffectiveness",
      "circularDependencies",
      "conflictingResourceHints",
      "duplicateModules",
      "duplicatePackages",
      "dynamicExports",
      "evalUsage",
      "hints",
      "hotspots",
      "inlinedAssets",
      "largeModules",
      "legacyJavascript",
      "maxAssetSize",
      "maxEntrypointSize",
      "missingSideEffects",
      "mixedExports",
      "osDependentRules",
      "pureAnnotations",
      "redundantDynamicImports",
      "scopeHoistingBailouts",
      "sourceMaps",
      "splitChunksCapped",
      "tinyChunks",
      "topLevelThis",
      "unsplitVendors",
      "unusedAssets",
      "unusedConfig",
      "unusedModules",
    ]);
  }

  declare all: (value: WebpackPerformance["all"]) => this;
  declare analyzableBailouts: (value: WebpackPerformance["analyzableBailouts"]) => this;
  declare assetFilter: (value: WebpackPerformance["assetFilter"]) => this;
  declare asyncChunkWaterfalls: (value: WebpackPerformance["asyncChunkWaterfalls"]) => this;
  declare broadContexts: (value: WebpackPerformance["broadContexts"]) => this;
  declare cacheEffectiveness: (value: WebpackPerformance["cacheEffectiveness"]) => this;
  declare circularDependencies: (value: WebpackPerformance["circularDependencies"]) => this;
  declare conflictingResourceHints: (value: WebpackPerformance["conflictingResourceHints"]) => this;
  declare duplicateModules: (value: WebpackPerformance["duplicateModules"]) => this;
  declare duplicatePackages: (value: WebpackPerformance["duplicatePackages"]) => this;
  declare dynamicExports: (value: WebpackPerformance["dynamicExports"]) => this;
  declare evalUsage: (value: WebpackPerformance["evalUsage"]) => this;
  declare hints: (value: WebpackPerformance["hints"]) => this;
  declare hotspots: (value: WebpackPerformance["hotspots"]) => this;
  declare inlinedAssets: (value: WebpackPerformance["inlinedAssets"]) => this;
  declare largeModules: (value: WebpackPerformance["largeModules"]) => this;
  declare legacyJavascript: (value: WebpackPerformance["legacyJavascript"]) => this;
  declare maxAssetSize: (value: WebpackPerformance["maxAssetSize"]) => this;
  declare maxEntrypointSize: (value: WebpackPerformance["maxEntrypointSize"]) => this;
  declare missingSideEffects: (value: WebpackPerformance["missingSideEffects"]) => this;
  declare mixedExports: (value: WebpackPerformance["mixedExports"]) => this;
  declare osDependentRules: (value: WebpackPerformance["osDependentRules"]) => this;
  declare pureAnnotations: (value: WebpackPerformance["pureAnnotations"]) => this;
  declare redundantDynamicImports: (value: WebpackPerformance["redundantDynamicImports"]) => this;
  declare scopeHoistingBailouts: (value: WebpackPerformance["scopeHoistingBailouts"]) => this;
  declare sourceMaps: (value: WebpackPerformance["sourceMaps"]) => this;
  declare splitChunksCapped: (value: WebpackPerformance["splitChunksCapped"]) => this;
  declare tinyChunks: (value: WebpackPerformance["tinyChunks"]) => this;
  declare topLevelThis: (value: WebpackPerformance["topLevelThis"]) => this;
  declare unsplitVendors: (value: WebpackPerformance["unsplitVendors"]) => this;
  declare unusedAssets: (value: WebpackPerformance["unusedAssets"]) => this;
  declare unusedConfig: (value: WebpackPerformance["unusedConfig"]) => this;
  declare unusedModules: (value: WebpackPerformance["unusedModules"]) => this;
}

export interface Performance {
  // oxlint-disable-next-line typescript/prefer-function-type
  (value: boolean): Config;
}
