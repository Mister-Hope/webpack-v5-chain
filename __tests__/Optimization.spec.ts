import { expect, it } from "vitest";

import { Optimization } from "../src/Optimization.js";

class StringifyPlugin {
  public values!: unknown[];

  public constructor(...args: unknown[]) {
    this.values = args;
  }

  public apply(): string {
    return JSON.stringify(this.values);
  }
}

it("is Chainable", () => {
  const parent = { parent: true };
  const optimization = new Optimization(parent as any);

  expect(optimization.end()).toBe(parent);
});

it("shorthand methods", () => {
  const optimization = new Optimization();
  const obj = {};

  optimization.shorthands.forEach((method) => {
    (obj as any)[method] = "alpha";
    expect((optimization as any)[method]("alpha")).toBe(optimization);
  });

  expect(optimization.entries()).toStrictEqual(obj);
});

it("minimizer plugin with name", () => {
  const optimization = new Optimization();

  optimization.minimizer("alpha");

  expect(optimization.minimizers.get("alpha").name).toBe("alpha");
  expect(optimization.minimizers.get("alpha").type).toBe("optimization.minimizer");
});

it("minimizer plugin empty", () => {
  const optimization = new Optimization();
  const instance = optimization.minimizer("stringify").use(StringifyPlugin).end();

  expect(instance).toBe(optimization);
  expect(optimization.minimizers.has("stringify")).toBe(true);
  expect(optimization.minimizers.get("stringify").get("args")).toStrictEqual([]);
});

it("minimizer plugin with args", () => {
  const optimization = new Optimization();

  optimization.minimizer("stringify").use(StringifyPlugin, ["alpha", "beta"]);

  expect(optimization.minimizers.has("stringify")).toBe(true);
  expect(optimization.minimizers.get("stringify").get("args")).toStrictEqual(["alpha", "beta"]);
});

it("optimization merge", () => {
  const optimization = new Optimization();
  const obj = {
    minimizer: {
      stringify: {
        plugin: StringifyPlugin,
        args: ["alpha", "beta"],
      },
    },
  };

  expect(optimization.merge(obj)).toBe(optimization);
  expect(optimization.minimizers.has("stringify")).toBe(true);
  expect(optimization.minimizers.get("stringify").get("args")).toStrictEqual(["alpha", "beta"]);
});

it("toConfig empty", () => {
  const optimization = new Optimization();

  expect(optimization.toConfig()).toStrictEqual({});
});

it("toConfig with values", () => {
  const optimization = new Optimization();

  optimization.minimizer("foo").use(StringifyPlugin).end().splitChunks.set("chunks", "all");

  expect(optimization.toConfig()).toStrictEqual({
    minimizer: [new StringifyPlugin()],
    splitChunks: {
      chunks: "all",
    },
  });
});

it("merge with splitChunks: false", () => {
  const optimization = new Optimization();

  optimization.merge({ splitChunks: false });

  expect(optimization.toConfig()).toStrictEqual({ splitChunks: false });
});

it("merge with splitChunks object", () => {
  const optimization = new Optimization();

  optimization.merge({ splitChunks: { chunks: "all" } });

  expect(optimization.toConfig()).toStrictEqual({ splitChunks: { chunks: "all" } });
});

it("merge with splitChunks omitted", () => {
  const optimization = new Optimization();

  optimization.splitChunks.set("chunks", "async");
  optimization.merge({ splitChunks: { chunks: "all" } }, ["splitChunks"]);

  // omitted – original value unchanged
  expect(optimization.toConfig()).toStrictEqual({ splitChunks: { chunks: "async" } });
});

it("merge with splitChunks: null skips update", () => {
  const optimization = new Optimization();

  optimization.merge({ splitChunks: null as unknown as false });

  // null is neither false nor an object – splitChunks stays undefined
  expect(optimization.toConfig()).toStrictEqual({});
});
