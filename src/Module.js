import { Rule } from "./Rule.js";
import { ChainedMap } from "./utils/index.js";

export class Module extends ChainedMap {
  constructor(parent) {
    super(parent);
    this.rules = new ChainedMap(this);
    this.defaultRules = new ChainedMap(this);
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

  defaultRule(name) {
    return this.defaultRules.getOrCompute(
      name,
      () => new Rule(this, name, "defaultRule"),
    );
  }

  rule(name) {
    return this.rules.getOrCompute(name, () => new Rule(this, name, "rule"));
  }

  toConfig() {
    return this.clean(
      Object.assign(this.entries() || {}, {
        defaultRules: this.defaultRules.values().map((r) => r.toConfig()),
        generator: this.generator.entries(),
        parser: this.parser.entries(),
        rules: this.rules.values().map((r) => r.toConfig()),
      }),
    );
  }

  merge(obj, omit = []) {
    if (!omit.includes("rule") && "rule" in obj) {
      Object.keys(obj.rule).forEach((name) =>
        this.rule(name).merge(obj.rule[name]),
      );
    }

    if (!omit.includes("defaultRule") && "defaultRule" in obj) {
      Object.keys(obj.defaultRule).forEach((name) =>
        this.defaultRule(name).merge(obj.defaultRule[name]),
      );
    }

    return super.merge(obj, ["rule", "defaultRule"]);
  }
}
