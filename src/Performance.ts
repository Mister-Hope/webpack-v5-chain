import type { Configuration } from "webpack";

import type { Config } from "./Config.js";
import { ChainedValueMap } from "./utils/index.js";

type WebpackPerformance = Exclude<Required<NonNullable<Configuration["performance"]>>, false>;

export class Performance extends ChainedValueMap<Config> {
  constructor(parent?: Config) {
    super(parent);
    this.extend(["assetFilter", "hints", "maxAssetSize", "maxEntrypointSize"]);
  }

  declare assetFilter: (value: WebpackPerformance["assetFilter"]) => this;
  declare hints: (value: WebpackPerformance["hints"]) => this;
  declare maxAssetSize: (value: WebpackPerformance["maxAssetSize"]) => this;
  declare maxEntrypointSize: (value: WebpackPerformance["maxEntrypointSize"]) => this;
}

export interface Performance {
  (value: boolean): Config;
}
