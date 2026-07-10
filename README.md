# webpack-v5-chain

[![npm version](https://img.shields.io/npm/v/webpack-v5-chain)](https://www.npmjs.com/package/webpack-v5-chain)
[![codecov](https://codecov.io/gh/Mister-Hope/webpack-v5-chain/graph/badge.svg?token=Zq5yZGNjjA)](https://codecov.io/gh/Mister-Hope/webpack-v5-chain)

A chaining API to generate and simplify webpack 5 configurations.

## Why `webpack-v5-chain`

- [`webpack-chain`](https://github.com/neutrinojs/webpack-chain) is archived and unmaintained.
- [`webpack-5-chain`](https://github.com/nicholasxuu/webpack-5-chain) is a fork with some fixes, but has many API mismatches with the latest webpack and is not actively maintained.

`webpack-v5-chain` keeps the API **up to date with the latest webpack**, is rewritten in TypeScript, and has **100% test coverage**.

> The source uses ESM syntax, so update your require:
>
> ```diff
> - const Config = require('webpack-chain');
> + const { Config } = require('webpack-v5-chain');
> ```

## Introduction

Webpack's core configuration is a plain JavaScript object. While fine for single projects, sharing and modifying these objects across projects requires deep knowledge of the internal structure.

`webpack-v5-chain` provides a chainable API for creating and modifying webpack configurations. Named references let you standardize modifications across projects.

## Getting Started


```js
// imports the webpack-v5-chain module.
const { Config } = require('webpack-v5-chain');

// Instantiate the configuration with a new API
const config = new Config();

// Make configuration changes using the chain API.
// Every API call tracks a change to the stored configuration.

config
  // Interact with entry points
  .entry('index')
    .add('src/index.js')
    .end()
  // Modify output settings
  .output
    .path('dist')
    .filename('[name].bundle.js');

// Create named rules which can be modified later
config.module
  .rule('lint')
    .test(/\.js$/)
    .pre()
    .include
      .add('src')
      .end()
    // Even create named uses (loaders)
    .use('eslint')
      .loader('eslint-loader')
      .options({
        rules: {
          semi: 'off'
        }
      });

config.module
  .rule('compile')
    .test(/\.js$/)
    .include
      .add('src')
      .add('test')
      .end()
    .use('babel')
      .loader('babel-loader')
      .options({
        presets: [
          ['@babel/preset-env', { modules: false }]
        ]
      });

// Create named plugins too!
config
  .plugin('clean')
    .use(CleanPlugin, [['dist'], { root: '/dir' }]);

// Export the completed configuration object to be consumed by webpack
module.exports = config.toConfig();
```

### Shared Configurations

Export the config and call `.toConfig()` before passing to webpack:

```js
// webpack.core.js
const { Config } = require('webpack-v5-chain');
const config = new Config();
// ...shared configuration
module.exports = config;

// webpack.dev.js
const config = require('./webpack.core');
// ...dev-specific configuration
module.exports = config.toConfig();

// webpack.prod.js
const config = require('./webpack.core');
// ...prod-specific configuration
module.exports = config.toConfig();
```

## Core Interfaces

### ChainedMap

A `ChainedMap` behaves like a JavaScript `Map` with chaining conveniences. Unless stated otherwise, all methods return the instance for chaining.

| Method                              | Description                                                                                                           |
| ----------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `clear()`                           | Remove all entries.                                                                                                   |
| `delete(key)`                       | Remove a single entry by key.                                                                                         |
| `get(key)` → `value`                | Fetch the value at the given key.                                                                                     |
| `getOrCompute(key, fn)` → `value`   | Get the value, or compute and set it via `fn()` if missing.                                                           |
| `set(key, value)`                   | Set a value at the given key.                                                                                         |
| `has(key)` → `boolean`              | Whether the map has a value at the key.                                                                               |
| `values()` → `Array`                | All values in the map.                                                                                                |
| `entries()` → `Object \| undefined` | All entries as an object. Returns `undefined` if empty. Keys are ordered by `.before()` / `.after()` when applicable. |
| `merge(obj, omit?)`                 | Merge an object's properties into the map. The optional `omit` array skips specified keys.                            |
| `batch(handler)`                    | Invoke `handler` with the current instance.                                                                           |
| `when(condition, truthy, falsy?)`   | Conditionally invoke `truthy` or `falsy` handler with the current instance.                                           |

### ChainedValueMap

`ChainedValueMap` extends `ChainedMap` and is callable. Calling it as a function sets its value and clears all map entries. Conversely, setting any key clears the callable value. The call returns the instance for chaining.

```js
// Callable — sets a direct value
config.optimization.splitChunks(false);

// ChainedMap usage
config.optimization.splitChunks.set('amd', true);
```

### ChainedSet

A `ChainedSet` behaves like a JavaScript `Set` with chaining conveniences. Unless stated otherwise, all methods return the instance.

| Method                            | Description                                               |
| --------------------------------- | --------------------------------------------------------- |
| `add(value)`                      | Append a value.                                           |
| `prepend(value)`                  | Add a value to the beginning.                             |
| `clear()`                         | Remove all values.                                        |
| `delete(value)`                   | Remove a specific value.                                  |
| `has(value)` → `boolean`          | Whether the set contains the value.                       |
| `values()` → `Array`              | All values in the set.                                    |
| `merge(arr)`                      | Concatenate an array to the end.                          |
| `batch(handler)`                  | Invoke `handler` with the current instance.               |
| `when(condition, truthy, falsy?)` | Conditionally invoke a handler with the current instance. |

## Shorthand Methods

Many `ChainedMap` properties have shorthand methods named after the key. They are chainable and equivalent to calling `.set(key, value)`:

```js
devServer.hot(true);
// equivalent to:
devServer.set('hot', true);
```

## API Reference

Navigate the API by chaining — use `.end()` to return to the parent context. For valid values, refer to the [webpack documentation](https://webpack.js.org/configuration/).

### Config

```js
const config = new Config();  // extends ChainedMap
```

#### Shorthand methods

```js
config
  .context(context)
  .mode(mode)
  .cache(cache)
  .devtool(devtool)
  .target(target)
  .watch(watch)
  .watchOptions(watchOptions)
  .externals(externals)
  .externalsType(externalsType)
  .externalsPresets(externalsPresets)
  .dotenv(dotenv)
  .node(node)
  .stats(stats)
  .experiments(experiments)
  .infrastructureLogging(infrastructureLogging)
  .amd(amd)
  .bail(bail)
  .dependencies(dependencies)
  .ignoreWarnings(ignoreWarnings)
  .loader(loader)
  .name(name)
  .parallelism(parallelism)
  .profile(profile)
  .recordsInputPath(recordsInputPath)
  .recordsOutputPath(recordsOutputPath)
  .recordsPath(recordsPath)
  .snapshot(snapshot)
```

#### Entry points

```js
// Backed at config.entryPoints : ChainedMap
config.entry(name) : ChainedSet

config
  .entry(name)
    .add(value)
    .add(value)

config
  .entry(name)
    .clear()

// Using low-level config.entryPoints:

config.entryPoints
  .get(name)
    .add(value)
    .add(value)

config.entryPoints
  .get(name)
    .clear()
```

#### Output


```js
config.output : ChainedMap

config.output
  .assetModuleFilename(assetModuleFilename)
  .asyncChunks(asyncChunks)
  .auxiliaryComment(auxiliaryComment)
  .charset(charset)
  .chunkFilename(chunkFilename)
  .chunkFormat(chunkFormat)
  .chunkLoadTimeout(chunkLoadTimeout)
  .chunkLoadingGlobal(chunkLoadingGlobal)
  .chunkLoading(chunkLoading)
  .clean(clean)
  .compareBeforeEmit(compareBeforeEmit)
  .crossOriginLoading(crossOriginLoading)
  .cssChunkFilename(cssChunkFilename)
  .cssFilename(cssFilename)
  .devtoolFallbackModuleFilenameTemplate(devtoolFallbackModuleFilenameTemplate)
  .devtoolModuleFilenameTemplate(devtoolModuleFilenameTemplate)
  .devtoolNamespace(devtoolNamespace)
  .enabledChunkLoadingTypes(enabledChunkLoadingTypes)
  .enabledLibraryTypes(enabledLibraryTypes)
  .enabledWasmLoadingTypes(enabledWasmLoadingTypes)
  .environment(environment)
  .filename(filename)
  .globalObject(globalObject)
  .hashDigest(hashDigest)
  .hashDigestLength(hashDigestLength)
  .hashFunction(hashFunction)
  .hashSalt(hashSalt)
  .hotUpdateChunkFilename(hotUpdateChunkFilename)
  .hotUpdateGlobal(hotUpdateGlobal)
  .hotUpdateMainFilename(hotUpdateMainFilename)
  .html(html)
  .htmlChunkFilename(htmlChunkFilename)
  .htmlFilename(htmlFilename)
  .iife(iife)
  .ignoreBrowserWarnings(ignoreBrowserWarnings)
  .importFunctionName(importFunctionName)
  .importMetaName(importMetaName)
  .library(library)
  .libraryExport(libraryExport)
  .libraryTarget(libraryTarget)
  .module(module)
  .path(path)
  .pathinfo(pathinfo)
  .publicPath(publicPath)
  .scriptType(scriptType)
  .sourceMapFilename(sourceMapFilename)
  .sourcePrefix(sourcePrefix)
  .strictModuleErrorHandling(strictModuleErrorHandling)
  .strictModuleExceptionHandling(strictModuleExceptionHandling)
  .strictModuleResolution(strictModuleResolution)
  .trustedTypes(trustedTypes)
  .umdNamedDefine(umdNamedDefine)
  .uniqueName(uniqueName)
  .wasmLoading(wasmLoading)
  .webassemblyModuleFilename(webassemblyModuleFilename)
  .workerChunkFilename(workerChunkFilename)
  .workerChunkLoading(workerChunkLoading)
  .workerPublicPath(workerPublicPath)
  .workerWasmLoading(workerWasmLoading)
```

#### Resolve

`config.resolve : ChainedMap`

Shorthand: `.cache .cachePredicate .cacheWithContext .enforceExtension .fullySpecified .preferAbsolute .preferRelative .symlinks .tsconfig .unsafeCache .useSyncFileSystemCalls`

**ChainedSet properties:** `.aliasFields .byDependency .conditionNames .descriptionFields .exportsFields .extensionAlias .extensions .importsFields .mainFields .mainFiles .modules .restrictions .roots`

**ChainedMap properties:** `.alias .fallback`

```js
config.resolve.alias.set(key, value);
config.resolve.extensions.add('.js').prepend('.ts');
config.resolve.fallback.set('path', 'path-browserify');
```

#### Resolve plugins

```js
config.resolve.plugin(name) → Plugin

// Adding — do not use `new`
config.resolve.plugin(name).use(Plugin, args);
config.resolve.plugin(name).use(require.resolve('plugin-path'), args);

// Modify arguments
config.resolve.plugin(name).tap(args => newArgs);

// Modify instantiation
config.resolve.plugin(name).init((Plugin, args) => new Plugin(...args));

// Remove
config.resolve.plugins.delete(name);

// Ordering
config.resolve.plugin(name).before(otherName);
config.resolve.plugin(name).after(otherName);
```

#### ResolveLoader

Identical to `config.resolve` with additional **ChainedSet** properties: `.modules .moduleExtensions .packageMains`

#### Performance

`config.performance : ChainedValueMap`

```js
config.performance(false);  // callable — disables performance hints

config.performance
  .assetFilter(fn)
  .hints('warning')
  .maxEntrypointSize(250000)
  .maxAssetSize(250000);
```

#### Optimization

`config.optimization : ChainedMap`

Shorthand: `.checkWasmTypes .chunkIds .concatenateModules .emitOnErrors .avoidEntryIife .flagIncludedChunks .inlineExports .innerGraph .mangleExports .mangleWasmImports .mergeDuplicateChunks .minimize .moduleIds .nodeEnv .portableRecords .providedExports .realContentHash .removeAvailableModules .removeEmptyChunks .runtimeChunk .sideEffects .usedExports`

**SplitChunks:** `config.optimization.splitChunks : ChainedValueMap`

```js
config.optimization.splitChunks({ chunks: 'all' });
config.optimization.splitChunks.set('minSize', 10000);
```

**Minimizers:**

```js
config.optimization.minimizer(name) → Plugin

config.optimization.minimizer(name).use(Plugin, args);
config.optimization.minimizer(name).tap(args => newArgs);
config.optimization.minimizer(name).init((Plugin, args) => new Plugin(...args));
config.optimization.minimizers.delete(name);
```

#### Plugins

```js
config.plugin(name) → Plugin

config.plugin(name).use(Plugin, args);
config.plugin(name).use(require.resolve('plugin-path'), args);
config.plugin(name).tap(args => newArgs);
config.plugin(name).init((Plugin, args) => new Plugin(...args));
config.plugins.delete(name);
config.plugin(name).before(otherName);  // cannot also use .after()
config.plugin(name).after(otherName);   // cannot also use .before()
```

#### DevServer

`config.devServer : ChainedMap`

Shorthand: `.after .app .bonjour .client .compress .devMiddleware .headers .historyApiFallback .host .hot .ipc .liveReload .onListening .open .port .server .setupExitSignals .setupMiddlewares .static .watchFiles .webSocketServer`

**ChainedSet:** `.allowedHosts`

#### Module

`config.module : ChainedMap`

Shorthand: `.noParse .unsafeCache .exprContextCritical .exprContextRecursive .exprContextRegExp .exprContextRequest .unknownContextCritical .unknownContextRecursive .unknownContextRegExp .unknownContextRequest .wrappedContextCritical .wrappedContextRecursive .wrappedContextRegExp .strictExportPresence .strictThisContextOnImports`

#### Module rules

```js
config.module.rule(name) → Rule

config.module.rule(name)
  .test(/\.js$/)
  .pre()          // enforce: 'pre'
  .post()         // enforce: 'post'
  .enforce(value) // enforce: value

// Nested rules
config.module.rule(name).rule(name) → Rule
config.module.rule(name).rule(name).before(otherName);
config.module.rule(name).rule(name).after(otherName);

// OneOf rules
config.module.rule(name).oneOf(name) → Rule
config.module.rule(name).oneOf(name).before(otherName);
config.module.rule(name).oneOf(name).after(otherName);

// Resolve override (webpack ≥ 4.36.1)
config.module.rule(name).resolve.symlinks(true);
```

#### Rule uses (loaders)

```js
config.module.rule(name).use(name) → Use

config.module.rule(name).use(name)
  .loader('babel-loader')
  .options({ presets: ['@babel/preset-env'] });

// Modify options
config.module.rule(name).use(name).tap(options => mergedOptions);
```

## Merging Config

Merge an object matching the chain schema layout. Note: this schema uses named keys (not webpack's raw config format).

```js
config.merge({ devtool: 'source-map' });
config.get('devtool'); // "source-map"
```

<details>
<summary>Full merge schema</summary>

```js
config.merge({
  amd, bail, cache, context, devtool, externals, loader, mode,
  parallelism, profile, recordsPath, recordsInputPath, recordsOutputPath,
  stats, target, watch, watchOptions, node: {},

  entry: { name: [...] },

  plugin: { name: { plugin, args, before, after } },

  devServer: { /* shorthand keys */ },

  optimization: {
    /* shorthand keys */,
    minimizer: { name: { plugin, args, before, after } },
    splitChunks: {}
  },

  performance: { hints, maxEntrypointSize, maxAssetSize, assetFilter },

  resolve: {
    /* shorthand keys */,
    alias: { key: value },
    aliasFields: [...], byDependency: [...], conditionNames: [...],
    descriptionFields: [...], exportsFields: [...], extensionAlias: [...],
    extensions: [...], fallback: {}, importsFields: [...],
    mainFields: [...], mainFiles: [...], modules: [...],
    restrictions: [...], roots: [...],
    plugin: { name: { plugin, args, before, after } }
  },

  resolveLoader: {
    /* same as resolve */,
    moduleExtensions: [...], packageMains: [...]
  },

  module: {
    /* shorthand keys */,
    rule: {
      name: {
        test, enforce, issuer, parser, resource, resourceQuery,
        dependency, descriptionData, loader, options, phase,
        realResource, resourceFragment,
        include: [...], exclude: [...],
        rules: { name: Rule },
        oneOf: { name: Rule },
        use: { name: { loader, options, before, after } }
      }
    }
  }
})
```

</details>

## Conditional Configuration

Use `.when()` on any `ChainedMap` or `ChainedSet`:

```js
config.when(
  process.env.NODE_ENV === 'production',
  config => config.plugin('minify').use(BabiliWebpackPlugin),
  config => config.devtool('source-map')
);
```

## Inspecting Config

Use `config.toString()` to generate a commented, stringified config:

```js
config.module
  .rule('compile')
    .test(/\.js$/)
    .use('babel')
      .loader('babel-loader');

config.toString();
{
  module: {
    rules: [
      /* config.module.rule('compile') */
      {
        test: /\.js$/,
        use: [
          /* config.module.rule('compile').use('babel') */
          { loader: 'babel-loader' }
        ]
      }
    ]
  }
}
```

### Stringifying objects & plugins

By default the output is not directly usable as webpack config. Set a `__expression` property on objects to control how they are stringified:

```js
const sass = require('sass');
sass.__expression = `require('sass')`;

class MyPlugin {}
MyPlugin.__expression = `require('my-plugin')`;

function myFunction() {}
myFunction.__expression = `require('my-function')`;

config.plugin('example').use(MyPlugin, [{ fn: myFunction, implementation: sass }]);

config.toString();
/*
{
  plugins: [
    new (require('my-plugin'))({
      fn: require('my-function'),
      implementation: require('sass')
    })
  ]
}
*/
```

Plugins specified by path auto-generate `require()`:

```js
config.plugin('env').use(require.resolve('webpack/lib/ProvidePlugin'), [{ jQuery: 'jquery' }]);

config.toString();
/*
{
  plugins: [
    new (require('/foo/bar/node_modules/webpack/lib/EnvironmentPlugin.js'))({ jQuery: 'jquery' })
  ]
}
*/
```

### Static `Config.toString()`

Call `Config.toString()` statically to modify the config before stringifying:

```js
Config.toString({
  ...config.toConfig(),
  module: {
    defaultRules: [{
      use: [{ loader: 'banner-loader', options: { prefix: 'banner-prefix.txt' } }]
    }]
  }
})
```
