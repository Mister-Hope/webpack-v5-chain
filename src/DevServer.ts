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

  declare public app: (value: DevServerOptions["app"]) => this;
  declare public bonjour: (value: DevServerOptions["bonjour"]) => this;
  declare public compress: (value: DevServerOptions["compress"]) => this;
  declare public devMiddleware: (value: DevServerOptions["devMiddleware"]) => this;
  declare public headers: (value: DevServerOptions["headers"]) => this;
  declare public historyApiFallback: (value: DevServerOptions["historyApiFallback"]) => this;
  declare public host: (value: DevServerOptions["host"]) => this;
  declare public hot: (value: DevServerOptions["hot"]) => this;
  declare public ipc: (value: DevServerOptions["ipc"]) => this;
  declare public liveReload: (value: DevServerOptions["liveReload"]) => this;
  declare public onListening: (value: DevServerOptions["onListening"]) => this;
  declare public open: (value: DevServerOptions["open"]) => this;
  declare public port: (value: DevServerOptions["port"]) => this;
  declare public proxy: (value: DevServerOptions["proxy"]) => this;
  declare public server: (value: DevServerOptions["server"]) => this;
  declare public setupExitSignals: (value: DevServerOptions["setupExitSignals"]) => this;
  declare public setupMiddlewares: (value: DevServerOptions["setupMiddlewares"]) => this;
  declare public static: (value: DevServerOptions["static"]) => this;
  declare public watchFiles: (value: DevServerOptions["watchFiles"]) => this;
  declare public webSocketServer: (value: DevServerOptions["webSocketServer"]) => this;

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

  public override merge(obj: Record<string, unknown>, omit: string[] = []): this {
    if (!omit.includes("allowedHosts") && "allowedHosts" in obj)
      this.allowedHosts.merge(obj.allowedHosts as string[]);

    if (!omit.includes("client") && "client" in obj) {
      if (obj.client === false) this.#clientDisabled = true;
      else if (typeof obj.client === "object" && obj.client != null)
        this.client.merge(obj.client as Record<string, unknown>);
    }

    return super.merge(obj, [...omit, "allowedHosts", "client"]);
  }
}
