// oxlint-disable no-unused-expressions
import type { Resolver } from "enhanced-resolve";
import { expectTypeOf } from "vitest";
import { DefinePlugin } from "webpack";
import type { Compiler } from "webpack";

import { Config, EntryPoint } from "../types/index.js";

class ResolvePluginImpl {
  // oxlint-disable-next-line class-methods-use-this
  apply(resolver: Resolver): void {
    resolver;
  }
}

const config = new Config();

config
  // entry
  .entry("main")
  .add("index.js")
  .add(["index.js", "xxx.js"])
  .add({
    import: "./personal.js",
    filename: "pages/personal.js",
    dependOn: "shared",
    chunkLoading: "jsonp",
    layer: "name of layer",
  })
  .delete("index.js")
  .clear()
  .when(
    false,
    (entry) => entry.clear(),
    (entry) => entry.clear(),
  )
  .batch((item) => {
    item;
  })
  .end();

// entryPoints
config.entryPoints
  .delete("main")
  .end()
  // output
  .output.assetModuleFilename("[hash][ext][query]")
  .assetModuleFilename(
    (path, assetInfo) => (path.filename ?? "") + (assetInfo?.sourceFilename ?? ""),
  )
  .asyncChunks(false)
  .auxiliaryComment("Test Comment")
  .auxiliaryComment({
    root: "Root Comment",
    commonjs: "CommonJS Comment",
    commonjs2: "CommonJS2 Comment",
    amd: "AMD Comment",
  })
  .charset(true)
  .chunkFilename("test")
  .chunkFilename((path, assetInfo) => (path.filename ?? "") + (assetInfo?.sourceFilename ?? ""))
  .chunkFormat(false)
  .chunkFormat("module")
  .chunkLoadTimeout(1000)
  .chunkLoadingGlobal("test")
  .chunkLoading(false)
  .chunkLoading("jsonp")
  .clean(true)
  .clean({ dry: true })
  .clean({
    keep: (asset) => asset.includes("ignored/dir"),
  })
  .compareBeforeEmit(true)
  .crossOriginLoading(false)
  .crossOriginLoading("anonymous")
  .cssChunkFilename("test")
  .cssChunkFilename((path, assetInfo) => (path.filename ?? "") + (assetInfo?.sourceFilename ?? ""))
  .cssFilename("test")
  .cssFilename((path, assetInfo) => (path.filename ?? "") + (assetInfo?.sourceFilename ?? ""))
  .devtoolFallbackModuleFilenameTemplate("test")
  .devtoolModuleFilenameTemplate("")
  .devtoolNamespace("")
  .enabledChunkLoadingTypes(["jsonp", "require"])
  .enabledLibraryTypes(["test"])
  .enabledWasmLoadingTypes(["test"])
  .environment({})
  .filename("main.js")
  .globalObject("global")
  .hashFunction("md5")
  .hashDigest("hex")
  .hashDigestLength(15)
  .hashSalt("")
  .hotUpdateChunkFilename("update")
  .hotUpdateGlobal("web")
  .hotUpdateMainFilename("main")
  .iife(true)
  .ignoreBrowserWarnings(true)
  .importFunctionName("import")
  .importMetaName("import")
  .library("var")
  .libraryExport(["MyModule", "MySubModule"])
  .libraryTarget("var")
  .module(true)
  .path("/")
  .pathinfo(true)
  .publicPath("/")
  .scriptType("module")
  .sourceMapFilename("index.js.map")
  .sourcePrefix("~")
  .strictModuleErrorHandling(true)
  .strictModuleExceptionHandling(true)
  .trustedTypes(true)
  .trustedTypes({
    policyName: "my-application#webpack",
  })
  .umdNamedDefine(true)
  .wasmLoading("fetch")
  .webassemblyModuleFilename("[hash].module.wasm")
  .workerChunkLoading("import")
  .workerPublicPath("/")
  .workerWasmLoading("import")
  .end();

// module
config.module
  .noParse(/.min.js$/)
  .strictExportPresence(true)
  .exprContextCritical(true)
  .exprContextRecursive(true)
  .exprContextRegExp(/.*/)
  .unknownContextCritical(true)
  .unknownContextRecursive(true)
  .unknownContextRegExp(/.*/)
  .unknownContextRequest("")
  .wrappedContextCritical(true)
  .wrappedContextRecursive(true)
  .wrappedContextRegExp(/.*/)
  .strictExportPresence(true)
  .generator.set("asset", {
    publicPath: "assets/",
  })
  .end()
  // module rule
  .rule("compile")
  .test(/.js$/)
  .include.add(/.js$/)
  .end()
  .exclude.add(/node_modules/)
  .end()
  .parser({
    opt: "foo",
  })
  .enforce("pre")
  .issuerLayer("asd")
  .sideEffects(true)
  .mimetype("application/json")
  .generator({
    asset: {
      publicPath: "assets/",
    },
  })
  .use("babel")
  .tap((config) => [config])
  .loader("babel-loader")
  .options({})
  .end()
  .use("eslint")
  .loader("eslint-loader")
  .options({})
  .after("babel")
  .end()
  .uses.delete("babel")
  .delete("eslint")
  .end()
  .pre()
  .post()
  .rule("inline")
  .after("vue")
  .resourceQuery(/inline/)
  .use("url")
  .loader("url-loader")
  .end()
  .resolve.symlinks(true)
  .fullySpecified(false)
  .end()
  .end()
  .rules.delete("inline")
  .end()
  .oneOf("inline")
  .after("vue")
  .uses.delete("babel")
  .end()
  .resourceQuery(/inline/)
  .use("url")
  .loader("url-loader")
  .end()
  .end()
  .oneOfs.delete("inline")
  .end()
  .resolve.symlinks(true)
  .end()
  .end()
  .rules.delete("compile")
  .end()
  //** support https://webpack.js.org/configuration/module/#ruletype  */
  .rule("mjs-compile")
  .test(/\.mjs$/)
  .type("javascript/auto")
  .end()
  .end();

// resolve
config.resolve.alias
  .set("foo", "bar")
  .set("foo", false)
  .set("foo", ["asd"])
  .end()
  .modules.add("index.js")
  .end()
  .aliasFields.add("foo")
  .add(["foo"])
  .end()
  .aliasFields.add("foo")
  .add(["foo"])
  .end()
  .byDependency.set("esm", {
    mainFields: ["browser", "module"],
  })
  .end()
  .conditionNames.prepend("test1")
  .add("test2")
  .end()
  .descriptionFiles.add("foo")
  .end()
  .exportsFields.add(".js")
  .end()
  .extensionAlias.set(".js", [".ts", ".js"])
  .end()
  .extensions.add(".js")
  .end()
  .fallback.set("asd", ["test"])
  .end()
  .importsFields.add("browser")
  .end()
  .mainFields.add("browser")
  .end()
  .mainFiles.add("index.js")
  .end()
  .restrictions.add("index.js")
  .end()
  .modules.add("index.js")
  .end()
  .roots.add("test")
  .end()
  .cache(true)
  .cachePredicate(({ path, request }) => {
    path;
    request;

    return true;
  })
  .cacheWithContext(true)
  .enforceExtension(true)
  .fullySpecified(true)
  .preferAbsolute(true)
  .preferRelative(true)
  .symlinks(true)
  .unsafeCache(false)
  .unsafeCache(/foo/)
  .useSyncFileSystemCalls(true)
  .plugin("foo")
  .use(ResolvePluginImpl, [])
  .end()
  .plugins.delete("foo")
  .end()
  .end();

// resolveLoader
config.resolveLoader.moduleExtensions
  .add(".js")
  .end()
  .packageMains.add("index.js")
  .end()
  .modules.add("index.js")
  .end()
  .preferAbsolute(false)
  .plugin("foo")
  .use(DefinePlugin)
  .end()
  .end();

// optimization
config.optimization
  .checkWasmTypes(true)
  .chunkIds(false)
  .chunkIds("named")
  .concatenateModules(true)
  .emitOnErrors(true)
  .avoidEntryIife(true)
  .flagIncludedChunks(true)
  .innerGraph(true)
  .mangleExports(true)
  .mangleExports("deterministic")
  .mangleWasmImports(true)
  .mergeDuplicateChunks(true)
  .minimize(true)
  .moduleIds(false)
  .moduleIds("named")
  .nodeEnv(false)
  .portableRecords(true)
  .providedExports(true)
  .realContentHash(true)
  .removeAvailableModules(true)
  .removeEmptyChunks(true)
  .runtimeChunk("single")
  .runtimeChunk({ name: () => "hello" })
  .sideEffects(true)
  .sideEffects("flag")
  .usedExports(true)
  .usedExports("global")
  .splitChunks(false)
  .splitChunks.set("chunks", "all")
  .set("chunks", "all")
  .end()
  .minimizer("foo")
  .use(DefinePlugin)
  .tap((config) => [config])
  .end()
  .end();

// plugins
config
  .plugin("foo")
  .use(DefinePlugin, [
    {
      "process.env.NODE_ENV": "",
    },
  ])
  .end()

  .plugin("bar")
  .use(DefinePlugin, [
    {
      "process.env.NODE_ENV": "",
    },
  ])
  .before("foo")
  .end()

  .plugin("baz")
  .use(DefinePlugin, [
    {
      "process.env.NODE_ENV": "",
    },
  ])
  .after("bar")
  .end()

  .plugin("asString")
  .use("package-name-or-path")
  .end()

  .plugin("asObject")
  .use({
    apply: (compiler: Compiler) => {
      compiler;
    },
  })
  .end()

  .plugins.delete("foo")
  .delete("bar")
  .delete("baz")
  .delete("asString")
  .delete("asObject")
  .end();

// devServer
config.devServer.allowedHosts
  .add("host.com")
  .clear()
  .end()

  // oxlint-disable-next-line typescript/no-explicit-any, typescript/no-unsafe-return, typescript/no-unsafe-type-assertion
  .app(() => ({}) as any)
  .bonjour(true)
  .client.logging("info")
  .end()
  .compress(false)
  .devMiddleware({
    index: true,
    mimeTypes: { phtml: "text/html" },
    publicPath: "/publicPathForDevServe",
    serverSideRender: true,
    writeToDisk: true,
  })
  .headers({
    "Content-Type": "text/css",
  })
  .historyApiFallback(true)
  .host("localhost")
  .hot(true)
  .ipc(true)
  .liveReload(true)
  .onListening((devServer) => {
    if (!devServer.server) {
      throw new Error("webpack-dev-server is not defined");
    }
  })
  .open(true)
  .port(8080)
  .proxy([
    {
      context: ["/api"],
      target: "http://localhost:3000",
    },
  ])
  .server("http")
  .setupExitSignals(true)
  .setupMiddlewares((middlewares) => middlewares)
  .static(true)
  .watchFiles(["src/**/*.php", "public/**/*"])
  .webSocketServer("ws")
  .end();

// performance
config
  .performance(false)
  .performance.hints(false)
  .hints("warning")
  .maxEntrypointSize(20000)
  .maxAssetSize(20000)
  .assetFilter((filename: string) => {
    // oxlint-disable-next-line no-unused-expressions
    filename;

    return true;
  })
  .end()
  // node
  .node(false)
  .node({ __dirname: true })
  .amd({ foo: true })
  .bail(true)
  .cache(false)
  .cache({
    type: "filesystem",
  })
  .devtool("hidden-source-map")
  .devtool(false)
  .context("")
  .externals("foo")
  .externals(/node_modules/)
  .externals({ test: false, foo: "bar" })
  .externals(["foo", "bar"])
  .externals((ctx, cb: (err0: Error | undefined, result: string) => void) => {
    cb(undefined, "foo");
  })
  .loader({})
  .name("config-name")
  .mode("none")
  .mode("development")
  .mode("production")
  .profile(false)
  .parallelism(2)
  .recordsPath("")
  .recordsInputPath("")
  .recordsOutputPath("")
  .stats({
    assets: false,
    publicPath: true,
    modules: false,
  })
  .target("web")
  .watch(true)
  .watchOptions({})
  .when(
    false,
    (config) => config.watch(true),
    (config) => config.watch(false),
  )
  // end
  .merge({})
  .toConfig();

// Test TypedChainedMap
const { entryPoints } = config;

expectTypeOf(entryPoints).toEqualTypeOf<Config["entryPoints"]>();
expectTypeOf(entryPoints.clear()).toEqualTypeOf<Config["entryPoints"]>();
expectTypeOf(entryPoints.delete("key")).toEqualTypeOf<Config["entryPoints"]>();
expectTypeOf(entryPoints.has("key")).toEqualTypeOf<boolean>();
expectTypeOf(entryPoints.get("key")).toEqualTypeOf<EntryPoint>();
expectTypeOf(entryPoints.getOrCompute("key", () => new EntryPoint())).toEqualTypeOf<EntryPoint>();
expectTypeOf(entryPoints.set("key", new EntryPoint())).toEqualTypeOf<Config["entryPoints"]>();
expectTypeOf(
  entryPoints.merge({
    key: new EntryPoint(),
  }),
).toEqualTypeOf<Config["entryPoints"]>();
expectTypeOf(entryPoints.entries()).toEqualTypeOf<Record<string, EntryPoint>>();
expectTypeOf(
  entryPoints.when(
    true,
    (val) => {
      expectTypeOf(val).toEqualTypeOf<Config["entryPoints"]>();
    },
    (val) => {
      expectTypeOf(val).toEqualTypeOf<Config["entryPoints"]>();
    },
  ),
).toEqualTypeOf<Config["entryPoints"]>();

// Test TypedChainedSet
const { extensions } = config.resolve;

expectTypeOf(extensions).toEqualTypeOf<Config["resolve"]["extensions"]>();
expectTypeOf(extensions.add(".txt")).toEqualTypeOf<Config["resolve"]["extensions"]>();
expectTypeOf(extensions.prepend(".txt")).toEqualTypeOf<Config["resolve"]["extensions"]>();
expectTypeOf(extensions.clear()).toEqualTypeOf<Config["resolve"]["extensions"]>();
expectTypeOf(extensions.delete(".txt")).toEqualTypeOf<Config["resolve"]["extensions"]>();
expectTypeOf(extensions.has(".txt")).toEqualTypeOf<boolean>();
expectTypeOf(extensions.merge([".txt"])).toEqualTypeOf<Config["resolve"]["extensions"]>();
expectTypeOf(extensions.values()).toEqualTypeOf<string[]>();
expectTypeOf(
  extensions.when(
    true,
    (val) => {
      expectTypeOf(val).toEqualTypeOf<Config["resolve"]["extensions"]>();
    },
    (val) => {
      expectTypeOf(val).toEqualTypeOf<Config["resolve"]["extensions"]>();
    },
  ),
).toEqualTypeOf<Config["resolve"]["extensions"]>();
