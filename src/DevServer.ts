import type { Configuration } from "webpack-dev-server";

import type { Config } from "./Config.js";
import { DevServerClient } from "./DevServerClient.js";
import { ChainedMap, TypedChainedSet } from "./utils/index.js";

type DevServerOptions = Configuration;

export class DevServer extends ChainedMap<Config> {
  allowedHosts: TypedChainedSet<this, string>;
  client: DevServerClient;

  constructor(parent?: Config) {
    super(parent);

    this.allowedHosts = new TypedChainedSet(this);
    this.client = new DevServerClient(this);

    this.extend([
      "app",
      "bonjour",
      "compress",
      "devMiddleware",
      "headers",
      "historyApiFallback",
      "host",
      "hot",
      "ipc",
      "liveReload",
      "onListening",
      "open",
      "port",
      "proxy",
      "server",
      "setupExitSignals",
      "setupMiddlewares",
      "static",
      "watchFiles",
      "webSocketServer",
    ]);
  }

  declare app: (value: DevServerOptions["app"]) => this;
  declare bonjour: (value: DevServerOptions["bonjour"]) => this;
  declare compress: (value: DevServerOptions["compress"]) => this;
  declare devMiddleware: (value: DevServerOptions["devMiddleware"]) => this;
  declare headers: (value: DevServerOptions["headers"]) => this;
  declare historyApiFallback: (value: DevServerOptions["historyApiFallback"]) => this;
  declare host: (value: DevServerOptions["host"]) => this;
  declare hot: (value: DevServerOptions["hot"]) => this;
  declare ipc: (value: DevServerOptions["ipc"]) => this;
  declare liveReload: (value: DevServerOptions["liveReload"]) => this;
  declare onListening: (value: DevServerOptions["onListening"]) => this;
  declare open: (value: DevServerOptions["open"]) => this;
  declare port: (value: DevServerOptions["port"]) => this;
  declare proxy: (value: DevServerOptions["proxy"]) => this;
  declare server: (value: DevServerOptions["server"]) => this;
  declare setupExitSignals: (value: DevServerOptions["setupExitSignals"]) => this;
  declare setupMiddlewares: (value: DevServerOptions["setupMiddlewares"]) => this;
  declare static: (value: DevServerOptions["static"]) => this;
  declare watchFiles: (value: DevServerOptions["watchFiles"]) => this;
  declare webSocketServer: (value: DevServerOptions["webSocketServer"]) => this;

  toConfig(): Record<string, unknown> {
    return this.omitEmpty({
      allowedHosts: this.allowedHosts.values(),
      client: this.client.toConfig(),
      ...(this.entries() ?? {}),
    });
  }

  merge(obj: Record<string, unknown>, omit: string[] = []): this {
    if (!omit.includes("allowedHosts") && "allowedHosts" in obj)
      this.allowedHosts.merge(obj.allowedHosts as string[]);

    return super.merge(obj, [...omit, "allowedHosts"]);
  }
}
