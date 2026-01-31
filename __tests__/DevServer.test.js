import { expect, it } from "vitest";

import { DevServer } from "../src/DevServer.js";

it("is Chainable", () => {
  const parent = { parent: true };
  const devServer = new DevServer(parent);

  expect(devServer.end()).toStrictEqual(parent);
});

it("sets allowed hosts", () => {
  const devServer = new DevServer();
  const instance = devServer.allowedHosts.add("https://github.com").end();

  expect(instance).toStrictEqual(devServer);
  expect(devServer.toConfig()).toStrictEqual({
    allowedHosts: ["https://github.com"],
  });
});

it("merge allowed hosts", () => {
  const devServer = new DevServer();
  const instance = devServer.allowedHosts.add("https://github.com").end();

  instance.merge({
    allowedHosts: ["https://gitlab.com"],
  });

  expect(devServer.toConfig()).toStrictEqual({
    allowedHosts: ["https://github.com", "https://gitlab.com"],
  });
});

it("shorthand methods", () => {
  const devServer = new DevServer();
  const obj = {};

  devServer.shorthands.forEach((method) => {
    obj[method] = "alpha";
    expect(devServer[method]("alpha")).toStrictEqual(devServer);
  });

  expect(devServer.entries()).toStrictEqual(obj);
});

it("merge with omit", () => {
  const devServer = new DevServer();
  devServer.merge(
    {
      allowedHosts: ["host1"],
      port: 8080,
    },
    ["allowedHosts"],
  );

  expect(devServer.allowedHosts.values()).toStrictEqual([]);
  expect(devServer.get("port")).toBe(8080);
});
