import { ChainedValueMap } from "./utils/index.js";

export class Performance extends ChainedValueMap {
  constructor(parent) {
    super(parent);
    this.extend(["assetFilter", "hints", "maxAssetSize", "maxEntrypointSize"]);
  }
}
