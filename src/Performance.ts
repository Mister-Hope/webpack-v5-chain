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

  public declare assetFilter: (value: WebpackPerformance["assetFilter"]) => this;
  public declare hints: (value: WebpackPerformance["hints"]) => this;
  public declare maxAssetSize: (value: WebpackPerformance["maxAssetSize"]) => this;
  public declare maxEntrypointSize: (value: WebpackPerformance["maxEntrypointSize"]) => this;
}

export interface Performance {
  // oxlint-disable-next-line typescript/prefer-function-type
  (value: boolean): Config;
}
