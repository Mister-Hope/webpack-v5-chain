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

  public declare assetModuleFilename: (value: WebpackOutput["assetModuleFilename"]) => this;
  public declare asyncChunks: (value: WebpackOutput["asyncChunks"]) => this;
  public declare auxiliaryComment: (value: WebpackOutput["auxiliaryComment"]) => this;
  public declare charset: (value: WebpackOutput["charset"]) => this;
  public declare chunkFilename: (value: WebpackOutput["chunkFilename"]) => this;
  public declare chunkFormat: (value: WebpackOutput["chunkFormat"]) => this;
  public declare chunkLoadTimeout: (value: WebpackOutput["chunkLoadTimeout"]) => this;
  public declare chunkLoadingGlobal: (value: WebpackOutput["chunkLoadingGlobal"]) => this;
  public declare chunkLoading: (value: WebpackOutput["chunkLoading"]) => this;
  public declare clean: (value: WebpackOutput["clean"]) => this;
  public declare compareBeforeEmit: (value: WebpackOutput["compareBeforeEmit"]) => this;
  public declare crossOriginLoading: (value: WebpackOutput["crossOriginLoading"]) => this;
  public declare cssChunkFilename: (value: WebpackOutput["cssChunkFilename"]) => this;
  public declare cssFilename: (value: WebpackOutput["cssFilename"]) => this;
  public declare devtoolFallbackModuleFilenameTemplate: (
    value: WebpackOutput["devtoolFallbackModuleFilenameTemplate"],
  ) => this;
  public declare devtoolModuleFilenameTemplate: (
    value: WebpackOutput["devtoolModuleFilenameTemplate"],
  ) => this;
  public declare devtoolNamespace: (value: WebpackOutput["devtoolNamespace"]) => this;
  public declare enabledChunkLoadingTypes: (value: WebpackOutput["enabledChunkLoadingTypes"]) => this;
  public declare enabledLibraryTypes: (value: WebpackOutput["enabledLibraryTypes"]) => this;
  public declare enabledWasmLoadingTypes: (value: WebpackOutput["enabledWasmLoadingTypes"]) => this;
  public declare environment: (value: WebpackOutput["environment"]) => this;
  public declare filename: (value: WebpackOutput["filename"]) => this;
  public declare globalObject: (value: WebpackOutput["globalObject"]) => this;
  public declare hashDigest: (value: WebpackOutput["hashDigest"]) => this;
  public declare hashDigestLength: (value: WebpackOutput["hashDigestLength"]) => this;
  public declare hashFunction: (value: WebpackOutput["hashFunction"]) => this;
  public declare hashSalt: (value: WebpackOutput["hashSalt"]) => this;
  public declare hotUpdateChunkFilename: (value: WebpackOutput["hotUpdateChunkFilename"]) => this;
  public declare hotUpdateGlobal: (value: WebpackOutput["hotUpdateGlobal"]) => this;
  public declare hotUpdateMainFilename: (value: WebpackOutput["hotUpdateMainFilename"]) => this;
  public declare iife: (value: WebpackOutput["iife"]) => this;
  public declare ignoreBrowserWarnings: (value: WebpackOutput["ignoreBrowserWarnings"]) => this;
  public declare importFunctionName: (value: WebpackOutput["importFunctionName"]) => this;
  public declare importMetaName: (value: WebpackOutput["importMetaName"]) => this;
  public declare library: (value: WebpackOutput["library"]) => this;
  public declare libraryExport: (value: WebpackOutput["libraryExport"]) => this;
  public declare libraryTarget: (value: WebpackOutput["libraryTarget"]) => this;
  public declare module: (value: WebpackOutput["module"]) => this;
  public declare path: (value: WebpackOutput["path"]) => this;
  public declare pathinfo: (value: WebpackOutput["pathinfo"]) => this;
  public declare publicPath: (value: WebpackOutput["publicPath"]) => this;
  public declare scriptType: (value: WebpackOutput["scriptType"]) => this;
  public declare sourceMapFilename: (value: WebpackOutput["sourceMapFilename"]) => this;
  public declare sourcePrefix: (value: WebpackOutput["sourcePrefix"]) => this;
  public declare strictModuleErrorHandling: (value: WebpackOutput["strictModuleErrorHandling"]) => this;
  public declare strictModuleExceptionHandling: (
    value: WebpackOutput["strictModuleExceptionHandling"],
  ) => this;
  public declare trustedTypes: (value: WebpackOutput["trustedTypes"]) => this;
  public declare umdNamedDefine: (value: WebpackOutput["umdNamedDefine"]) => this;
  public declare uniqueName: (value: WebpackOutput["uniqueName"]) => this;
  public declare wasmLoading: (value: WebpackOutput["wasmLoading"]) => this;
  public declare webassemblyModuleFilename: (value: WebpackOutput["webassemblyModuleFilename"]) => this;
  public declare workerChunkLoading: (value: WebpackOutput["workerChunkLoading"]) => this;
  public declare workerPublicPath: (value: WebpackOutput["workerPublicPath"]) => this;
  public declare workerWasmLoading: (value: WebpackOutput["workerWasmLoading"]) => this;
}
