import { expect, it } from "vitest";

import { Resolve } from "../src/Resolve.js";

class StringifyPlugin {
  constructor(...args) {
    this.values = args;
  }

  apply() {
    return JSON.stringify(this.values);
  }
}

it("is Chainable", () => {
  const parent = { parent: true };
  const resolve = new Resolve(parent);

  expect(resolve.end()).toBe(parent);
});

it("shorthand methods", () => {
  const resolve = new Resolve();
  const obj = {};

  resolve.shorthands.forEach((method) => {
    obj[method] = "alpha";
    expect(resolve[method]("alpha")).toBe(resolve);
  });

  expect(resolve.entries()).toStrictEqual(obj);
});

it("sets methods", () => {
  const resolve = new Resolve();
  const instance = resolve.modules.add("src").end().extensions.add(".js").end();

  expect(instance).toBe(resolve);
});

it("toConfig empty", () => {
  const resolve = new Resolve();

  expect(resolve.toConfig()).toStrictEqual({});
});

it("toConfig with values", () => {
  const resolve = new Resolve();

  resolve
    .plugin("stringify")
    .use(StringifyPlugin)
    .end()
    .modules.add("src")
    .end()
    .extensions.add(".js")
    .end()
    .alias.set("React", "src/react");

  expect(resolve.toConfig()).toStrictEqual({
    plugins: [new StringifyPlugin()],
    modules: ["src"],
    extensions: [".js"],
    alias: { React: "src/react" },
  });
});

it("merge empty", () => {
  const resolve = new Resolve();
  const obj = {
    modules: ["src"],
    extensions: [".js"],
    alias: { React: "src/react" },
  };
  const instance = resolve.merge(obj);

  expect(instance).toBe(resolve);
  expect(resolve.toConfig()).toStrictEqual(obj);
});

it("merge with values", () => {
  const resolve = new Resolve();

  resolve.modules
    .add("src")
    .end()
    .extensions.add(".js")
    .end()
    .alias.set("React", "src/react");

  resolve.merge({
    modules: ["dist"],
    extensions: [".jsx"],
    alias: { ReactDOM: "src/react-dom" },
  });

  expect(resolve.toConfig()).toStrictEqual({
    modules: ["src", "dist"],
    extensions: [".js", ".jsx"],
    alias: { React: "src/react", ReactDOM: "src/react-dom" },
  });
});

it("merge with omit", () => {
  const resolve = new Resolve();

  resolve.modules
    .add("src")
    .end()
    .extensions.add(".js")
    .end()
    .alias.set("React", "src/react");

  resolve.merge(
    {
      modules: ["dist"],
      extensions: [".jsx"],
      alias: { ReactDOM: "src/react-dom" },
    },
    ["alias"],
  );

  expect(resolve.toConfig()).toStrictEqual({
    modules: ["src", "dist"],
    extensions: [".js", ".jsx"],
    alias: { React: "src/react" },
  });
});

it("plugin with name", () => {
  const resolve = new Resolve();

  resolve.plugin("alpha");

  expect(resolve.plugins.get("alpha").name).toBe("alpha");
  expect(resolve.plugins.get("alpha").type).toBe("resolve.plugin");
});

it("plugin empty", () => {
  const resolve = new Resolve();
  const instance = resolve.plugin("stringify").use(StringifyPlugin).end();

  expect(instance).toBe(resolve);
  expect(resolve.plugins.has("stringify")).toBe(true);
  expect(resolve.plugins.get("stringify").get("args")).toStrictEqual([]);
});

it("plugin with args", () => {
  const resolve = new Resolve();

  resolve.plugin("stringify").use(StringifyPlugin, ["alpha", "beta"]);

  expect(resolve.plugins.has("stringify")).toBe(true);
  expect(resolve.plugins.get("stringify").get("args")).toStrictEqual([
    "alpha",
    "beta",
  ]);
});
