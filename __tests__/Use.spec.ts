import { describe, expect, it } from "vitest";

import { Rule } from "../src/Rule.js";
import { Use } from "../src/Use.js";

describe("use", () => {
  it("is Chainable", () => {
    const parent = { parent: true };
    const use = new Use(parent);

    expect(use.end()).toBe(parent);
  });

  it("shorthand methods", () => {
    const use = new Use();
    const obj = {};

    use.shorthands.forEach((method) => {
      (obj as any)[method] = "alpha";
      expect((use as any)[method]("alpha")).toBe(use);
    });

    expect(use.entries()).toStrictEqual(obj);
  });

  it("tap", () => {
    const use = new Use();

    use.loader("babel-loader").options({ presets: ["alpha"] });

    use.tap((options) => {
      expect(options).toStrictEqual({ presets: ["alpha"] });

      return { presets: ["beta"] };
    });

    expect(use.store.get("options")).toStrictEqual({ presets: ["beta"] });
  });

  it("toConfig", () => {
    const rule = new Rule(null, "alpha");
    const use = rule
      .use("beta")
      .loader("babel-loader")
      .options({ presets: ["alpha"] });

    const config = use.toConfig();

    expect(config).toStrictEqual({
      loader: "babel-loader",
      options: { presets: ["alpha"] },
    });

    expect(config.__ruleNames).toStrictEqual(["alpha"]);
    expect(config.__ruleTypes).toStrictEqual(["rule"]);
    expect(config.__useName).toBe("beta");
  });

  it("merge without omit", () => {
    const use = new Use();
    use.merge({ loader: "babel-loader" });
    expect(use.get("loader")).toBe("babel-loader");
  });

  it("merge with all omissions", () => {
    const use = new Use();
    use.merge(
      {
        loader: "a",
        options: { b: 1 },
      },
      ["loader", "options"],
    );

    expect(use.toConfig()).toStrictEqual({});
  });

  it("merge and toConfig edge cases", () => {
    const use = new Use();

    // toConfig empty
    expect(use.toConfig()).toStrictEqual({});

    // merge with omit
    use.merge(
      {
        loader: "babel-loader",
        options: { a: 1 },
      },
      ["loader"],
    );

    expect(use.get("loader")).toBeUndefined();
    expect(use.get("options")).toStrictEqual({ a: 1 });

    // merge options with existing
    use.merge({
      options: { b: 2 },
    });
    expect(use.get("options")).toStrictEqual({ a: 1, b: 2 });
  });

  it("before and after ordering", () => {
    const use = new Use();
    use.before("other");
    expect(use.__before).toBe("other");

    const use2 = new Use();
    use2.after("other");
    expect(use2.__after).toBe("other");
  });

  it("before throws when __after is already set", () => {
    const use = new Use();
    use.after("beta");
    expect(() => use.before("alpha")).toThrow("Unable to set .before");
  });

  it("after throws when __before is already set", () => {
    const use = new Use();
    use.before("alpha");
    expect(() => use.after("beta")).toThrow("Unable to set .after");
  });

  it("merge with before and after", () => {
    const use = new Use();
    use.merge({ before: "other-loader" });
    expect(use.__before).toBe("other-loader");

    const use2 = new Use();
    use2.merge({ after: "yet-another" });
    expect(use2.__after).toBe("yet-another");
  });
});
