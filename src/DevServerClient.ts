import type { DevServer } from "./DevServer.js";
import { ChainedMap } from "./utils/index.js";

// See DevServer.ts: the ESM-only webpack-dev-server types need a dynamic type
// import to stay consumable from this CJS declaration file.
// oxlint-disable-next-line typescript/consistent-type-imports
type DevServerOptions = import("webpack-dev-server", {
  with: { "resolution-mode": "import" },
}).Configuration;
type ClientConfig = Exclude<NonNullable<DevServerOptions["client"]>, boolean>;

export class DevServerClient extends ChainedMap<DevServer> {
  constructor(parent?: DevServer) {
    super(parent);
    this.extend(["logging", "overlay", "progress", "reconnect", "webSocketURL"]);
  }

  declare logging: (value: ClientConfig["logging"]) => this;
  declare overlay: (value: ClientConfig["overlay"]) => this;
  declare progress: (value: ClientConfig["progress"]) => this;
  declare reconnect: (value: ClientConfig["reconnect"]) => this;
  declare webSocketURL: (value: ClientConfig["webSocketURL"]) => this;

  toConfig(): Record<string, unknown> {
    // oxlint-disable-next-line typescript/no-unsafe-argument
    return this.omitEmpty(this.entries() ?? {});
  }
}
