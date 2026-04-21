// oxlint-disable max-classes-per-file
import type Webpack from "webpack";
import type {
  Compiler,
  Configuration,
  ResolveOptions,
  WebpackPluginInstance,
  RuleSetRule,
} from "webpack";
import type {
  Configuration as DevServerConfiguration,
  ExpressApplication,
} from "webpack-dev-server";
import Server from "webpack-dev-server";

import type { ChainedSet, Orderable } from "./utils.js";
import { ChainedMap, TypedChainedMap, TypedChainedSet } from "./utils.js";

type WebpackConfig = Required<Configuration>;

export class Config extends ChainedMap<void> {
  public entryPoints: TypedChainedMap<Config, Record<string, EntryPoint>>;
  public output: Output;
  public module: Module;
  public optimization: Optimization;
  public performance: Performance & ((value: boolean) => this);
  public plugins: Plugins<this, WebpackPluginInstance>;
  public resolve: Resolve;
  public resolveLoader: ResolveLoader;
  public devServer: DevServer;

  public entry(name: string): EntryPoint;
  public plugin(name: string): Plugin<this, WebpackPluginInstance>;

  public context(value: WebpackConfig["context"]): this;
  public mode(value: WebpackConfig["mode"]): this;
  public cache(value: WebpackConfig["cache"]): this;
  public devtool(value: WebpackConfig["devtool"]): this;
  public target(value: WebpackConfig["target"]): this;
  public watch(value: WebpackConfig["watch"]): this;
  public watchOptions(value: WebpackConfig["watchOptions"]): this;
  public externals(value: WebpackConfig["externals"]): this;
  public externalsType(value: WebpackConfig["externalsType"]): this;
  public externalsPresets(value: WebpackConfig["externalsPresets"]): this;
  public dotenv(value: WebpackConfig["dotenv"]): this;
  public node(value: WebpackConfig["node"]): this;
  public stats(value: WebpackConfig["stats"]): this;
  public experiments(value: WebpackConfig["experiments"]): this;
  public infrastructureLogging(value: WebpackConfig["infrastructureLogging"]): this;
  public amd(value: WebpackConfig["amd"]): this;
  public bail(value: WebpackConfig["bail"]): this;
  public dependencies(value: WebpackConfig["dependencies"]): this;
  public ignoreWarnings(value: WebpackConfig["ignoreWarnings"]): this;
  public loader(value: WebpackConfig["loader"]): this;
  public name(value: WebpackConfig["name"]): this;
  public parallelism(value: WebpackConfig["parallelism"]): this;
  public profile(value: WebpackConfig["profile"]): this;
  public recordsInputPath(value: WebpackConfig["recordsInputPath"]): this;
  public recordsOutputPath(value: WebpackConfig["recordsOutputPath"]): this;
  public recordsPath(value: WebpackConfig["recordsPath"]): this;
  public snapshot(value: WebpackConfig["snapshot"]): this;

  public toConfig(): Configuration;
}

export class Plugins<Parent, PluginType extends WebpackPluginInstance> extends TypedChainedMap<
  Parent,
  Record<string, Plugin<Parent, PluginType>>
> {}
export class Plugin<Parent, PluginType extends WebpackPluginInstance | ResolvePlugin>
  extends ChainedMap<Parent>
  implements Orderable
{
  public init<Plugin extends PluginType | PluginClass<PluginType>>(
    value: (
      plugin: Plugin,
      // oxlint-disable-next-line typescript/no-explicit-any
      args: Plugin extends PluginClass<PluginType> ? ConstructorParameters<Plugin> : any[],
    ) => PluginType,
  ): this;
  public use<Plugin extends string | PluginType | PluginClass<PluginType>>(
    plugin: Plugin,
    // oxlint-disable-next-line typescript/no-explicit-any
    args?: Plugin extends PluginClass<PluginType> ? ConstructorParameters<Plugin> : any[],
  ): this;
  public tap<Plugin extends PluginClass<PluginType>>(
    func: (args: ConstructorParameters<Plugin>) => ConstructorParameters<Plugin>,
  ): this;

  // Orderable
  public before(name: string): this;
  public after(name: string): this;
}

type WebpackEntry = NonNullable<Configuration["entry"]>;

type WebpackEntryObject = Exclude<
  WebpackEntry,
  // oxlint-disable-next-line typescript/ban-types, typescript/no-unsafe-function-type
  string | string[] | Function
>[string];

export class EntryPoint extends TypedChainedSet<Config, WebpackEntryObject> {}

type WebpackModule = Required<NonNullable<Configuration["module"]>>;

export class Module extends ChainedMap<Config> {
  public rules: TypedChainedMap<this, Record<string, Rule>>;
  public generator: ChainedMap<this>;
  public parser: ChainedMap<this>;
  public rule(name: string): Rule;
  public noParse(value: WebpackModule["noParse"]): this;
  public unsafeCache(value: WebpackModule["unsafeCache"]): this;
  public exprContextCritical(value: WebpackModule["exprContextCritical"]): this;
  public exprContextRecursive(value: WebpackModule["exprContextRecursive"]): this;
  public exprContextRegExp(value: WebpackModule["exprContextRegExp"]): this;
  public unknownContextCritical(value: WebpackModule["unknownContextCritical"]): this;
  public unknownContextRecursive(value: WebpackModule["unknownContextRecursive"]): this;
  public unknownContextRegExp(value: WebpackModule["unknownContextRegExp"]): this;
  public unknownContextRequest(value: WebpackModule["unknownContextRequest"]): this;
  public wrappedContextCritical(value: WebpackModule["wrappedContextCritical"]): this;
  public wrappedContextRecursive(value: WebpackModule["wrappedContextRecursive"]): this;
  public wrappedContextRegExp(value: WebpackModule["wrappedContextRegExp"]): this;
  public strictExportPresence(value: WebpackModule["strictExportPresence"]): this;
}

type WebpackOutput = Required<NonNullable<Configuration["output"]>>;

export class Output extends ChainedMap<Config> {
  public assetModuleFilename(value: WebpackOutput["assetModuleFilename"]): this;
  public asyncChunks(value: WebpackOutput["asyncChunks"]): this;
  public auxiliaryComment(value: WebpackOutput["auxiliaryComment"]): this;
  public charset(value: WebpackOutput["charset"]): this;
  public chunkFilename(value: WebpackOutput["chunkFilename"]): this;
  public chunkFormat(value: WebpackOutput["chunkFormat"]): this;
  public chunkLoadTimeout(value: WebpackOutput["chunkLoadTimeout"]): this;
  public chunkLoadingGlobal(value: WebpackOutput["chunkLoadingGlobal"]): this;
  public chunkLoading(value: WebpackOutput["chunkLoading"]): this;
  public clean(value: WebpackOutput["clean"]): this;
  public compareBeforeEmit(value: WebpackOutput["compareBeforeEmit"]): this;
  public crossOriginLoading(value: WebpackOutput["crossOriginLoading"]): this;
  public cssChunkFilename(value: WebpackOutput["cssChunkFilename"]): this;
  public cssFilename(value: WebpackOutput["cssFilename"]): this;
  public devtoolFallbackModuleFilenameTemplate(
    value: WebpackOutput["devtoolFallbackModuleFilenameTemplate"],
  ): this;
  public devtoolModuleFilenameTemplate(value: WebpackOutput["devtoolModuleFilenameTemplate"]): this;
  public devtoolNamespace(value: WebpackOutput["devtoolNamespace"]): this;
  public enabledChunkLoadingTypes(value: WebpackOutput["enabledChunkLoadingTypes"]): this;
  public enabledLibraryTypes(value: WebpackOutput["enabledLibraryTypes"]): this;
  public enabledWasmLoadingTypes(value: WebpackOutput["enabledWasmLoadingTypes"]): this;
  public environment(value: WebpackOutput["environment"]): this;
  public filename(value: WebpackOutput["filename"]): this;
  public globalObject(value: WebpackOutput["globalObject"]): this;
  public hashDigest(value: WebpackOutput["hashDigest"]): this;
  public hashDigestLength(value: WebpackOutput["hashDigestLength"]): this;
  public hashFunction(value: WebpackOutput["hashFunction"]): this;
  public hashSalt(value: WebpackOutput["hashSalt"]): this;
  public hotUpdateChunkFilename(value: WebpackOutput["hotUpdateChunkFilename"]): this;
  public hotUpdateGlobal(value: WebpackOutput["hotUpdateGlobal"]): this;
  public hotUpdateMainFilename(value: WebpackOutput["hotUpdateMainFilename"]): this;
  public iife(value: WebpackOutput["iife"]): this;
  public ignoreBrowserWarnings(value: WebpackOutput["ignoreBrowserWarnings"]): this;
  public importFunctionName(value: WebpackOutput["importFunctionName"]): this;
  public importMetaName(value: WebpackOutput["importMetaName"]): this;
  public library(value: WebpackOutput["library"]): this;
  public libraryExport(value: WebpackOutput["libraryExport"]): this;
  public libraryTarget(value: WebpackOutput["libraryTarget"]): this;
  public module(value: WebpackOutput["module"]): this;
  public path(value: WebpackOutput["path"]): this;
  public pathinfo(value: WebpackOutput["pathinfo"]): this;
  public publicPath(value: WebpackOutput["publicPath"]): this;
  public scriptType(value: WebpackOutput["scriptType"]): this;
  public sourceMapFilename(value: WebpackOutput["sourceMapFilename"]): this;
  public sourcePrefix(value: WebpackOutput["sourcePrefix"]): this;
  public strictModuleErrorHandling(value: WebpackOutput["strictModuleErrorHandling"]): this;
  public strictModuleExceptionHandling(value: WebpackOutput["strictModuleExceptionHandling"]): this;
  public trustedTypes(value: WebpackOutput["trustedTypes"]): this;
  public umdNamedDefine(value: WebpackOutput["umdNamedDefine"]): this;
  public uniqueName(value: WebpackOutput["uniqueName"]): this;
  public wasmLoading(value: WebpackOutput["wasmLoading"]): this;
  public webassemblyModuleFilename(value: WebpackOutput["webassemblyModuleFilename"]): this;
  public workerChunkLoading(value: WebpackOutput["workerChunkLoading"]): this;
  public workerPublicPath(value: WebpackOutput["workerPublicPath"]): this;
  public workerWasmLoading(value: WebpackOutput["workerWasmLoading"]): this;
}

type DevServerOptions = DevServerConfiguration;

export class DevServerClient extends ChainedMap<DevServer> {
  public logging(value: DevServerOptions["client"]["logging"]): this;
  public overlay(value: DevServerOptions["client"]["overlay"]): this;
  public progress(value: DevServerOptions["client"]["progress"]): this;
  public reconnect(value: DevServerOptions["client"]["reconnect"]): this;
  public webSocketURL(value: DevServerOptions["client"]["webSocketURL"]): this;
}

export class DevServer extends ChainedMap<Config> {
  public allowedHosts: TypedChainedSet<this, string>;
  public app(value: DevServerOptions["app"]): this;
  public bonjour(value: DevServerOptions["bonjour"]): this;
  public client: DevServerClient;
  public compress(value: DevServerOptions["compress"]): this;
  public devMiddleware(value: DevServerOptions["devMiddleware"]): this;
  public headers(value: DevServerOptions["headers"]): this;
  public historyApiFallback(value: DevServerOptions["historyApiFallback"]): this;
  public host(value: DevServerOptions["host"]): this;
  public hot(value: DevServerOptions["hot"]): this;
  public ipc(value: DevServerOptions["ipc"]): this;
  public liveReload(value: DevServerOptions["liveReload"]): this;
  public onListening(value: DevServerOptions["onListening"]): this;
  public open(value: DevServerOptions["open"]): this;
  public port(value: DevServerOptions["port"]): this;
  public proxy(value: DevServerOptions["proxy"]): this;
  public server(value: DevServerOptions["server"]): this;
  public setupExitSignals(value: DevServerOptions["setupExitSignals"]): this;
  public setupMiddlewares(value: DevServerOptions["setupMiddlewares"]): this;
  public static(value: DevServerOptions["static"]): this;
  public watchFiles(value: DevServerOptions["watchFiles"]): this;
  public webSocketServer(value: DevServerOptions["webSocketServer"]): this;
}

type WebpackPerformance = Exclude<Required<NonNullable<Configuration["performance"]>>, false>;
export class Performance extends ChainedMap<Config> {
  public hints(value: WebpackPerformance["hints"]): this;
  public maxEntrypointSize(value: WebpackPerformance["maxEntrypointSize"]): this;
  public maxAssetSize(value: WebpackPerformance["maxAssetSize"]): this;
  public assetFilter(value: WebpackPerformance["assetFilter"]): this;
}

type WebpackResolve = Required<NonNullable<Configuration["resolve"]>>;
type ResolvePlugin = Exclude<NonNullable<ResolveOptions["plugins"]>[number], "...">;

export class Resolve<ConfigType = Config> extends ChainedMap<ConfigType> {
  public alias: TypedChainedMap<this, Record<string, string | false | string[]>>;
  public aliasFields: TypedChainedSet<this, WebpackResolve["aliasFields"][number]>;
  public byDependency: TypedChainedMap<this, WebpackResolve["byDependency"]>;
  public conditionNames: TypedChainedSet<this, WebpackResolve["conditionNames"][number]>;
  public descriptionFiles: TypedChainedSet<this, WebpackResolve["descriptionFiles"][number]>;
  public exportsFields: TypedChainedSet<this, WebpackResolve["exportsFields"][number]>;
  public extensionAlias: TypedChainedMap<this, WebpackResolve["extensionAlias"]>;
  public extensions: TypedChainedSet<this, WebpackResolve["extensions"][number]>;
  public fallback: TypedChainedMap<this, Record<string, string | false | string[]>>;
  public importsFields: TypedChainedSet<this, WebpackResolve["importsFields"][number]>;
  public mainFields: TypedChainedSet<this, WebpackResolve["mainFields"][number]>;
  public mainFiles: TypedChainedSet<this, WebpackResolve["mainFiles"][number]>;
  public modules: TypedChainedSet<this, WebpackResolve["modules"][number]>;
  public plugins: TypedChainedMap<this, Record<string, Plugin<Resolve, ResolvePlugin>>>;
  public restrictions: TypedChainedSet<this, WebpackResolve["restrictions"][number]>;
  public roots: TypedChainedSet<this, WebpackResolve["roots"][number]>;

  public plugin(name: string): Plugin<this, ResolvePlugin>;

  public cache(value: WebpackResolve["cache"]): this;
  public cachePredicate(value: WebpackResolve["cachePredicate"]): this;
  public cacheWithContext(value: WebpackResolve["cacheWithContext"]): this;
  public enforceExtension(value: WebpackResolve["enforceExtension"]): this;
  public fullySpecified(value: WebpackResolve["fullySpecified"]): this;
  public preferAbsolute(value: WebpackResolve["preferAbsolute"]): this;
  public preferRelative(value: WebpackResolve["preferRelative"]): this;
  public symlinks(value: WebpackResolve["symlinks"]): this;
  public unsafeCache(value: WebpackResolve["unsafeCache"]): this;
  public useSyncFileSystemCalls(value: WebpackResolve["useSyncFileSystemCalls"]): this;
}

export class RuleResolve<ConfigType = Config> extends Resolve<ConfigType> {
  public fullySpecified(value: boolean): this;
}

export class ResolveLoader extends Resolve {
  public modules: ChainedSet<this>;
  public moduleExtensions: ChainedSet<this>;
  public packageMains: ChainedSet<this>;
}

type WebpackRuleSet = Required<RuleSetRule>;

export class Rule<RuleType = Module> extends ChainedMap<RuleType> implements Orderable {
  public uses: TypedChainedMap<this, Record<string, Use>>;
  public include: TypedChainedSet<this, WebpackRuleSet["include"]>;
  public exclude: TypedChainedSet<this, WebpackRuleSet["exclude"]>;
  public rules: TypedChainedMap<this, Record<string, Rule<Rule>>>;
  public oneOfs: TypedChainedMap<this, Record<string, Rule<Rule>>>;
  public resolve: RuleResolve<Rule<RuleType>>;

  public assert(value: WebpackRuleSet["assert"]): this;
  public compiler(value: WebpackRuleSet["compiler"]): this;
  public enforce(value: WebpackRuleSet["enforce"]): this;
  public issuer(value: WebpackRuleSet["issuer"]): this;
  public issuerLayer(value: WebpackRuleSet["issuerLayer"]): this;
  public layer(value: WebpackRuleSet["layer"]): this;
  public extractSourceMap(value: WebpackRuleSet["extractSourceMap"]): this;
  public mimetype(value: WebpackRuleSet["mimetype"]): this;
  public parser(value: WebpackRuleSet["parser"]): this;
  public generator(value: WebpackRuleSet["generator"]): this;
  public resource(value: WebpackRuleSet["resource"]): this;
  public resourceQuery(value: WebpackRuleSet["resourceQuery"]): this;
  public scheme(value: WebpackRuleSet["scheme"]): this;
  public sideEffects(value: WebpackRuleSet["sideEffects"]): this;
  public test(value: WebpackRuleSet["test"]): this;
  public type(value: WebpackRuleSet["type"]): this;
  public with(value: WebpackRuleSet["with"]): this;

  public use(name: string): Use<this>;
  public rule(name: string): Rule<Rule>;
  public oneOf(name: string): Rule<Rule>;
  public pre(): this;
  public post(): this;
  public before(name: string): this;
  public after(name: string): this;
}

type WebpackOptimization = Required<NonNullable<Configuration["optimization"]>>;
type SplitChunksObject = Exclude<WebpackOptimization["splitChunks"], false>;
export class Optimization extends ChainedMap<Config> {
  public checkWasmTypes(value: WebpackOptimization["checkWasmTypes"]): this;
  public chunkIds(value: WebpackOptimization["chunkIds"]): this;
  public concatenateModules(value: WebpackOptimization["concatenateModules"]): this;
  public emitOnErrors(value: WebpackOptimization["emitOnErrors"]): this;
  public avoidEntryIife(value: WebpackOptimization["avoidEntryIife"]): this;
  public flagIncludedChunks(value: WebpackOptimization["flagIncludedChunks"]): this;
  public innerGraph(value: WebpackOptimization["innerGraph"]): this;
  public mangleExports(value: WebpackOptimization["mangleExports"]): this;
  public mangleWasmImports(value: WebpackOptimization["mangleWasmImports"]): this;
  public mergeDuplicateChunks(value: WebpackOptimization["mergeDuplicateChunks"]): this;
  public minimize(value: WebpackOptimization["minimize"]): this;
  public minimizer(name: string): Plugin<this, WebpackPluginInstance>;
  public moduleIds(value: WebpackOptimization["moduleIds"]): this;
  public nodeEnv(value: WebpackOptimization["nodeEnv"]): this;
  public portableRecords(value: WebpackOptimization["portableRecords"]): this;
  public providedExports(value: WebpackOptimization["providedExports"]): this;
  public realContentHash(value: WebpackOptimization["realContentHash"]): this;
  public removeAvailableModules(value: WebpackOptimization["removeAvailableModules"]): this;
  public removeEmptyChunks(value: WebpackOptimization["removeEmptyChunks"]): this;
  public runtimeChunk(value: WebpackOptimization["runtimeChunk"]): this;
  public sideEffects(value: WebpackOptimization["sideEffects"]): this;
  public splitChunks: TypedChainedMap<this, SplitChunksObject> &
    ((value: SplitChunksObject | false) => this);
  public usedExports(value: WebpackOptimization["usedExports"]): this;
}

interface RuntimeChunk {
  name: string | RuntimeChunkFunction;
}

type RuntimeChunkFunction = (entryPoint: EntryPoint) => string;

// oxlint-disable-next-line typescript/no-explicit-any
type SplitChunksOptions = Record<string, any>;

// oxlint-disable-next-line typescript/no-explicit-any
type LoaderOptions = Record<string, any>;

export class Use<Parent = Rule> extends ChainedMap<Parent> implements Orderable {
  public loader(value: string): this;
  public options(value: LoaderOptions): this;

  public tap(func: (options: LoaderOptions) => LoaderOptions): this;

  // Orderable
  public before(name: string): this;
  public after(name: string): this;
}

export type PluginClass<PluginType extends WebpackPluginInstance | ResolvePlugin> = new (
  // oxlint-disable-next-line typescript/no-explicit-any
  ...opts: any[]
) => PluginType;
