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

import type { ChainedSet, Orderable } from "./utils.js";
import { ChainedMap, TypedChainedMap, TypedChainedSet } from "./utils.js";
import Server from "webpack-dev-server";

type WebpackConfig = Required<Configuration>;

export class Config extends ChainedMap<void> {
  entryPoints: TypedChainedMap<Config, Record<string, EntryPoint>>;
  output: Output;
  module: Module;
  optimization: Optimization;
  performance: Performance & ((value: boolean) => this);
  plugins: Plugins<this, WebpackPluginInstance>;
  resolve: Resolve;
  resolveLoader: ResolveLoader;
  devServer: DevServer;

  entry(name: string): EntryPoint;
  plugin(name: string): Plugin<this, WebpackPluginInstance>;

  context(value: WebpackConfig["context"]): this;
  mode(value: WebpackConfig["mode"]): this;
  cache(value: WebpackConfig["cache"]): this;
  devtool(value: WebpackConfig["devtool"]): this;
  target(value: WebpackConfig["target"]): this;
  watch(value: WebpackConfig["watch"]): this;
  watchOptions(value: WebpackConfig["watchOptions"]): this;
  externals(value: WebpackConfig["externals"]): this;
  externalsType(value: WebpackConfig["externalsType"]): this;
  externalsPresets(value: WebpackConfig["externalsPresets"]): this;
  dotenv(value: WebpackConfig["dotenv"]): this;
  node(value: WebpackConfig["node"]): this;
  stats(value: WebpackConfig["stats"]): this;
  experiments(value: WebpackConfig["experiments"]): this;
  infrastructureLogging(value: WebpackConfig["infrastructureLogging"]): this;
  amd(value: WebpackConfig["amd"]): this;
  bail(value: WebpackConfig["bail"]): this;
  dependencies(value: WebpackConfig["dependencies"]): this;
  ignoreWarnings(value: WebpackConfig["ignoreWarnings"]): this;
  loader(value: WebpackConfig["loader"]): this;
  name(value: WebpackConfig["name"]): this;
  parallelism(value: WebpackConfig["parallelism"]): this;
  profile(value: WebpackConfig["profile"]): this;
  recordsInputPath(value: WebpackConfig["recordsInputPath"]): this;
  recordsOutputPath(value: WebpackConfig["recordsOutputPath"]): this;
  recordsPath(value: WebpackConfig["recordsPath"]): this;
  snapshot(value: WebpackConfig["snapshot"]): this;

  toConfig(): Configuration;
}

export class Plugins<Parent, PluginType extends WebpackPluginInstance> extends TypedChainedMap<
  Parent,
  Record<string, Plugin<Parent, PluginType>>
> {}
export class Plugin<Parent, PluginType extends WebpackPluginInstance | ResolvePlugin>
  extends ChainedMap<Parent>
  implements Orderable
{
  init<Plugin extends PluginType | PluginClass<PluginType>>(
    value: (
      plugin: Plugin,
      // oxlint-disable-next-line typescript/no-explicit-any
      args: Plugin extends PluginClass<PluginType> ? ConstructorParameters<Plugin> : any[],
    ) => PluginType,
  ): this;
  use<Plugin extends string | PluginType | PluginClass<PluginType>>(
    plugin: Plugin,
    // oxlint-disable-next-line typescript/no-explicit-any
    args?: Plugin extends PluginClass<PluginType> ? ConstructorParameters<Plugin> : any[],
  ): this;
  tap<Plugin extends PluginClass<PluginType>>(
    func: (args: ConstructorParameters<Plugin>) => ConstructorParameters<Plugin>,
  ): this;

  // Orderable
  before(name: string): this;
  after(name: string): this;
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
  rules: TypedChainedMap<this, Record<string, Rule>>;
  generator: ChainedMap<this>;
  parser: ChainedMap<this>;
  rule(name: string): Rule;
  noParse(value: WebpackModule["noParse"]): this;
  unsafeCache(value: WebpackModule["unsafeCache"]): this;
  exprContextCritical(value: WebpackModule["exprContextCritical"]): this;
  exprContextRecursive(value: WebpackModule["exprContextRecursive"]): this;
  exprContextRegExp(value: WebpackModule["exprContextRegExp"]): this;
  unknownContextCritical(value: WebpackModule["unknownContextCritical"]): this;
  unknownContextRecursive(value: WebpackModule["unknownContextRecursive"]): this;
  unknownContextRegExp(value: WebpackModule["unknownContextRegExp"]): this;
  unknownContextRequest(value: WebpackModule["unknownContextRequest"]): this;
  wrappedContextCritical(value: WebpackModule["wrappedContextCritical"]): this;
  wrappedContextRecursive(value: WebpackModule["wrappedContextRecursive"]): this;
  wrappedContextRegExp(value: WebpackModule["wrappedContextRegExp"]): this;
  strictExportPresence(value: WebpackModule["strictExportPresence"]): this;
}

type WebpackOutput = Required<NonNullable<Configuration["output"]>>;

export class Output extends ChainedMap<Config> {
  assetModuleFilename(value: WebpackOutput["assetModuleFilename"]): this;
  asyncChunks(value: WebpackOutput["asyncChunks"]): this;
  auxiliaryComment(value: WebpackOutput["auxiliaryComment"]): this;
  charset(value: WebpackOutput["charset"]): this;
  chunkFilename(value: WebpackOutput["chunkFilename"]): this;
  chunkFormat(value: WebpackOutput["chunkFormat"]): this;
  chunkLoadTimeout(value: WebpackOutput["chunkLoadTimeout"]): this;
  chunkLoadingGlobal(value: WebpackOutput["chunkLoadingGlobal"]): this;
  chunkLoading(value: WebpackOutput["chunkLoading"]): this;
  clean(value: WebpackOutput["clean"]): this;
  compareBeforeEmit(value: WebpackOutput["compareBeforeEmit"]): this;
  crossOriginLoading(value: WebpackOutput["crossOriginLoading"]): this;
  cssChunkFilename(value: WebpackOutput["cssChunkFilename"]): this;
  cssFilename(value: WebpackOutput["cssFilename"]): this;
  devtoolFallbackModuleFilenameTemplate(
    value: WebpackOutput["devtoolFallbackModuleFilenameTemplate"],
  ): this;
  devtoolModuleFilenameTemplate(value: WebpackOutput["devtoolModuleFilenameTemplate"]): this;
  devtoolNamespace(value: WebpackOutput["devtoolNamespace"]): this;
  enabledChunkLoadingTypes(value: WebpackOutput["enabledChunkLoadingTypes"]): this;
  enabledLibraryTypes(value: WebpackOutput["enabledLibraryTypes"]): this;
  enabledWasmLoadingTypes(value: WebpackOutput["enabledWasmLoadingTypes"]): this;
  environment(value: WebpackOutput["environment"]): this;
  filename(value: WebpackOutput["filename"]): this;
  globalObject(value: WebpackOutput["globalObject"]): this;
  hashDigest(value: WebpackOutput["hashDigest"]): this;
  hashDigestLength(value: WebpackOutput["hashDigestLength"]): this;
  hashFunction(value: WebpackOutput["hashFunction"]): this;
  hashSalt(value: WebpackOutput["hashSalt"]): this;
  hotUpdateChunkFilename(value: WebpackOutput["hotUpdateChunkFilename"]): this;
  hotUpdateGlobal(value: WebpackOutput["hotUpdateGlobal"]): this;
  hotUpdateMainFilename(value: WebpackOutput["hotUpdateMainFilename"]): this;
  iife(value: WebpackOutput["iife"]): this;
  ignoreBrowserWarnings(value: WebpackOutput["ignoreBrowserWarnings"]): this;
  importFunctionName(value: WebpackOutput["importFunctionName"]): this;
  importMetaName(value: WebpackOutput["importMetaName"]): this;
  library(value: WebpackOutput["library"]): this;
  libraryExport(value: WebpackOutput["libraryExport"]): this;
  libraryTarget(value: WebpackOutput["libraryTarget"]): this;
  module(value: WebpackOutput["module"]): this;
  path(value: WebpackOutput["path"]): this;
  pathinfo(value: WebpackOutput["pathinfo"]): this;
  publicPath(value: WebpackOutput["publicPath"]): this;
  scriptType(value: WebpackOutput["scriptType"]): this;
  sourceMapFilename(value: WebpackOutput["sourceMapFilename"]): this;
  sourcePrefix(value: WebpackOutput["sourcePrefix"]): this;
  strictModuleErrorHandling(value: WebpackOutput["strictModuleErrorHandling"]): this;
  strictModuleExceptionHandling(value: WebpackOutput["strictModuleExceptionHandling"]): this;
  trustedTypes(value: WebpackOutput["trustedTypes"]): this;
  umdNamedDefine(value: WebpackOutput["umdNamedDefine"]): this;
  uniqueName(value: WebpackOutput["uniqueName"]): this;
  wasmLoading(value: WebpackOutput["wasmLoading"]): this;
  webassemblyModuleFilename(value: WebpackOutput["webassemblyModuleFilename"]): this;
  workerChunkLoading(value: WebpackOutput["workerChunkLoading"]): this;
  workerPublicPath(value: WebpackOutput["workerPublicPath"]): this;
  workerWasmLoading(value: WebpackOutput["workerWasmLoading"]): this;
}

type DevServerOptions = DevServerConfiguration;

export class DevServerClient extends ChainedMap<DevServer> {
  logging(value: DevServerOptions["client"]["logging"]): this;
  overlay(value: DevServerOptions["client"]["overlay"]): this;
  progress(value: DevServerOptions["client"]["progress"]): this;
  reconnect(value: DevServerOptions["client"]["reconnect"]): this;
  webSocketURL(value: DevServerOptions["client"]["webSocketURL"]): this;
}

export class DevServer extends ChainedMap<Config> {
  allowedHosts: TypedChainedSet<this, string>;
  app(value: DevServerOptions["app"]): this;
  bonjour(value: DevServerOptions["bonjour"]): this;
  client: DevServerClient;
  compress(value: DevServerOptions["compress"]): this;
  devMiddleware(value: DevServerOptions["devMiddleware"]): this;
  headers(value: DevServerOptions["headers"]): this;
  historyApiFallback(value: DevServerOptions["historyApiFallback"]): this;
  host(value: DevServerOptions["host"]): this;
  hot(value: DevServerOptions["hot"]): this;
  ipc(value: DevServerOptions["ipc"]): this;
  liveReload(value: DevServerOptions["liveReload"]): this;
  onListening(value: DevServerOptions["onListening"]): this;
  open(value: DevServerOptions["open"]): this;
  port(value: DevServerOptions["port"]): this;
  proxy(value: DevServerOptions["proxy"]): this;
  server(value: DevServerOptions["server"]): this;
  setupExitSignals(value: DevServerOptions["setupExitSignals"]): this;
  setupMiddlewares(value: DevServerOptions["setupMiddlewares"]): this;
  static(value: DevServerOptions["static"]): this;
  watchFiles(value: DevServerOptions["watchFiles"]): this;
  webSocketServer(value: DevServerOptions["webSocketServer"]): this;
}

type WebpackPerformance = Exclude<Required<NonNullable<Configuration["performance"]>>, false>;
export class Performance extends ChainedMap<Config> {
  hints(value: WebpackPerformance["hints"]): this;
  maxEntrypointSize(value: WebpackPerformance["maxEntrypointSize"]): this;
  maxAssetSize(value: WebpackPerformance["maxAssetSize"]): this;
  assetFilter(value: WebpackPerformance["assetFilter"]): this;
}

type WebpackResolve = Required<NonNullable<Configuration["resolve"]>>;
type ResolvePlugin = Exclude<NonNullable<ResolveOptions["plugins"]>[number], "...">;

export class Resolve<T = Config> extends ChainedMap<T> {
  alias: TypedChainedMap<this, Record<string, string | false | string[]>>;
  aliasFields: TypedChainedSet<this, WebpackResolve["aliasFields"][number]>;
  byDependency: TypedChainedMap<this, WebpackResolve["byDependency"]>;
  conditionNames: TypedChainedSet<this, WebpackResolve["conditionNames"][number]>;
  descriptionFiles: TypedChainedSet<this, WebpackResolve["descriptionFiles"][number]>;
  exportsFields: TypedChainedSet<this, WebpackResolve["exportsFields"][number]>;
  extensionAlias: TypedChainedMap<this, WebpackResolve["extensionAlias"]>;
  extensions: TypedChainedSet<this, WebpackResolve["extensions"][number]>;
  fallback: TypedChainedMap<this, Record<string, string | false | string[]>>;
  importsFields: TypedChainedSet<this, WebpackResolve["importsFields"][number]>;
  mainFields: TypedChainedSet<this, WebpackResolve["mainFields"][number]>;
  mainFiles: TypedChainedSet<this, WebpackResolve["mainFiles"][number]>;
  modules: TypedChainedSet<this, WebpackResolve["modules"][number]>;
  plugins: TypedChainedMap<this, Record<string, Plugin<Resolve, ResolvePlugin>>>;
  restrictions: TypedChainedSet<this, WebpackResolve["restrictions"][number]>;
  roots: TypedChainedSet<this, WebpackResolve["roots"][number]>;

  plugin(name: string): Plugin<this, ResolvePlugin>;

  cache(value: WebpackResolve["cache"]): this;
  cachePredicate(value: WebpackResolve["cachePredicate"]): this;
  cacheWithContext(value: WebpackResolve["cacheWithContext"]): this;
  enforceExtension(value: WebpackResolve["enforceExtension"]): this;
  fullySpecified(value: WebpackResolve["fullySpecified"]): this;
  preferAbsolute(value: WebpackResolve["preferAbsolute"]): this;
  preferRelative(value: WebpackResolve["preferRelative"]): this;
  symlinks(value: WebpackResolve["symlinks"]): this;
  unsafeCache(value: WebpackResolve["unsafeCache"]): this;
  useSyncFileSystemCalls(value: WebpackResolve["useSyncFileSystemCalls"]): this;
}

export class RuleResolve<T = Config> extends Resolve<T> {
  fullySpecified(value: boolean): this;
}

export class ResolveLoader extends Resolve {
  modules: ChainedSet<this>;
  moduleExtensions: ChainedSet<this>;
  packageMains: ChainedSet<this>;
}

type WebpackRuleSet = Required<RuleSetRule>;

export class Rule<T = Module> extends ChainedMap<T> implements Orderable {
  uses: TypedChainedMap<this, Record<string, Use>>;
  include: TypedChainedSet<this, WebpackRuleSet["include"]>;
  exclude: TypedChainedSet<this, WebpackRuleSet["exclude"]>;
  rules: TypedChainedMap<this, Record<string, Rule<Rule>>>;
  oneOfs: TypedChainedMap<this, Record<string, Rule<Rule>>>;
  resolve: RuleResolve<Rule<T>>;

  assert(value: WebpackRuleSet["assert"]): this;
  compiler(value: WebpackRuleSet["compiler"]): this;
  enforce(value: WebpackRuleSet["enforce"]): this;
  issuer(value: WebpackRuleSet["issuer"]): this;
  issuerLayer(value: WebpackRuleSet["issuerLayer"]): this;
  layer(value: WebpackRuleSet["layer"]): this;
  extractSourceMap(value: WebpackRuleSet["extractSourceMap"]): this;
  mimetype(value: WebpackRuleSet["mimetype"]): this;
  parser(value: WebpackRuleSet["parser"]): this;
  generator(value: WebpackRuleSet["generator"]): this;
  resource(value: WebpackRuleSet["resource"]): this;
  resourceQuery(value: WebpackRuleSet["resourceQuery"]): this;
  scheme(value: WebpackRuleSet["scheme"]): this;
  sideEffects(value: WebpackRuleSet["sideEffects"]): this;
  test(value: WebpackRuleSet["test"]): this;
  type(value: WebpackRuleSet["type"]): this;
  with(value: WebpackRuleSet["with"]): this;

  use(name: string): Use<this>;
  rule(name: string): Rule<Rule>;
  oneOf(name: string): Rule<Rule>;
  pre(): this;
  post(): this;
  before(name: string): this;
  after(name: string): this;
}

type WebpackOptimization = Required<NonNullable<Configuration["optimization"]>>;
type SplitChunksObject = Exclude<WebpackOptimization["splitChunks"], false>;
export class Optimization extends ChainedMap<Config> {
  checkWasmTypes(value: WebpackOptimization["checkWasmTypes"]): this;
  chunkIds(value: WebpackOptimization["chunkIds"]): this;
  concatenateModules(value: WebpackOptimization["concatenateModules"]): this;
  emitOnErrors(value: WebpackOptimization["emitOnErrors"]): this;
  avoidEntryIife(value: WebpackOptimization["avoidEntryIife"]): this;
  flagIncludedChunks(value: WebpackOptimization["flagIncludedChunks"]): this;
  innerGraph(value: WebpackOptimization["innerGraph"]): this;
  mangleExports(value: WebpackOptimization["mangleExports"]): this;
  mangleWasmImports(value: WebpackOptimization["mangleWasmImports"]): this;
  mergeDuplicateChunks(value: WebpackOptimization["mergeDuplicateChunks"]): this;
  minimize(value: WebpackOptimization["minimize"]): this;
  minimizer(name: string): Plugin<this, WebpackPluginInstance>;
  moduleIds(value: WebpackOptimization["moduleIds"]): this;
  nodeEnv(value: WebpackOptimization["nodeEnv"]): this;
  portableRecords(value: WebpackOptimization["portableRecords"]): this;
  providedExports(value: WebpackOptimization["providedExports"]): this;
  realContentHash(value: WebpackOptimization["realContentHash"]): this;
  removeAvailableModules(value: WebpackOptimization["removeAvailableModules"]): this;
  removeEmptyChunks(value: WebpackOptimization["removeEmptyChunks"]): this;
  runtimeChunk(value: WebpackOptimization["runtimeChunk"]): this;
  sideEffects(value: WebpackOptimization["sideEffects"]): this;
  splitChunks: TypedChainedMap<this, SplitChunksObject> &
    ((value: SplitChunksObject | false) => this);
  usedExports(value: WebpackOptimization["usedExports"]): this;
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
  loader(value: string): this;
  options(value: LoaderOptions): this;

  tap(func: (options: LoaderOptions) => LoaderOptions): this;

  // Orderable
  before(name: string): this;
  after(name: string): this;
}

export type PluginClass<PluginType extends WebpackPluginInstance | ResolvePlugin> = new (
  // oxlint-disable-next-line typescript/no-explicit-any
  ...opts: any[]
) => PluginType;
