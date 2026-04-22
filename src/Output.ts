import type { Configuration } from "webpack";

import type { Config } from "./Config.js";
import { ChainedMap } from "./utils/index.js";

type WebpackOutput = Required<NonNullable<Configuration["output"]>>;

export class Output extends ChainedMap<Config> {
  public constructor(parent?: Config) {
    super(parent);
    this.extend([
      "assetModuleFilename",
      "asyncChunks",
      "auxiliaryComment",
      "charset",
      "chunkFilename",
      "chunkFormat",
      "chunkLoadTimeout",
      "chunkLoadingGlobal",
      "chunkLoading",
      "clean",
      "compareBeforeEmit",
      "crossOriginLoading",
      "cssChunkFilename",
      "cssFilename",
      "devtoolFallbackModuleFilenameTemplate",
      "devtoolModuleFilenameTemplate",
      "devtoolNamespace",
      "enabledChunkLoadingTypes",
      "enabledLibraryTypes",
      "enabledWasmLoadingTypes",
      "environment",
      "filename",
      "globalObject",
      "hashDigest",
      "hashDigestLength",
      "hashFunction",
      "hashSalt",
      "hotUpdateChunkFilename",
      "hotUpdateGlobal",
      "hotUpdateMainFilename",
      "iife",
      "ignoreBrowserWarnings",
      "importFunctionName",
      "importMetaName",
      "library",
      "libraryExport",
      "libraryTarget",
      "module",
      "path",
      "pathinfo",
      "publicPath",
      "scriptType",
      "sourceMapFilename",
      "sourcePrefix",
      "strictModuleErrorHandling",
      "strictModuleExceptionHandling",
      "trustedTypes",
      "umdNamedDefine",
      "uniqueName",
      "wasmLoading",
      "webassemblyModuleFilename",
      "workerChunkLoading",
      "workerPublicPath",
      "workerWasmLoading",
    ]);
  }

  declare public assetModuleFilename: (value: WebpackOutput["assetModuleFilename"]) => this;
  declare public asyncChunks: (value: WebpackOutput["asyncChunks"]) => this;
  declare public auxiliaryComment: (value: WebpackOutput["auxiliaryComment"]) => this;
  declare public charset: (value: WebpackOutput["charset"]) => this;
  declare public chunkFilename: (value: WebpackOutput["chunkFilename"]) => this;
  declare public chunkFormat: (value: WebpackOutput["chunkFormat"]) => this;
  declare public chunkLoadTimeout: (value: WebpackOutput["chunkLoadTimeout"]) => this;
  declare public chunkLoadingGlobal: (value: WebpackOutput["chunkLoadingGlobal"]) => this;
  declare public chunkLoading: (value: WebpackOutput["chunkLoading"]) => this;
  declare public clean: (value: WebpackOutput["clean"]) => this;
  declare public compareBeforeEmit: (value: WebpackOutput["compareBeforeEmit"]) => this;
  declare public crossOriginLoading: (value: WebpackOutput["crossOriginLoading"]) => this;
  declare public cssChunkFilename: (value: WebpackOutput["cssChunkFilename"]) => this;
  declare public cssFilename: (value: WebpackOutput["cssFilename"]) => this;
  declare public devtoolFallbackModuleFilenameTemplate: (
    value: WebpackOutput["devtoolFallbackModuleFilenameTemplate"],
  ) => this;
  declare public devtoolModuleFilenameTemplate: (
    value: WebpackOutput["devtoolModuleFilenameTemplate"],
  ) => this;
  declare public devtoolNamespace: (value: WebpackOutput["devtoolNamespace"]) => this;
  declare public enabledChunkLoadingTypes: (
    value: WebpackOutput["enabledChunkLoadingTypes"],
  ) => this;
  declare public enabledLibraryTypes: (value: WebpackOutput["enabledLibraryTypes"]) => this;
  declare public enabledWasmLoadingTypes: (value: WebpackOutput["enabledWasmLoadingTypes"]) => this;
  declare public environment: (value: WebpackOutput["environment"]) => this;
  declare public filename: (value: WebpackOutput["filename"]) => this;
  declare public globalObject: (value: WebpackOutput["globalObject"]) => this;
  declare public hashDigest: (value: WebpackOutput["hashDigest"]) => this;
  declare public hashDigestLength: (value: WebpackOutput["hashDigestLength"]) => this;
  declare public hashFunction: (value: WebpackOutput["hashFunction"]) => this;
  declare public hashSalt: (value: WebpackOutput["hashSalt"]) => this;
  declare public hotUpdateChunkFilename: (value: WebpackOutput["hotUpdateChunkFilename"]) => this;
  declare public hotUpdateGlobal: (value: WebpackOutput["hotUpdateGlobal"]) => this;
  declare public hotUpdateMainFilename: (value: WebpackOutput["hotUpdateMainFilename"]) => this;
  declare public iife: (value: WebpackOutput["iife"]) => this;
  declare public ignoreBrowserWarnings: (value: WebpackOutput["ignoreBrowserWarnings"]) => this;
  declare public importFunctionName: (value: WebpackOutput["importFunctionName"]) => this;
  declare public importMetaName: (value: WebpackOutput["importMetaName"]) => this;
  declare public library: (value: WebpackOutput["library"]) => this;
  declare public libraryExport: (value: WebpackOutput["libraryExport"]) => this;
  declare public libraryTarget: (value: WebpackOutput["libraryTarget"]) => this;
  declare public module: (value: WebpackOutput["module"]) => this;
  declare public path: (value: WebpackOutput["path"]) => this;
  declare public pathinfo: (value: WebpackOutput["pathinfo"]) => this;
  declare public publicPath: (value: WebpackOutput["publicPath"]) => this;
  declare public scriptType: (value: WebpackOutput["scriptType"]) => this;
  declare public sourceMapFilename: (value: WebpackOutput["sourceMapFilename"]) => this;
  declare public sourcePrefix: (value: WebpackOutput["sourcePrefix"]) => this;
  declare public strictModuleErrorHandling: (
    value: WebpackOutput["strictModuleErrorHandling"],
  ) => this;
  declare public strictModuleExceptionHandling: (
    value: WebpackOutput["strictModuleExceptionHandling"],
  ) => this;
  declare public trustedTypes: (value: WebpackOutput["trustedTypes"]) => this;
  declare public umdNamedDefine: (value: WebpackOutput["umdNamedDefine"]) => this;
  declare public uniqueName: (value: WebpackOutput["uniqueName"]) => this;
  declare public wasmLoading: (value: WebpackOutput["wasmLoading"]) => this;
  declare public webassemblyModuleFilename: (
    value: WebpackOutput["webassemblyModuleFilename"],
  ) => this;
  declare public workerChunkLoading: (value: WebpackOutput["workerChunkLoading"]) => this;
  declare public workerPublicPath: (value: WebpackOutput["workerPublicPath"]) => this;
  declare public workerWasmLoading: (value: WebpackOutput["workerWasmLoading"]) => this;
}
