import type { ResolveOptions } from "webpack";

import type { Config } from "./Config.js";
import { Plugin } from "./Plugin.js";
import { ChainedMap, TypedChainedMap, TypedChainedSet } from "./utils/index.js";

type WebpackResolve = Required<NonNullable<ResolveOptions>>;
type ResolvePlugin = Exclude<NonNullable<ResolveOptions["plugins"]>[number], "...">;

export class Resolve<ConfigType = Config> extends ChainedMap<ConfigType> {
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
  plugins: TypedChainedMap<this, Record<string, Plugin<this, ResolvePlugin>>>;
  restrictions: TypedChainedSet<this, WebpackResolve["restrictions"][number]>;
  roots: TypedChainedSet<this, WebpackResolve["roots"][number]>;

  constructor(parent?: ConfigType) {
    super(parent);
    this.alias = new TypedChainedMap(this);
    this.aliasFields = new TypedChainedSet(this);
    this.byDependency = new TypedChainedMap(this);
    this.conditionNames = new TypedChainedSet(this);
    this.descriptionFiles = new TypedChainedSet(this);
    this.exportsFields = new TypedChainedSet(this);
    this.extensionAlias = new TypedChainedMap(this);
    this.extensions = new TypedChainedSet(this);
    this.fallback = new TypedChainedMap(this);
    this.importsFields = new TypedChainedSet(this);
    this.mainFields = new TypedChainedSet(this);
    this.mainFiles = new TypedChainedSet(this);
    this.modules = new TypedChainedSet(this);
    this.plugins = new TypedChainedMap(this);
    this.restrictions = new TypedChainedSet(this);
    this.roots = new TypedChainedSet(this);
    this.extend([
      "cache",
      "cachePredicate",
      "cacheWithContext",
      "enforceExtension",
      "fullySpecified",
      "preferAbsolute",
      "preferRelative",
      "symlinks",
      "unsafeCache",
      "useSyncFileSystemCalls",
    ]);
  }

  declare cache: (value: WebpackResolve["cache"]) => this;
  declare cachePredicate: (value: WebpackResolve["cachePredicate"]) => this;
  declare cacheWithContext: (value: WebpackResolve["cacheWithContext"]) => this;
  declare enforceExtension: (value: WebpackResolve["enforceExtension"]) => this;
  declare fullySpecified: (value: WebpackResolve["fullySpecified"]) => this;
  declare preferAbsolute: (value: WebpackResolve["preferAbsolute"]) => this;
  declare preferRelative: (value: WebpackResolve["preferRelative"]) => this;
  declare symlinks: (value: WebpackResolve["symlinks"]) => this;
  declare unsafeCache: (value: WebpackResolve["unsafeCache"]) => this;
  declare useSyncFileSystemCalls: (value: WebpackResolve["useSyncFileSystemCalls"]) => this;

  plugin(name: string): Plugin<this, ResolvePlugin> {
    return this.plugins.getOrCompute(name, () => new Plugin(this, name, "resolve.plugin"));
  }

  toConfig(): Record<string, unknown> {
    return this.omitEmpty(
      Object.assign(this.entries() ?? {}, {
        alias: this.alias.entries(),
        aliasFields: this.aliasFields.values(),
        byDependency: this.byDependency.entries(),
        conditionNames: this.conditionNames.values(),
        descriptionFiles: this.descriptionFiles.values(),
        exportsFields: this.exportsFields.values(),
        extensionAlias: this.extensionAlias.entries(),
        extensions: this.extensions.values(),
        fallback: this.fallback.entries(),
        importsFields: this.importsFields.values(),
        mainFields: this.mainFields.values(),
        mainFiles: this.mainFiles.values(),
        modules: this.modules.values(),
        plugins: this.plugins.values().map((p) => p.toConfig()),
        restrictions: this.restrictions.values(),
        roots: this.roots.values(),
      }),
    );
  }

  override merge(obj: Record<string, unknown>, omit: string[] = []): this {
    const omissions = [
      "alias",
      "aliasFields",
      "byDependency",
      "conditionNames",
      "descriptionFiles",
      "exportsFields",
      "extensionAlias",
      "extensions",
      "importsFields",
      "mainFields",
      "mainFiles",
      "modules",
      "restrictions",
      "roots",
    ];

    if (!omit.includes("plugin") && "plugin" in obj)
      Object.keys(obj.plugin as object).forEach((name) =>
        this.plugin(name).merge((obj.plugin as Record<string, Record<string, unknown>>)[name]),
      );

    for (const key of omissions) {
      if (!omit.includes(key) && key in obj)
        // oxlint-disable-next-line typescript/no-explicit-any, typescript/no-unsafe-member-access
        (this as any)[key].merge(obj[key]);
    }

    return super.merge(obj, [...omit, ...omissions, "plugin"]);
  }
}

export class RuleResolve<ConfigType = Config> extends Resolve<ConfigType> {
  declare fullySpecified: (value: boolean) => this;
}
