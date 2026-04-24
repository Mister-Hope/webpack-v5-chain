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

  declare public checkWasmTypes: (value: WebpackOptimization["checkWasmTypes"]) => this;
  declare public chunkIds: (value: WebpackOptimization["chunkIds"]) => this;
  declare public concatenateModules: (value: WebpackOptimization["concatenateModules"]) => this;
  declare public emitOnErrors: (value: WebpackOptimization["emitOnErrors"]) => this;
  declare public avoidEntryIife: (value: WebpackOptimization["avoidEntryIife"]) => this;
  declare public flagIncludedChunks: (value: WebpackOptimization["flagIncludedChunks"]) => this;
  declare public innerGraph: (value: WebpackOptimization["innerGraph"]) => this;
  declare public mangleExports: (value: WebpackOptimization["mangleExports"]) => this;
  declare public mangleWasmImports: (value: WebpackOptimization["mangleWasmImports"]) => this;
  declare public mergeDuplicateChunks: (value: WebpackOptimization["mergeDuplicateChunks"]) => this;
  declare public minimize: (value: WebpackOptimization["minimize"]) => this;
  declare public moduleIds: (value: WebpackOptimization["moduleIds"]) => this;
  declare public nodeEnv: (value: WebpackOptimization["nodeEnv"]) => this;
  declare public portableRecords: (value: WebpackOptimization["portableRecords"]) => this;
  declare public providedExports: (value: WebpackOptimization["providedExports"]) => this;
  declare public realContentHash: (value: WebpackOptimization["realContentHash"]) => this;
  declare public removeAvailableModules: (
    value: WebpackOptimization["removeAvailableModules"],
  ) => this;
  declare public removeEmptyChunks: (value: WebpackOptimization["removeEmptyChunks"]) => this;
  declare public runtimeChunk: (value: WebpackOptimization["runtimeChunk"]) => this;
  declare public sideEffects: (value: WebpackOptimization["sideEffects"]) => this;
  declare public usedExports: (value: WebpackOptimization["usedExports"]) => this;

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
    if (!omit.includes("minimizer") && "minimizer" in obj) {
      Object.keys(obj.minimizer as object).forEach((name) => {
        this.minimizer(name).merge(
          (obj.minimizer as Record<string, Record<string, unknown>>)[name],
        );
      });
    }

    if (!omit.includes("splitChunks") && "splitChunks" in obj) {
      const { splitChunks } = obj as { splitChunks?: SplitChunksObject | false };

      if (splitChunks === false) this.splitChunks(false);
      else if (splitChunks != null && typeof splitChunks === "object")
        this.splitChunks.merge(splitChunks as Record<string, unknown>);
    }

    return super.merge(obj, [...omit, "minimizer", "splitChunks"]);
  }
}
