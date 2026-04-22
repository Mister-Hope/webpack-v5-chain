import type { Configuration, WebpackPluginInstance } from "webpack";

import type { Config } from "./Config.js";
import { Plugin } from "./Plugin.js";
import { ChainedMap, ChainedValueMap, TypedChainedMap } from "./utils/index.js";

type WebpackOptimization = Required<NonNullable<Configuration["optimization"]>>;
type SplitChunksObject = Exclude<WebpackOptimization["splitChunks"], false>;

export class Optimization extends ChainedMap<Config> {
  public minimizers: TypedChainedMap<this, Record<string, Plugin<this, WebpackPluginInstance>>>;
  public splitChunks!: ChainedValueMap<this> & ((value: SplitChunksObject | false) => this);

  public constructor(parent?: Config) {
    super(parent);
    this.minimizers = new TypedChainedMap(this);
    // oxlint-disable-next-line typescript/no-explicit-any, typescript/no-unsafe-member-access
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

  public declare checkWasmTypes: (value: WebpackOptimization["checkWasmTypes"]) => this;
  public declare chunkIds: (value: WebpackOptimization["chunkIds"]) => this;
  public declare concatenateModules: (value: WebpackOptimization["concatenateModules"]) => this;
  public declare emitOnErrors: (value: WebpackOptimization["emitOnErrors"]) => this;
  public declare avoidEntryIife: (value: WebpackOptimization["avoidEntryIife"]) => this;
  public declare flagIncludedChunks: (value: WebpackOptimization["flagIncludedChunks"]) => this;
  public declare innerGraph: (value: WebpackOptimization["innerGraph"]) => this;
  public declare mangleExports: (value: WebpackOptimization["mangleExports"]) => this;
  public declare mangleWasmImports: (value: WebpackOptimization["mangleWasmImports"]) => this;
  public declare mergeDuplicateChunks: (value: WebpackOptimization["mergeDuplicateChunks"]) => this;
  public declare minimize: (value: WebpackOptimization["minimize"]) => this;
  public declare moduleIds: (value: WebpackOptimization["moduleIds"]) => this;
  public declare nodeEnv: (value: WebpackOptimization["nodeEnv"]) => this;
  public declare portableRecords: (value: WebpackOptimization["portableRecords"]) => this;
  public declare providedExports: (value: WebpackOptimization["providedExports"]) => this;
  public declare realContentHash: (value: WebpackOptimization["realContentHash"]) => this;
  public declare removeAvailableModules: (value: WebpackOptimization["removeAvailableModules"]) => this;
  public declare removeEmptyChunks: (value: WebpackOptimization["removeEmptyChunks"]) => this;
  public declare runtimeChunk: (value: WebpackOptimization["runtimeChunk"]) => this;
  public declare sideEffects: (value: WebpackOptimization["sideEffects"]) => this;
  public declare usedExports: (value: WebpackOptimization["usedExports"]) => this;

  public minimizer(name: string): Plugin<this, WebpackPluginInstance> {
    return this.minimizers.getOrCompute(
      name,
      () => new Plugin(this, name, "optimization.minimizer"),
    );
  }

  public toConfig(): Record<string, unknown> {
    return this.omitEmpty(
      // oxlint-disable-next-line typescript/no-unsafe-argument
      Object.assign(this.entries() ?? {}, {
        // oxlint-disable-next-line typescript/no-explicit-any, typescript/no-unsafe-assignment, typescript/no-unsafe-call, typescript/no-unsafe-member-access
        splitChunks: (this.splitChunks as any).entries(),
        minimizer: this.minimizers.values().map((plugin) => plugin.toConfig()),
      }),
    );
  }

  public override merge(obj: Record<string, unknown>, omit: string[] = []): this {
    if (!omit.includes("minimizer") && "minimizer" in obj)
      Object.keys(obj.minimizer as object).forEach((name) => {
        this.minimizer(name).merge(
          (obj.minimizer as Record<string, Record<string, unknown>>)[name],
        );
      });

    if (!omit.includes("splitChunks") && "splitChunks" in obj) {
      const { splitChunks } = obj as { splitChunks?: SplitChunksObject | false };

      if (splitChunks === false)
        this.splitChunks(false);
      else if (splitChunks != null && typeof splitChunks === "object")
        this.splitChunks.merge(splitChunks as Record<string, unknown>);
    }

    return super.merge(obj, [...omit, "minimizer", "splitChunks"]);
  }
}
