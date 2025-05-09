import { Resolve } from "./Resolve.js";
import { Use } from "./Use.js";
import { ChainedMap, ChainedSet, createOrderable } from "./utils/index.js";

const toArray = (arr) => (Array.isArray(arr) ? arr : [arr]);

export const Rule = createOrderable(
  class extends ChainedMap {
    constructor(parent, name, ruleType = "rule") {
      super(parent);
      this.ruleName = name;
      this.names = [];
      this.ruleType = ruleType;
      this.ruleTypes = [];

      // eslint-disable-next-line @typescript-eslint/no-this-alias
      let rule = this;

      while (rule instanceof Rule) {
        this.names.unshift(rule.ruleName);
        this.ruleTypes.unshift(rule.ruleType);
        rule = rule.parent;
      }

      this.uses = new ChainedMap(this);
      this.include = new ChainedSet(this);
      this.exclude = new ChainedSet(this);
      this.rules = new ChainedMap(this);
      this.oneOfs = new ChainedMap(this);
      this.resolve = new Resolve(this);
      this.resolve.extend(["fullySpecified"]);
      this.extend([
        "assert",
        "compiler",
        "enforce",
        "issuer",
        "issuerLayer",
        "layer",
        "mimetype",
        "parser",
        "generator",
        "resource",
        "resourceQuery",
        "scheme",
        "sideEffects",
        "test",
        "type",
        "width",
      ]);
    }

    use(name) {
      return this.uses.getOrCompute(name, () => new Use(this, name));
    }

    rule(name) {
      return this.rules.getOrCompute(name, () => new Rule(this, name, "rule"));
    }

    oneOf(name) {
      return this.oneOfs.getOrCompute(
        name,
        () => new Rule(this, name, "oneOf"),
      );
    }

    pre() {
      return this.enforce("pre");
    }

    post() {
      return this.enforce("post");
    }

    toConfig() {
      const config = this.clean(
        Object.assign(this.entries() || {}, {
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

    merge(obj, omit = []) {
      if (!omit.includes("include") && "include" in obj) {
        this.include.merge(toArray(obj.include));
      }

      if (!omit.includes("exclude") && "exclude" in obj) {
        this.exclude.merge(toArray(obj.exclude));
      }

      if (!omit.includes("use") && "use" in obj) {
        Object.keys(obj.use).forEach((name) =>
          this.use(name).merge(obj.use[name]),
        );
      }

      if (!omit.includes("rules") && "rules" in obj) {
        Object.keys(obj.rules).forEach((name) =>
          this.rule(name).merge(obj.rules[name]),
        );
      }

      if (!omit.includes("oneOf") && "oneOf" in obj) {
        Object.keys(obj.oneOf).forEach((name) =>
          this.oneOf(name).merge(obj.oneOf[name]),
        );
      }

      if (!omit.includes("resolve") && "resolve" in obj) {
        this.resolve.merge(obj.resolve);
      }

      if (!omit.includes("test") && "test" in obj) {
        this.test(
          obj.test instanceof RegExp || typeof obj.test === "function"
            ? obj.test
            : new RegExp(obj.test),
        );
      }

      return super.merge(obj, [
        ...omit,
        "include",
        "exclude",
        "use",
        "rules",
        "oneOf",
        "resolve",
        "test",
      ]);
    }
  },
);
