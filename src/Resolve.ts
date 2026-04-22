// oxlint-disable max-classes-per-file
import type { ResolveOptions } from "webpack";

import type { Config } from "./Config.js";
import { Plugin } from "./Plugin.js";
import { ChainedMap, TypedChainedMap, TypedChainedSet } from "./utils/index.js";

type WebpackResolve = Required<NonNullable<ResolveOptions>>;
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
  public plugins: TypedChainedMap<this, Record<string, Plugin<this, ResolvePlugin>>>;
  public restrictions: TypedChainedSet<this, WebpackResolve["restrictions"][number]>;
  public roots: TypedChainedSet<this, WebpackResolve["roots"][number]>;

  public constructor(parent?: ConfigType) {
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

  declare public cache: (value: WebpackResolve["cache"]) => this;
  declare public cachePredicate: (value: WebpackResolve["cachePredicate"]) => this;
  declare public cacheWithContext: (value: WebpackResolve["cacheWithContext"]) => this;
  declare public enforceExtension: (value: WebpackResolve["enforceExtension"]) => this;
  declare public fullySpecified: (value: WebpackResolve["fullySpecified"]) => this;
  declare public preferAbsolute: (value: WebpackResolve["preferAbsolute"]) => this;
  declare public preferRelative: (value: WebpackResolve["preferRelative"]) => this;
  declare public symlinks: (value: WebpackResolve["symlinks"]) => this;
  declare public unsafeCache: (value: WebpackResolve["unsafeCache"]) => this;
  declare public useSyncFileSystemCalls: (value: WebpackResolve["useSyncFileSystemCalls"]) => this;

  public plugin(name: string): Plugin<this, ResolvePlugin> {
    return this.plugins.getOrCompute(name, () => new Plugin(this, name, "resolve.plugin"));
  }

  public toConfig(): Record<string, unknown> {
    return this.omitEmpty(
      // oxlint-disable-next-line typescript/no-unsafe-argument
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
        // oxlint-disable-next-line id-length
        plugins: this.plugins.values().map((p) => p.toConfig()),
        restrictions: this.restrictions.values(),
        roots: this.roots.values(),
      }),
    );
  }

  public override merge(obj: Record<string, unknown>, omit: string[] = []): this {
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

    if (!omit.includes("plugin") && "plugin" in obj) {
      Object.keys(obj.plugin as object).forEach((name) => {
        this.plugin(name).merge((obj.plugin as Record<string, Record<string, unknown>>)[name]);
      });
    }

    for (const key of omissions) {
      if (!omit.includes(key) && key in obj)
        // oxlint-disable-next-line typescript/no-explicit-any, typescript/no-unsafe-call, typescript/no-unsafe-member-access
        (this as any)[key].merge(obj[key]);
    }

    return super.merge(obj, [...omit, ...omissions, "plugin"]);
  }
}

export class RuleResolve<ConfigType = Config> extends Resolve<ConfigType> {
  declare public fullySpecified: (value: boolean) => this;
}
