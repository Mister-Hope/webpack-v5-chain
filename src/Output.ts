import type { Configuration } from "webpack";

import type { Config } from "./Config.js";
import { ChainedMap } from "./utils/index.js";

type WebpackOutput = Required<NonNullable<Configuration["output"]>>;

export class Output extends ChainedMap<Config> {
  constructor(parent?: Config) {
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

  declare assetModuleFilename: (value: WebpackOutput["assetModuleFilename"]) => this;
  declare asyncChunks: (value: WebpackOutput["asyncChunks"]) => this;
  declare auxiliaryComment: (value: WebpackOutput["auxiliaryComment"]) => this;
  declare charset: (value: WebpackOutput["charset"]) => this;
  declare chunkFilename: (value: WebpackOutput["chunkFilename"]) => this;
  declare chunkFormat: (value: WebpackOutput["chunkFormat"]) => this;
  declare chunkLoadTimeout: (value: WebpackOutput["chunkLoadTimeout"]) => this;
  declare chunkLoadingGlobal: (value: WebpackOutput["chunkLoadingGlobal"]) => this;
  declare chunkLoading: (value: WebpackOutput["chunkLoading"]) => this;
  declare clean: (value: WebpackOutput["clean"]) => this;
  declare compareBeforeEmit: (value: WebpackOutput["compareBeforeEmit"]) => this;
  declare crossOriginLoading: (value: WebpackOutput["crossOriginLoading"]) => this;
  declare cssChunkFilename: (value: WebpackOutput["cssChunkFilename"]) => this;
  declare cssFilename: (value: WebpackOutput["cssFilename"]) => this;
  declare devtoolFallbackModuleFilenameTemplate: (
    value: WebpackOutput["devtoolFallbackModuleFilenameTemplate"],
  ) => this;
  declare devtoolModuleFilenameTemplate: (
    value: WebpackOutput["devtoolModuleFilenameTemplate"],
  ) => this;
  declare devtoolNamespace: (value: WebpackOutput["devtoolNamespace"]) => this;
  declare enabledChunkLoadingTypes: (value: WebpackOutput["enabledChunkLoadingTypes"]) => this;
  declare enabledLibraryTypes: (value: WebpackOutput["enabledLibraryTypes"]) => this;
  declare enabledWasmLoadingTypes: (value: WebpackOutput["enabledWasmLoadingTypes"]) => this;
  declare environment: (value: WebpackOutput["environment"]) => this;
  declare filename: (value: WebpackOutput["filename"]) => this;
  declare globalObject: (value: WebpackOutput["globalObject"]) => this;
  declare hashDigest: (value: WebpackOutput["hashDigest"]) => this;
  declare hashDigestLength: (value: WebpackOutput["hashDigestLength"]) => this;
  declare hashFunction: (value: WebpackOutput["hashFunction"]) => this;
  declare hashSalt: (value: WebpackOutput["hashSalt"]) => this;
  declare hotUpdateChunkFilename: (value: WebpackOutput["hotUpdateChunkFilename"]) => this;
  declare hotUpdateGlobal: (value: WebpackOutput["hotUpdateGlobal"]) => this;
  declare hotUpdateMainFilename: (value: WebpackOutput["hotUpdateMainFilename"]) => this;
  declare iife: (value: WebpackOutput["iife"]) => this;
  declare ignoreBrowserWarnings: (value: WebpackOutput["ignoreBrowserWarnings"]) => this;
  declare importFunctionName: (value: WebpackOutput["importFunctionName"]) => this;
  declare importMetaName: (value: WebpackOutput["importMetaName"]) => this;
  declare library: (value: WebpackOutput["library"]) => this;
  declare libraryExport: (value: WebpackOutput["libraryExport"]) => this;
  declare libraryTarget: (value: WebpackOutput["libraryTarget"]) => this;
  declare module: (value: WebpackOutput["module"]) => this;
  declare path: (value: WebpackOutput["path"]) => this;
  declare pathinfo: (value: WebpackOutput["pathinfo"]) => this;
  declare publicPath: (value: WebpackOutput["publicPath"]) => this;
  declare scriptType: (value: WebpackOutput["scriptType"]) => this;
  declare sourceMapFilename: (value: WebpackOutput["sourceMapFilename"]) => this;
  declare sourcePrefix: (value: WebpackOutput["sourcePrefix"]) => this;
  declare strictModuleErrorHandling: (value: WebpackOutput["strictModuleErrorHandling"]) => this;
  declare strictModuleExceptionHandling: (
    value: WebpackOutput["strictModuleExceptionHandling"],
  ) => this;
  declare trustedTypes: (value: WebpackOutput["trustedTypes"]) => this;
  declare umdNamedDefine: (value: WebpackOutput["umdNamedDefine"]) => this;
  declare uniqueName: (value: WebpackOutput["uniqueName"]) => this;
  declare wasmLoading: (value: WebpackOutput["wasmLoading"]) => this;
  declare webassemblyModuleFilename: (value: WebpackOutput["webassemblyModuleFilename"]) => this;
  declare workerChunkLoading: (value: WebpackOutput["workerChunkLoading"]) => this;
  declare workerPublicPath: (value: WebpackOutput["workerPublicPath"]) => this;
  declare workerWasmLoading: (value: WebpackOutput["workerWasmLoading"]) => this;
}
