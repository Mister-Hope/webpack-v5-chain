import { Plugin } from "./Plugin.js";
import { ChainedMap, ChainedValueMap } from "./utils/index.js";

export class Optimization extends ChainedMap {
  constructor(parent) {
    super(parent);
    this.minimizers = new ChainedMap(this);
    this.splitChunks = new ChainedValueMap(this);
    this.extend([
      "checkWasmTypes",
      "chunkIds",
      "concatenateModules",
      "emitOnErrors",
      "avoidEntryIife",
      "flagIncludedChunks",
      "innerGraph",
      "mangleExports",
      "mangleWasmImports",
      "mergeDuplicateChunks",
      "minimize",
      "moduleIds",
      "nodeEnv",
      "portableRecords",
      "providedExports",
      "realContentHash",
      "removeAvailableModules",
      "removeEmptyChunks",
      "runtimeChunk",
      "sideEffects",
      "usedExports",
    ]);
  }

  minimizer(name) {
    return this.minimizers.getOrCompute(
      name,
      () => new Plugin(this, name, "optimization.minimizer"),
    );
  }

  toConfig() {
    return this.clean(
      Object.assign(this.entries() || {}, {
        splitChunks: this.splitChunks.entries(),
        minimizer: this.minimizers.values().map((plugin) => plugin.toConfig()),
      }),
    );
  }

  merge(obj, omit = []) {
    if (!omit.includes("minimizer") && "minimizer" in obj) {
      Object.keys(obj.minimizer).forEach((name) =>
        this.minimizer(name).merge(obj.minimizer[name]),
      );
    }

    return super.merge(obj, [...omit, "minimizer"]);
  }
}
