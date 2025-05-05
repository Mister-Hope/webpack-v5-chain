import { Plugin } from "./Plugin.js";
import { ChainedMap, ChainedSet } from "./utils/index.js";

export class Resolve extends ChainedMap {
  constructor(parent) {
    super(parent);
    this.alias = new ChainedMap(this);
    this.aliasFields = new ChainedSet(this);
    this.byDependency = new ChainedMap(this);
    this.conditionNames = new ChainedSet(this);
    this.descriptionFiles = new ChainedSet(this);
    this.exportsFields = new ChainedSet(this);
    this.extensionAlias = new ChainedMap(this);
    this.extensions = new ChainedSet(this);
    this.fallback = new ChainedMap(this);
    this.importsFields = new ChainedSet(this);
    this.mainFields = new ChainedSet(this);
    this.mainFiles = new ChainedSet(this);
    this.modules = new ChainedSet(this);
    this.plugins = new ChainedMap(this);
    this.restrictions = new ChainedSet(this);
    this.roots = new ChainedSet(this);
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

  plugin(name) {
    return this.plugins.getOrCompute(
      name,
      () => new Plugin(this, name, "resolve.plugin"),
    );
  }

  toConfig() {
    return this.clean(
      Object.assign(this.entries() || {}, {
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
        plugins: this.plugins.values().map((plugin) => plugin.toConfig()),
        restrictions: this.restrictions.values(),
        roots: this.roots.values(),
      }),
    );
  }

  merge(obj, omit = []) {
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
      Object.keys(obj.plugin).forEach((name) =>
        this.plugin(name).merge(obj.plugin[name]),
      );
    }

    omissions.forEach((key) => {
      if (!omit.includes(key) && key in obj) {
        this[key].merge(obj[key]);
      }
    });

    return super.merge(obj, [...omit, ...omissions, "plugin"]);
  }
}
