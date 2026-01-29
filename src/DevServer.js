import { ChainedMap, ChainedSet } from "./utils/index.js";

export class DevServer extends ChainedMap {
  constructor(parent) {
    super(parent);

    this.allowedHosts = new ChainedSet(this);

    this.extend([
      "after",
      "before",
      "app",
      "bonjour",
      "client",
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
