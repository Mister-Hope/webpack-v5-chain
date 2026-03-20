import type { Configuration } from "webpack";

import type { Config } from "./Config.js";
import { Rule } from "./Rule.js";
import { ChainedMap, TypedChainedMap } from "./utils/index.js";

type WebpackModule = Required<NonNullable<Configuration["module"]>>;

export class Module extends ChainedMap<Config> {
  rules: TypedChainedMap<this, Record<string, Rule>>;
  defaultRules: TypedChainedMap<this, Record<string, Rule>>;
  generator: ChainedMap<this>;
  parser: ChainedMap<this>;

  constructor(parent?: Config) {
    super(parent);
    this.rules = new TypedChainedMap(this);
    this.defaultRules = new TypedChainedMap(this);
    this.generator = new ChainedMap(this);
    this.parser = new ChainedMap(this);
    this.extend([
      "noParse",
      "unsafeCache",
      "exprContextCritical",
      "exprContextRecursive",
      "exprContextRegExp",
      "unknownContextCritical",
      "unknownContextRecursive",
      "unknownContextRegExp",
      "unknownContextRequest",
      "wrappedContextCritical",
      "wrappedContextRecursive",
      "wrappedContextRegExp",
      "strictExportPresence",
    ]);
  }

  declare noParse: (value: WebpackModule["noParse"]) => this;
  declare unsafeCache: (value: WebpackModule["unsafeCache"]) => this;
  declare exprContextCritical: (value: WebpackModule["exprContextCritical"]) => this;
  declare exprContextRecursive: (value: WebpackModule["exprContextRecursive"]) => this;
  declare exprContextRegExp: (value: WebpackModule["exprContextRegExp"]) => this;
  declare unknownContextCritical: (value: WebpackModule["unknownContextCritical"]) => this;
  declare unknownContextRecursive: (value: WebpackModule["unknownContextRecursive"]) => this;
  declare unknownContextRegExp: (value: WebpackModule["unknownContextRegExp"]) => this;
  declare unknownContextRequest: (value: WebpackModule["unknownContextRequest"]) => this;
  declare wrappedContextCritical: (value: WebpackModule["wrappedContextCritical"]) => this;
  declare wrappedContextRecursive: (value: WebpackModule["wrappedContextRecursive"]) => this;
  declare wrappedContextRegExp: (value: WebpackModule["wrappedContextRegExp"]) => this;
  declare strictExportPresence: (value: WebpackModule["strictExportPresence"]) => this;

  defaultRule(name: string): Rule<this> {
    return this.defaultRules.getOrCompute(name, () => new Rule(this as unknown as this, name, "defaultRule")) as Rule<this>;
  }

  rule(name: string): Rule<this> {
    return this.rules.getOrCompute(name, () => new Rule(this as unknown as this, name, "rule")) as Rule<this>;
  }

  toConfig(): Record<string, unknown> {
    return this.omitEmpty(
      Object.assign(this.entries() ?? {}, {
        defaultRules: this.defaultRules.values().map((rule) => rule.toConfig()),
        generator: this.generator.entries(),
        parser: this.parser.entries(),
        rules: this.rules.values().map((rule) => rule.toConfig()),
      }),
    );
  }

  override merge(obj: Record<string, unknown>, omit: string[] = []): this {
    if (!omit.includes("rule") && "rule" in obj)
      Object.keys(obj.rule as object).forEach((name) =>
        this.rule(name).merge((obj.rule as Record<string, Record<string, unknown>>)[name]),
      );

    if (!omit.includes("defaultRule") && "defaultRule" in obj) {
      Object.keys(obj.defaultRule as object).forEach((name) =>
        this.defaultRule(name).merge(
          (obj.defaultRule as Record<string, Record<string, unknown>>)[name],
        ),
      );
    }

    return super.merge(obj, [...omit, "rule", "defaultRule"]);
  }
}
