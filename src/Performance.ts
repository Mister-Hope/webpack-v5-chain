import type { Configuration } from "webpack";

import type { Config } from "./Config.js";
import { ChainedValueMap } from "./utils/index.js";

type WebpackPerformance = Exclude<Required<NonNullable<Configuration["performance"]>>, false>;

// oxlint-disable-next-line typescript/no-unsafe-declaration-merging
export class Performance extends ChainedValueMap<Config> {
  public constructor(parent?: Config) {
    super(parent);
    this.extend(["assetFilter", "hints", "maxAssetSize", "maxEntrypointSize"]);
  }

  declare public assetFilter: (value: WebpackPerformance["assetFilter"]) => this;
  declare public hints: (value: WebpackPerformance["hints"]) => this;
  declare public maxAssetSize: (value: WebpackPerformance["maxAssetSize"]) => this;
  declare public maxEntrypointSize: (value: WebpackPerformance["maxEntrypointSize"]) => this;
}

export interface Performance {
  // oxlint-disable-next-line typescript/prefer-function-type
  (value: boolean): Config;
}
