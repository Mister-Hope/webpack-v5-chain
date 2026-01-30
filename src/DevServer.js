import { ChainedMap, ChainedSet } from "./utils/index.js";
import { DevServerClient } from "./DevServerClient.js";

export class DevServer extends ChainedMap {
  constructor(parent) {
    super(parent);

    this.allowedHosts = new ChainedSet(this);
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

  toConfig() {
    return this.clean({
      allowedHosts: this.allowedHosts.values(),
      client: this.client.toConfig(),
      ...this.entries(),
    });
  }

  merge(obj, omit = []) {
    if (!omit.includes("allowedHosts") && "allowedHosts" in obj) {
      this.allowedHosts.merge(obj.allowedHosts);
    }

    return super.merge(obj, ["allowedHosts"]);
  }
}
