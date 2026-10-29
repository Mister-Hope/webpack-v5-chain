import { describe, expect, it } from "vitest";

import { DevServer } from "../src/DevServer.js";

describe("dev server", () => {
  it("is Chainable", () => {
    const parent = { parent: true };
    const devServer = new DevServer(parent as any);

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

  it("merge a single allowed hosts value", () => {
    const devServer = new DevServer();

    devServer.merge({ allowedHosts: "auto" });

    expect(devServer.allowedHosts.values()).toStrictEqual(["auto"]);
    expect(devServer.toConfig()).toStrictEqual({ allowedHosts: ["auto"] });
  });

  it("shorthand methods", () => {
    const devServer = new DevServer();
    const obj = {};

    devServer.shorthands.forEach((method) => {
      (obj as any)[method] = "alpha";
      expect((devServer as any)[method]("alpha")).toStrictEqual(devServer);
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

  it("disableClient sets client to false in toConfig", () => {
    const devServer = new DevServer();

    expect(devServer.disableClient()).toStrictEqual(devServer);
    expect(devServer.toConfig()).toStrictEqual({ client: false });
  });

  it("merge with client: false disables client", () => {
    const devServer = new DevServer();

    devServer.merge({ client: false });

    expect(devServer.toConfig()).toStrictEqual({ client: false });
  });

  it("merge with client: true re-enables the client", () => {
    const devServer = new DevServer();

    devServer.disableClient();
    devServer.merge({ client: true });

    expect(devServer.toConfig()).toStrictEqual({});
  });

  it("supports client.webSocketTransport", () => {
    const devServer = new DevServer();

    devServer.client.webSocketTransport("ws");

    expect(devServer.toConfig()).toStrictEqual({ client: { webSocketTransport: "ws" } });
  });

  it("merge with client object merges into DevServerClient", () => {
    const devServer = new DevServer();

    devServer.merge({ client: { logging: "info" } });

    expect(devServer.toConfig()).toStrictEqual({ client: { logging: "info" } });
  });

  it("merge with client omitted does not modify client", () => {
    const devServer = new DevServer();

    devServer.merge({ client: false }, ["client"]);

    expect(devServer.toConfig()).toStrictEqual({});
  });

  it("merge with client: null does not modify client state", () => {
    const devServer = new DevServer();

    devServer.merge({ client: null });

    expect(devServer.toConfig()).toStrictEqual({});
  });
});
