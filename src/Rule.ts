import type { RuleSetRule } from "webpack";

import type { Module } from "./Module.js";
import { RuleResolve } from "./Resolve.js";
import { Use } from "./Use.js";
import { ChainedMap, TypedChainedMap, TypedChainedSet } from "./utils/index.js";

type WebpackRuleSet = Required<RuleSetRule>;

const toArray = <T>(arr: T | T[]): T[] => (Array.isArray(arr) ? arr : [arr]);

export class Rule<RuleType = Module> extends ChainedMap<RuleType> {
  public ruleName: string;
  public names: string[];
  public ruleType: string;
  public ruleTypes: string[];
  public uses: TypedChainedMap<this, Record<string, Use<this>>>;
  public include: TypedChainedSet<this, WebpackRuleSet["include"]>;
  public exclude: TypedChainedSet<this, WebpackRuleSet["exclude"]>;
  // oxlint-disable-next-line typescript/no-explicit-any
  public rules: TypedChainedMap<this, Record<string, Rule<any>>>;
  // oxlint-disable-next-line typescript/no-explicit-any
  public oneOfs: TypedChainedMap<this, Record<string, Rule<any>>>;
  public resolve: RuleResolve<Rule<RuleType>>;
  public __before?: string;
  public __after?: string;

  public constructor(parent?: RuleType, name?: string, ruleType = "rule") {
    super(parent);
    this.ruleName = name ?? "";
    this.names = [];
    this.ruleType = ruleType;
    this.ruleTypes = [];

    // Walk up the parent chain to build names/types arrays
    // oxlint-disable-next-line typescript/no-this-alias, unicorn/no-this-assignment, typescript/no-explicit-any
    let rule: any = this;

    while (rule instanceof Rule) {
      this.names.unshift(rule.ruleName);
      this.ruleTypes.unshift(rule.ruleType);
      // oxlint-disable-next-line typescript/no-unsafe-assignment
      rule = rule.parent;
    }

    this.uses = new TypedChainedMap(this);
    this.include = new TypedChainedSet(this);
    this.exclude = new TypedChainedSet(this);
    this.rules = new TypedChainedMap(this);
    this.oneOfs = new TypedChainedMap(this);
    // oxlint-disable-next-line typescript/no-explicit-any, typescript/no-unsafe-assignment
    this.resolve = new RuleResolve(this as any);
    this.resolve.extend(["fullySpecified"]);
    this.extend([
      "assert",
      "compiler",
      "enforce",
      "issuer",
      "issuerLayer",
      "layer",
      "extractSourceMap",
      "mimetype",
      "parser",
      "generator",
      "resource",
      "resourceQuery",
      "scheme",
      "sideEffects",
      "test",
      "type",
      "with",
    ]);
  }

  declare public assert: (value: WebpackRuleSet["assert"]) => this;
  declare public compiler: (value: WebpackRuleSet["compiler"]) => this;
  declare public enforce: (value: WebpackRuleSet["enforce"]) => this;
  declare public issuer: (value: WebpackRuleSet["issuer"]) => this;
  declare public issuerLayer: (value: WebpackRuleSet["issuerLayer"]) => this;
  declare public layer: (value: WebpackRuleSet["layer"]) => this;
  declare public extractSourceMap: (value: WebpackRuleSet["extractSourceMap"]) => this;
  declare public mimetype: (value: WebpackRuleSet["mimetype"]) => this;
  declare public parser: (value: WebpackRuleSet["parser"]) => this;
  declare public generator: (value: WebpackRuleSet["generator"]) => this;
  declare public resource: (value: WebpackRuleSet["resource"]) => this;
  declare public resourceQuery: (value: WebpackRuleSet["resourceQuery"]) => this;
  declare public scheme: (value: WebpackRuleSet["scheme"]) => this;
  declare public sideEffects: (value: WebpackRuleSet["sideEffects"]) => this;
  declare public test: (value: WebpackRuleSet["test"]) => this;
  declare public type: (value: WebpackRuleSet["type"]) => this;
  declare public with: (value: WebpackRuleSet["with"]) => this;

  public before(name: string): this {
    if (this.__after) {
      throw new Error(
        `Unable to set .before(${JSON.stringify(name)}) with existing value for .after()`,
      );
    }

    this.__before = name;

    return this;
  }

  public after(name: string): this {
    if (this.__before) {
      throw new Error(
        `Unable to set .after(${JSON.stringify(name)}) with existing value for .before()`,
      );
    }

    this.__after = name;

    return this;
  }

  public use(name: string): Use<this> {
    return this.uses.getOrCompute(name, () => new Use(this, name)) as unknown as Use<this>;
  }

  public rule(name: string): Rule<this> {
    return this.rules.getOrCompute(
      name,
      () => new Rule(this as unknown as this, name, "rule"),
    ) as unknown as Rule<this>;
  }

  public oneOf(name: string): Rule<this> {
    return this.oneOfs.getOrCompute(
      name,
      () => new Rule(this as unknown as this, name, "oneOf"),
    ) as unknown as Rule<this>;
  }

  public pre(): this {
    return this.enforce("pre");
  }

  public post(): this {
    return this.enforce("post");
  }

  public toConfig(): Record<string, unknown> {
    const config = this.omitEmpty(
      // oxlint-disable-next-line typescript/no-unsafe-argument
      Object.assign(this.entries() ?? {}, {
        include: this.include.values(),
        exclude: this.exclude.values(),
        rules: this.rules.values().map((rule) => rule.toConfig()),
        oneOf: this.oneOfs.values().map((oneOf) => oneOf.toConfig()),
        use: this.uses.values().map((use) => use.toConfig()),
        resolve: this.resolve.toConfig(),
      }),
    );

    Object.defineProperties(config, {
      __ruleNames: { value: this.names },
      __ruleTypes: { value: this.ruleTypes },
    });

    return config;
  }

  public override merge(obj: Record<string, unknown>, omit: string[] = []): this {
    if ("before" in obj) this.before(obj.before as string);

    if ("after" in obj) this.after(obj.after as string);

    if (!omit.includes("include") && "include" in obj)
      this.include.merge(toArray(obj.include as WebpackRuleSet["include"]));

    if (!omit.includes("exclude") && "exclude" in obj)
      this.exclude.merge(toArray(obj.exclude as WebpackRuleSet["exclude"]));

    if (!omit.includes("use") && "use" in obj) {
      Object.keys(obj.use as object).forEach((name) => {
        this.use(name).merge((obj.use as Record<string, Record<string, unknown>>)[name]);
      });
    }

    if (!omit.includes("rules") && "rules" in obj) {
      Object.keys(obj.rules as object).forEach((name) => {
        this.rule(name).merge((obj.rules as Record<string, Record<string, unknown>>)[name]);
      });
    }

    if (!omit.includes("oneOf") && "oneOf" in obj) {
      Object.keys(obj.oneOf as object).forEach((name) => {
        this.oneOf(name).merge((obj.oneOf as Record<string, Record<string, unknown>>)[name]);
      });
    }

    if (!omit.includes("resolve") && "resolve" in obj)
      this.resolve.merge(obj.resolve as Record<string, unknown>);

    if (!omit.includes("test") && "test" in obj) {
      this.test(
        obj.test instanceof RegExp || typeof obj.test === "function"
          ? (obj.test as WebpackRuleSet["test"])
          : new RegExp(obj.test as string),
      );
    }

    return super.merge(obj, [
      ...omit,
      "before",
      "after",
      "include",
      "exclude",
      "use",
      "rules",
      "oneOf",
      "resolve",
      "test",
    ]);
  }
}
