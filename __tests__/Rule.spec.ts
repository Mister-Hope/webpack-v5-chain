import { describe, expect, it } from "vitest";

import { Rule } from "../src/Rule.js";

describe("rule", () => {
  it("is Chainable", () => {
    const parent = { parent: true };
    const rule = new Rule(parent);

    expect(rule.end()).toBe(parent);
  });

  it("shorthand methods", () => {
    const rule = new Rule();
    const obj = {};

    rule.shorthands.forEach((method) => {
      (obj as any)[method] = "alpha";
      expect((rule as any)[method]("alpha")).toBe(rule);
    });

    expect(rule.entries()).toStrictEqual(obj);
  });

  it("use", () => {
    const rule = new Rule();
    const instance = rule.use("babel").end();

    expect(instance).toBe(rule);
    expect(rule.uses.has("babel")).toBe(true);
  });

  it("rule", () => {
    const rule = new Rule();
    const instance = rule.rule("babel").end();

    expect(instance).toBe(rule);
    expect(rule.rules.has("babel")).toBe(true);
  });

  it("oneOf", () => {
    const rule = new Rule();
    const instance = rule.oneOf("babel").end();

    expect(instance).toBe(rule);
    expect(rule.oneOfs.has("babel")).toBe(true);
  });

  it("resolve", () => {
    const rule = new Rule();
    const instance = rule.resolve.alias.set("foo", "bar").end().fullySpecified(true).end();

    expect(instance).toBe(rule);
    expect(rule.resolve.alias.has("foo")).toBe(true);
    expect(rule.resolve.get("fullySpecified")).toBe(true);
  });

  it("pre", () => {
    const rule = new Rule();
    const instance = rule.pre();

    expect(instance).toBe(rule);
    expect(rule.get("enforce")).toBe("pre");
  });

  it("post", () => {
    const rule = new Rule();
    const instance = rule.post();

    expect(instance).toBe(rule);
    expect(rule.get("enforce")).toBe("post");
  });

  it("sets methods", () => {
    const rule = new Rule();
    const instance = rule.include
      .add("alpha")
      .add("beta")
      .end()
      .exclude.add("alpha")
      .add("beta")
      .end();

    expect(instance).toBe(rule);
    expect(rule.include.values()).toStrictEqual(["alpha", "beta"]);
    expect(rule.exclude.values()).toStrictEqual(["alpha", "beta"]);
  });

  it("toConfig empty", () => {
    const rule = new Rule();

    expect(rule.toConfig()).toStrictEqual({});
  });

  it("toConfig with name", () => {
    const parent = new Rule(null, "alpha");
    const child = parent.oneOf("beta");
    const grandChild = child.oneOf("gamma");
    const ruleChild = parent.rule("delta");

    expect(parent.toConfig().__ruleNames).toStrictEqual(["alpha"]);
    expect(parent.toConfig().__ruleTypes).toStrictEqual(["rule"]);
    expect(child.toConfig().__ruleNames).toStrictEqual(["alpha", "beta"]);
    expect(child.toConfig().__ruleTypes).toStrictEqual(["rule", "oneOf"]);
    expect(grandChild.toConfig().__ruleNames).toStrictEqual(["alpha", "beta", "gamma"]);
    expect(grandChild.toConfig().__ruleTypes).toStrictEqual(["rule", "oneOf", "oneOf"]);
    expect(ruleChild.toConfig().__ruleNames).toStrictEqual(["alpha", "delta"]);
    expect(ruleChild.toConfig().__ruleTypes).toStrictEqual(["rule", "rule"]);
  });

  it("toConfig with values", () => {
    const rule = new Rule();

    rule.include
      .add("alpha")
      .add("beta")
      .end()
      .exclude.add("alpha")
      .add("beta")
      .end()
      .post()
      .pre()
      .test(/\.js$/u)
      .use("babel")
      .loader("babel-loader")
      .options({ presets: ["alpha"] })
      .end()
      .rule("minifier")
      .resourceQuery(/minify/u)
      .use("minifier")
      .loader("minifier-loader")
      .end()
      .end()
      .oneOf("inline")
      .resourceQuery(/inline/u)
      .use("url")
      .loader("url-loader");

    expect(rule.toConfig()).toStrictEqual({
      test: /\.js$/u,
      enforce: "pre",
      include: ["alpha", "beta"],
      exclude: ["alpha", "beta"],
      rules: [
        {
          resourceQuery: /minify/u,
          use: [
            {
              loader: "minifier-loader",
            },
          ],
        },
      ],
      oneOf: [
        {
          resourceQuery: /inline/u,
          use: [
            {
              loader: "url-loader",
            },
          ],
        },
      ],
      use: [
        {
          loader: "babel-loader",
          options: {
            presets: ["alpha"],
          },
        },
      ],
    });
  });

  it("toConfig with test function", () => {
    const rule = new Rule();
    const test = (path: string) => path.includes(".js");

    rule.test(test);

    expect(rule.toConfig()).toStrictEqual({ test });
  });

  it("merge empty", () => {
    const rule = new Rule();
    const obj = {
      enforce: "pre",
      test: /\.js$/u,
      include: ["alpha", "beta"],
      exclude: ["alpha", "beta"],
      rules: {
        minifier: {
          resourceQuery: /minify/u,
          use: {
            minifier: {
              loader: "minifier-loader",
            },
          },
        },
      },
      oneOf: {
        inline: {
          resourceQuery: /inline/u,
          use: {
            url: {
              loader: "url-loader",
            },
          },
        },
      },
      use: {
        babel: {
          loader: "babel-loader",
          options: {
            presets: ["alpha"],
          },
        },
      },
    };
    const instance = rule.merge(obj);

    expect(instance).toBe(rule);
    expect(rule.toConfig()).toStrictEqual({
      enforce: "pre",
      test: /\.js$/u,
      include: ["alpha", "beta"],
      exclude: ["alpha", "beta"],
      rules: [
        {
          resourceQuery: /minify/u,
          use: [
            {
              loader: "minifier-loader",
            },
          ],
        },
      ],
      oneOf: [
        {
          resourceQuery: /inline/u,
          use: [
            {
              loader: "url-loader",
            },
          ],
        },
      ],
      use: [
        {
          loader: "babel-loader",
          options: {
            presets: ["alpha"],
          },
        },
      ],
    });
  });

  it("merge with values", () => {
    const rule = new Rule();

    rule
      .test(/\.js$/u)
      .post()
      .include.add("gamma")
      .add("delta")
      .end()
      .use("babel")
      .loader("babel-loader")
      .options({ presets: ["alpha"] });

    rule.merge({
      test: /\.jsx$/u,
      enforce: "pre",
      include: ["alpha", "beta"],
      exclude: ["alpha", "beta"],
      rules: {
        minifier: {
          resourceQuery: /minify/u,
          use: {
            minifier: {
              loader: "minifier-loader",
            },
          },
        },
      },
      oneOf: {
        inline: {
          resourceQuery: /inline/u,
          use: {
            url: {
              loader: "url-loader",
            },
          },
        },
      },
      use: {
        babel: {
          options: {
            presets: ["beta"],
          },
        },
      },
    });

    expect(rule.toConfig()).toStrictEqual({
      test: /\.jsx$/u,
      enforce: "pre",
      include: ["gamma", "delta", "alpha", "beta"],
      exclude: ["alpha", "beta"],
      rules: [
        {
          resourceQuery: /minify/u,
          use: [
            {
              loader: "minifier-loader",
            },
          ],
        },
      ],
      oneOf: [
        {
          resourceQuery: /inline/u,
          use: [
            {
              loader: "url-loader",
            },
          ],
        },
      ],
      use: [
        {
          loader: "babel-loader",
          options: {
            presets: ["alpha", "beta"],
          },
        },
      ],
    });
  });

  it("merge with omit", () => {
    const rule = new Rule();

    rule
      .test(/\.js$/u)
      .post()
      .include.add("gamma")
      .add("delta")
      .end()
      .use("babel")
      .loader("babel-loader")
      .options({ presets: ["alpha"] });

    rule.merge(
      {
        test: /\.jsx$/u,
        enforce: "pre",
        include: ["alpha", "beta"],
        exclude: ["alpha", "beta"],
        rules: {
          minifier: {
            resourceQuery: /minify/u,
            use: {
              minifier: {
                loader: "minifier-loader",
              },
            },
          },
        },
        oneOf: {
          inline: {
            resourceQuery: /inline/u,
            use: {
              url: {
                loader: "url-loader",
              },
            },
          },
        },
        use: {
          babel: {
            options: {
              presets: ["beta"],
            },
          },
        },
      },
      ["use", "oneOf", "rules"],
    );

    expect(rule.toConfig()).toStrictEqual({
      test: /\.jsx$/u,
      enforce: "pre",
      include: ["gamma", "delta", "alpha", "beta"],
      exclude: ["alpha", "beta"],
      use: [
        {
          loader: "babel-loader",
          options: {
            presets: ["alpha"],
          },
        },
      ],
    });
  });

  it("merge with include and exclude not of array type", () => {
    const rule = new Rule();

    rule.merge({
      test: /\.jsx$/u,
      include: "alpha",
      exclude: "alpha",
    });

    expect(rule.toConfig()).toStrictEqual({
      test: /\.jsx$/u,
      include: ["alpha"],
      exclude: ["alpha"],
    });
  });

  it("merge with resolve", () => {
    const rule = new Rule();

    rule.merge({
      resolve: {
        alias: { foo: "bar" },
      },
    });

    rule.merge({
      resolve: {
        extensions: [".js", ".mjs"],
      },
    });

    expect(rule.toConfig()).toStrictEqual({
      resolve: {
        alias: { foo: "bar" },
        extensions: [".js", ".mjs"],
      },
    });
  });

  it("ordered rules", () => {
    const rule = new Rule();

    rule
      .rule("first")
      .test(/\.first$/u)
      .end()
      .rule("second")
      .test(/\.second$/u)
      .end()
      .rule("third")
      .test(/\.third$/u)
      .end()
      .rule("alpha")
      .test(/\.alpha$/u)
      .before("first")
      .end()
      .rule("beta")
      .test(/\.beta$/u)
      .after("second");

    expect((rule.toConfig().rules as any[]).map((rule) => rule.test)).toStrictEqual([
      /\.alpha$/u,
      /\.first$/u,
      /\.second$/u,
      /\.beta$/u,
      /\.third$/u,
    ]);
  });

  it("ordered oneOfs", () => {
    const rule = new Rule();

    rule
      .oneOf("first")
      .test(/\.first$/u)
      .end()
      .oneOf("second")
      .test(/\.second$/u)
      .end()
      .oneOf("third")
      .test(/\.third$/u)
      .end()
      .oneOf("alpha")
      .test(/\.alpha$/u)
      .before("first")
      .end()
      .oneOf("beta")
      .test(/\.beta$/u)
      .after("second");

    expect((rule.toConfig().oneOf as any[]).map((rule) => rule.test)).toStrictEqual([
      /\.alpha$/u,
      /\.first$/u,
      /\.second$/u,
      /\.beta$/u,
      /\.third$/u,
    ]);
  });

  it("merge with string test and nested rules", () => {
    const rule = new Rule();
    rule.merge({
      test: "\\.js$",
      rules: {
        nested: {
          test: "\\.ts$",
        },
      },
      oneOf: {
        inner: {
          test: "\\.css$",
        },
      },
    });

    const config = rule.toConfig() as any;
    expect(config.test).toBeInstanceOf(RegExp);
    expect(config.test.source).toBe(String.raw`\.js$`);
    expect(config.rules[0].test.source).toBe(String.raw`\.ts$`);
    expect(config.oneOf[0].test.source).toBe(String.raw`\.css$`);
  });

  it("merge overriding", () => {
    const rule = new Rule();
    rule.merge(
      {
        test: "\\.js$",
        use: {
          babel: { loader: "babel-loader" },
        },
      },
      ["use"],
    );

    expect(rule.toConfig().use).toBeUndefined();
    expect(rule.toConfig().test).toBeDefined();
  });

  it("merge without omit", () => {
    const rule = new Rule();
    rule.merge({ test: /\.js$/u });
    expect(rule.get("test")).toStrictEqual(/\.js$/u);
  });

  it("merge with all omissions", () => {
    const rule = new Rule();
    rule.merge(
      {
        include: ["a"],
        exclude: ["b"],
        use: { c: { loader: "d" } },
        rules: { e: { test: /f/u } },
        oneOf: { g: { test: /h/u } },
        resolve: { preferRelative: true },
        test: /i/u,
      },
      ["include", "exclude", "use", "rules", "oneOf", "resolve", "test"],
    );

    expect(rule.toConfig()).toStrictEqual({});
  });

  it("before throws when __after is already set", () => {
    const rule = new Rule();
    rule.after("beta");
    expect(() => rule.before("alpha")).toThrow("Unable to set .before");
  });

  it("after throws when __before is already set", () => {
    const rule = new Rule();
    rule.before("alpha");
    expect(() => rule.after("beta")).toThrow("Unable to set .after");
  });

  it("merge with before and after in object", () => {
    const rule = new Rule();
    rule.merge({ before: "other-rule" });
    expect(rule.__before).toBe("other-rule");

    const rule2 = new Rule();
    rule2.merge({ after: "some-rule" });
    expect(rule2.__after).toBe("some-rule");
  });
});
