import { createRequire } from "node:module";

import { stringify } from "javascript-stringify";
import { expect, it } from "vitest";
import { validate } from "webpack";
import EnvironmentPlugin from "webpack/lib/EnvironmentPlugin";

import { Config } from "../src/Config.js";

const require = createRequire(import.meta.url);

class StringifyPlugin {
  constructor(...args) {
    this.values = args;
  }

  apply() {
    return JSON.stringify(this.values);
  }
}

it("is ChainedMap", () => {
  const config = new Config();

  config.set("a", "alpha");

  expect(config.store.get("a")).toBe("alpha");
});

it("shorthand methods", () => {
  const config = new Config();
  const obj = {};

  config.shorthands.forEach((method) => {
    obj[method] = "alpha";
    expect(config[method]("alpha")).toBe(config);
  });

  expect(config.entries()).toStrictEqual(obj);
});

it("performance is false", () => {
  const config = new Config();
  const instance = config.performance(false);

  expect(instance).toBe(config);
  expect(config.performance.entries()).toBeFalsy();
});

it("bail", () => {
  const config = new Config();
  const instance = config.bail(false);

  expect(instance.toConfig()).toStrictEqual({
    bail: false,
  });
});

it("cache", () => {
  const config = new Config();

  const instanceBoolean = config.cache(false);

  expect(instanceBoolean.toConfig()).toStrictEqual({
    cache: false,
  });

  const instanceObject = config.cache({
    allowCollectingMemory: true,
    cacheDirectory: "./",
  });

  expect(instanceBoolean.get("cache")).toStrictEqual({
    allowCollectingMemory: true,
    cacheDirectory: "./",
  });
  expect(instanceObject.toConfig()).toStrictEqual({
    cache: {
      allowCollectingMemory: true,
      cacheDirectory: "./",
    },
  });
});

it("name", () => {
  const config = new Config();
  const instance = config.name("aaa");

  expect(instance.toConfig()).toStrictEqual({
    name: "aaa",
  });
});

it("entry", () => {
  const config = new Config();

  config.entry("index").add("babel-polyfill").add("src/index.js");

  expect(config.entryPoints.has("index")).toBeTruthy();
  expect(config.entryPoints.get("index").values()).toStrictEqual([
    "babel-polyfill",
    "src/index.js",
  ]);
});

it("plugin empty", () => {
  const config = new Config();
  const instance = config.plugin("stringify").use(StringifyPlugin).end();

  expect(instance).toBe(config);
  expect(config.plugins.has("stringify")).toBeTruthy();
  expect(config.plugins.get("stringify").get("args")).toStrictEqual([]);
});

it("plugin with args", () => {
  const config = new Config();

  config.plugin("stringify").use(StringifyPlugin, ["alpha", "beta"]);

  expect(config.plugins.has("stringify")).toBeTruthy();
  expect(config.plugins.get("stringify").get("args")).toStrictEqual(["alpha", "beta"]);
});

it("toConfig empty", () => {
  const config = new Config();

  expect(config.toConfig()).toStrictEqual({});
});

it("toConfig with values", () => {
  const config = new Config();

  config.output
    .path("build")
    .end()
    .mode("development")
    .node({ __dirname: "mock" })
    .optimization.nodeEnv("PRODUCTION")
    .minimizer("stringify")
    .use(StringifyPlugin)
    .end()
    .end()
    .target("node")
    .plugin("stringify")
    .use(StringifyPlugin)
    .end()
    .plugin("env")
    .use(require.resolve("webpack/lib/EnvironmentPlugin"))
    .end()
    .module.defaultRule("inline")
    .use("banner")
    .loader("banner-loader")
    .options({ prefix: "banner-prefix.txt" })
    .end()
    .end()
    .rule("compile")
    .include.add("alpha")
    .add("beta")
    .end()
    .exclude.add("alpha")
    .add("beta")
    .end()
    .post()
    .pre()
    .test(/\.js$/)
    .use("babel")
    .loader("babel-loader")
    .options({ presets: ["alpha"] });

  expect(config.toConfig()).toStrictEqual({
    mode: "development",
    node: {
      __dirname: "mock",
    },
    optimization: {
      nodeEnv: "PRODUCTION",
      minimizer: [new StringifyPlugin()],
    },
    output: {
      path: "build",
    },
    target: "node",
    plugins: [new StringifyPlugin(), new EnvironmentPlugin()],
    module: {
      defaultRules: [
        {
          use: [
            {
              loader: "banner-loader",
              options: { prefix: "banner-prefix.txt" },
            },
          ],
        },
      ],
      rules: [
        {
          include: ["alpha", "beta"],
          exclude: ["alpha", "beta"],
          enforce: "pre",
          test: /\.js$/,
          use: [
            {
              loader: "babel-loader",
              options: { presets: ["alpha"] },
            },
          ],
        },
      ],
    },
  });
});

it("merge empty", () => {
  const config = new Config();

  const obj = {
    mode: "development",
    node: {
      __dirname: "mock",
    },
    optimization: {
      nodeEnv: "PRODUCTION",
    },
    output: {
      path: "build",
    },
    target: "node",
    entry: {
      index: ["babel-polyfill", "src/index.js"],
    },
    plugin: { stringify: { plugin: new StringifyPlugin(), args: [] } },
  };

  const instance = config.merge(obj);

  expect(instance).toBe(config);

  expect(config.toConfig()).toStrictEqual({
    mode: "development",
    node: {
      __dirname: "mock",
    },
    optimization: {
      nodeEnv: "PRODUCTION",
    },
    output: {
      path: "build",
    },
    target: "node",
    entry: {
      index: ["babel-polyfill", "src/index.js"],
    },
    plugins: [new StringifyPlugin()],
  });
});

it("merge with values", () => {
  const config = new Config();

  config.output
    .path("build")
    .end()
    .mode("development")
    .node({ __dirname: "mock" })
    .optimization.nodeEnv("PRODUCTION")
    .end()
    .entry("index")
    .add("babel-polyfill")
    .end()
    .target("node")
    .plugin("stringify")
    .use(StringifyPlugin)
    .end();

  const obj = {
    mode: "production",
    output: {
      path: "build",
    },
    target: "browser",
    entry: {
      index: "src/index.js",
    },
    plugin: { env: { plugin: new EnvironmentPlugin() } },
  };

  const instance = config.merge(obj);

  expect(instance).toBe(config);

  expect(config.toConfig()).toStrictEqual({
    mode: "production",
    node: {
      __dirname: "mock",
    },
    optimization: {
      nodeEnv: "PRODUCTION",
    },
    output: {
      path: "build",
    },
    target: "browser",
    entry: {
      index: ["babel-polyfill", "src/index.js"],
    },
    plugins: [new StringifyPlugin(), new EnvironmentPlugin()],
  });
});

it("merge with omit", () => {
  const config = new Config();

  config.output
    .path("build")
    .end()
    .mode("development")
    .node({ __dirname: "mock" })
    .optimization.nodeEnv("PRODUCTION")
    .end()
    .entry("index")
    .add("babel-polyfill")
    .end()
    .target("node")
    .plugin("stringify")
    .use(StringifyPlugin)
    .end();

  const obj = {
    mode: "production",
    output: {
      path: "build",
    },
    target: "browser",
    entry: {
      index: "src/index.js",
    },
    plugin: { env: { plugin: new EnvironmentPlugin() } },
  };

  const instance = config.merge(obj, ["target"]);

  expect(instance).toBe(config);

  expect(config.toConfig()).toStrictEqual({
    mode: "production",
    node: {
      __dirname: "mock",
    },
    optimization: {
      nodeEnv: "PRODUCTION",
    },
    output: {
      path: "build",
    },
    target: "node",
    entry: {
      index: ["babel-polyfill", "src/index.js"],
    },
    plugins: [new StringifyPlugin(), new EnvironmentPlugin()],
  });
});

it("validate empty", () => {
  const config = new Config();

  expect(() => {
    validate(config.toConfig());
  }).not.toThrow();
});

it("validate with entry", () => {
  const config = new Config();

  config.entry("index").add("src/index.js");

  expect(() => {
    validate(config.toConfig());
  }).not.toThrow();
});

it("validate with values", () => {
  const config = new Config();

  config
    .entry("index")
    .add("babel-polyfill")
    .add("src/index.js")
    .end()
    .output.path("/build")
    .end()
    .mode("development")
    .optimization.nodeEnv("PRODUCTION")
    .end()
    .node({ __dirname: "mock" })
    .target("node")
    .plugin("stringify")
    .use(StringifyPlugin)
    .end()
    .plugin("env")
    .use(require.resolve("webpack/lib/EnvironmentPlugin"), [{ VAR: false }])
    .end()
    .module.rule("compile")
    .include.add("/alpha")
    .add("/beta")
    .end()
    .exclude.add("/alpha")
    .add("/beta")
    .end()
    .sideEffects(false)
    .post()
    .pre()
    .test(/\.js$/)
    .use("babel")
    .loader("babel-loader")
    .options({ presets: ["alpha"] });

  expect(() => {
    validate(config.toConfig());
  }).not.toThrow();
});

it("toString", () => {
  const config = new Config();

  config.module.rule("alpha").oneOf("beta").use("babel").loader("babel-loader");

  // Nested rules
  config.module.rule("alpha").rule("nested").use("babel").loader("babel-loader");

  // Default rules
  config.module.defaultRule("default").rule("nested").use("babel").loader("babel-loader");

  const envPluginPath = require.resolve("webpack/lib/EnvironmentPlugin");
  const stringifiedEnvPluginPath = stringify(envPluginPath);

  class FooPlugin {}
  FooPlugin.__expression = `require('foo-plugin')`;

  config
    .plugin("env")
    .use(envPluginPath, [{ VAR: false }])
    .end()
    .plugin("gamma")
    .use(FooPlugin)
    .end()
    .plugin("delta")
    .use(class BarPlugin {}, ["bar"])
    .end()
    .plugin("epsilon")
    .use(class BazPlugin {}, [{ num: 1 }, [2, 3]]);

  config.resolve.plugin("resolver").use(FooPlugin);
  config.optimization.minimizer("minifier").use(FooPlugin);

  expect(config.toString().trim()).toBe(
    `
{
  resolve: {
    plugins: [
      /* config.resolve.plugin('resolver') */
      new (require('foo-plugin'))()
    ]
  },
  module: {
    defaultRules: [
      /* config.module.defaultRule('default') */
      {
        rules: [
          /* config.module.defaultRule('default').rule('nested') */
          {
            use: [
              /* config.module.defaultRule('default').rule('nested').use('babel') */
              {
                loader: 'babel-loader'
              }
            ]
          }
        ]
      }
    ],
    rules: [
      /* config.module.rule('alpha') */
      {
        rules: [
          /* config.module.rule('alpha').rule('nested') */
          {
            use: [
              /* config.module.rule('alpha').rule('nested').use('babel') */
              {
                loader: 'babel-loader'
              }
            ]
          }
        ],
        oneOf: [
          /* config.module.rule('alpha').oneOf('beta') */
          {
            use: [
              /* config.module.rule('alpha').oneOf('beta').use('babel') */
              {
                loader: 'babel-loader'
              }
            ]
          }
        ]
      }
    ]
  },
  optimization: {
    minimizer: [
      /* config.optimization.minimizer('minifier') */
      new (require('foo-plugin'))()
    ]
  },
  plugins: [
    /* config.plugin('env') */
    new (require(${stringifiedEnvPluginPath}))(
      {
        VAR: false
      }
    ),
    /* config.plugin('gamma') */
    new (require('foo-plugin'))(),
    /* config.plugin('delta') */
    new BarPlugin(
      'bar'
    ),
    /* config.plugin('epsilon') */
    new BazPlugin(
      {
        num: 1
      },
      [
        2,
        3
      ]
    )
  ]
}
  `.trim(),
  );
});

it("toString for functions with custom expression", () => {
  const fn = function foo() {};

  fn.__expression = `require('foo')`;

  const config = new Config();

  config.module.rule("alpha").include.add(fn);

  expect(config.toString().trim()).toBe(
    `
{
  module: {
    rules: [
      /* config.module.rule('alpha') */
      {
        include: [
          require('foo')
        ]
      }
    ]
  }
}
  `.trim(),
  );
});

it("toString with custom prefix", () => {
  const config = new Config();

  config.plugin("foo").use(class TestPlugin {});

  expect(config.toString({ configPrefix: "neutrino.config" }).trim()).toBe(
    `
{
  plugins: [
    /* neutrino.config.plugin('foo') */
    new TestPlugin()
  ]
}
  `.trim(),
  );
});

it("static Config.toString", () => {
  const config = new Config();
  const sass = {
    __expression: `require('sass')`,
    render() {},
  };

  config.plugin("foo").use(class TestPlugin {});

  expect(
    Config.toString(
      Object.assign(config.toConfig(), {
        module: {
          defaultRules: [
            {
              use: [
                {
                  loader: "banner-loader",
                  options: {
                    prefix: "banner-prefix.txt",
                    implementation: sass,
                  },
                },
              ],
            },
          ],
        },
      }),
    ).trim(),
  ).toBe(
    `
{
  plugins: [
    /* config.plugin('foo') */
    new TestPlugin()
  ],
  module: {
    defaultRules: [
      {
        use: [
          {
            loader: 'banner-loader',
            options: {
              prefix: 'banner-prefix.txt',
              implementation: require('sass')
            }
          }
        ]
      }
    ]
  }
}
  `.trim(),
  );
});
