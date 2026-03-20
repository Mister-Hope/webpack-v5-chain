import { expect, it } from "vitest";

import { ResolveLoader } from "../src/ResolveLoader.js";

it("is Chainable", () => {
  const parent = { parent: true };
  const resolveLoader = new ResolveLoader(parent);

  expect(resolveLoader.end()).toBe(parent);
});

it("shorthand methods", () => {
  const resolveLoader = new ResolveLoader();
  const obj = {};

  resolveLoader.shorthands.forEach((method) => {
    obj[method] = "alpha";
    expect(resolveLoader[method]("alpha")).toBe(resolveLoader);
  });

  expect(resolveLoader.entries()).toStrictEqual(obj);
});

it("sets methods", () => {
  const resolveLoader = new ResolveLoader();
  const instance = resolveLoader.modules.add("src").end();

  expect(instance).toBe(resolveLoader);
  expect(resolveLoader.toConfig()).toStrictEqual({ modules: ["src"] });
});

it("toConfig empty", () => {
  const resolveLoader = new ResolveLoader();

  expect(resolveLoader.toConfig()).toStrictEqual({});
});

it("toConfig with values", () => {
  const resolveLoader = new ResolveLoader();

  resolveLoader.modules.add("src").end().extensions.add("-loader");

  expect(resolveLoader.toConfig()).toEqual({
    extensions: ["-loader"],
    modules: ["src"],
  });
});

it("merge empty", () => {
  const resolveLoader = new ResolveLoader();
  const obj = {
    modules: ["src"],
    extensions: ["-loader"],
  };
  const instance = resolveLoader.merge(obj);

  expect(instance).toBe(resolveLoader);
  expect(resolveLoader.toConfig()).toStrictEqual(obj);
});

it("merge with values", () => {
  const resolveLoader = new ResolveLoader();

  resolveLoader.modules.add("src").end().extensions.add("-loader");

  resolveLoader.merge({
    modules: ["dist"],
    extensions: ["-fake"],
  });

  expect(resolveLoader.toConfig()).toStrictEqual({
    modules: ["src", "dist"],
    extensions: ["-loader", "-fake"],
  });
});

it("merge with omit", () => {
  const resolveLoader = new ResolveLoader();

  resolveLoader.modules.add("src").end().extensions.add("-loader");

  resolveLoader.merge(
    {
      modules: ["dist"],
      extensions: ["-fake"],
    },
    ["extensions"],
  );

  expect(resolveLoader.toConfig()).toStrictEqual({
    modules: ["src", "dist"],
    extensions: ["-loader"],
  });
});

it("plugin with name", () => {
  const resolveLoader = new ResolveLoader();

  resolveLoader.plugin("alpha");

  expect(resolveLoader.plugins.get("alpha").name).toBe("alpha");
});
