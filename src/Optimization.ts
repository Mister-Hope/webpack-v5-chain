import type { Configuration, WebpackPluginInstance } from "webpack";

import type { Config } from "./Config.js";
import { Plugin } from "./Plugin.js";
import { ChainedMap, ChainedValueMap, TypedChainedMap } from "./utils/index.js";

type WebpackOptimization = Required<NonNullable<Configuration["optimization"]>>;
type SplitChunksObject = Exclude<WebpackOptimization["splitChunks"], false>;

export class Optimization extends ChainedMap<Config> {
  minimizers: TypedChainedMap<this, Record<string, Plugin<this, WebpackPluginInstance>>>;
  // oxlint-disable-next-line typescript/no-explicit-any
  splitChunks!: ChainedValueMap<this> & ((value: SplitChunksObject | false) => this);

  constructor(parent?: Config) {
    super(parent);
    this.minimizers = new TypedChainedMap(this);
    // oxlint-disable-next-line typescript/no-explicit-any
    (this as any).splitChunks = new ChainedValueMap(this) as unknown as Optimization["splitChunks"];
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

  declare checkWasmTypes: (value: WebpackOptimization["checkWasmTypes"]) => this;
  declare chunkIds: (value: WebpackOptimization["chunkIds"]) => this;
  declare concatenateModules: (value: WebpackOptimization["concatenateModules"]) => this;
  declare emitOnErrors: (value: WebpackOptimization["emitOnErrors"]) => this;
  declare avoidEntryIife: (value: WebpackOptimization["avoidEntryIife"]) => this;
  declare flagIncludedChunks: (value: WebpackOptimization["flagIncludedChunks"]) => this;
  declare innerGraph: (value: WebpackOptimization["innerGraph"]) => this;
  declare mangleExports: (value: WebpackOptimization["mangleExports"]) => this;
  declare mangleWasmImports: (value: WebpackOptimization["mangleWasmImports"]) => this;
  declare mergeDuplicateChunks: (value: WebpackOptimization["mergeDuplicateChunks"]) => this;
  declare minimize: (value: WebpackOptimization["minimize"]) => this;
  declare moduleIds: (value: WebpackOptimization["moduleIds"]) => this;
  declare nodeEnv: (value: WebpackOptimization["nodeEnv"]) => this;
  declare portableRecords: (value: WebpackOptimization["portableRecords"]) => this;
  declare providedExports: (value: WebpackOptimization["providedExports"]) => this;
  declare realContentHash: (value: WebpackOptimization["realContentHash"]) => this;
  declare removeAvailableModules: (value: WebpackOptimization["removeAvailableModules"]) => this;
  declare removeEmptyChunks: (value: WebpackOptimization["removeEmptyChunks"]) => this;
  declare runtimeChunk: (value: WebpackOptimization["runtimeChunk"]) => this;
  declare sideEffects: (value: WebpackOptimization["sideEffects"]) => this;
  declare usedExports: (value: WebpackOptimization["usedExports"]) => this;

  minimizer(name: string): Plugin<this, WebpackPluginInstance> {
    return this.minimizers.getOrCompute(
      name,
      () => new Plugin(this, name, "optimization.minimizer"),
    );
  }

  toConfig(): Record<string, unknown> {
    return this.omitEmpty(
      Object.assign(this.entries() ?? {}, {
        // oxlint-disable-next-line typescript/no-explicit-any
        splitChunks: (this.splitChunks as any).entries(),
        minimizer: this.minimizers.values().map((plugin) => plugin.toConfig()),
      }),
    );
  }

  override merge(obj: Record<string, unknown>, omit: string[] = []): this {
    if (!omit.includes("minimizer") && "minimizer" in obj)
      Object.keys(obj.minimizer as object).forEach((name) =>
        this.minimizer(name).merge(
          (obj.minimizer as Record<string, Record<string, unknown>>)[name],
        ),
      );

    return super.merge(obj, [...omit, "minimizer"]);
  }
}
