import type { Configuration } from "webpack-dev-server";

import type { Config } from "./Config.js";
import { DevServerClient } from "./DevServerClient.js";
import { ChainedMap, TypedChainedSet } from "./utils/index.js";

type DevServerOptions = Configuration;

export class DevServer extends ChainedMap<Config> {
  public allowedHosts: TypedChainedSet<this, string>;
  public client: DevServerClient;

  #clientDisabled = false;

  public constructor(parent?: Config) {
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

  public declare app: (value: DevServerOptions["app"]) => this;
  public declare bonjour: (value: DevServerOptions["bonjour"]) => this;
  public declare compress: (value: DevServerOptions["compress"]) => this;
  public declare devMiddleware: (value: DevServerOptions["devMiddleware"]) => this;
  public declare headers: (value: DevServerOptions["headers"]) => this;
  public declare historyApiFallback: (value: DevServerOptions["historyApiFallback"]) => this;
  public declare host: (value: DevServerOptions["host"]) => this;
  public declare hot: (value: DevServerOptions["hot"]) => this;
  public declare ipc: (value: DevServerOptions["ipc"]) => this;
  public declare liveReload: (value: DevServerOptions["liveReload"]) => this;
  public declare onListening: (value: DevServerOptions["onListening"]) => this;
  public declare open: (value: DevServerOptions["open"]) => this;
  public declare port: (value: DevServerOptions["port"]) => this;
  public declare proxy: (value: DevServerOptions["proxy"]) => this;
  public declare server: (value: DevServerOptions["server"]) => this;
  public declare setupExitSignals: (value: DevServerOptions["setupExitSignals"]) => this;
  public declare setupMiddlewares: (value: DevServerOptions["setupMiddlewares"]) => this;
  public declare static: (value: DevServerOptions["static"]) => this;
  public declare watchFiles: (value: DevServerOptions["watchFiles"]) => this;
  public declare webSocketServer: (value: DevServerOptions["webSocketServer"]) => this;

  public disableClient(): this {
    this.#clientDisabled = true;

    return this;
  }

  public toConfig(): Record<string, unknown> {
    // oxlint-disable-next-line typescript/no-unsafe-argument
    return this.omitEmpty({
      allowedHosts: this.allowedHosts.values(),
      client: this.#clientDisabled ? false : this.client.toConfig(),
      ...this.entries(),
    });
  }

  public merge(obj: Record<string, unknown>, omit: string[] = []): this {
    if (!omit.includes("allowedHosts") && "allowedHosts" in obj)
      this.allowedHosts.merge(obj.allowedHosts as string[]);

    if (!omit.includes("client") && "client" in obj) {
      if (obj.client === false)
        this.#clientDisabled = true;
      else if (typeof obj.client === "object" && obj.client !== null)
        this.client.merge(obj.client as Record<string, unknown>);
    }

    return super.merge(obj, [...omit, "allowedHosts", "client"]);
  }
}
