import type { Configuration } from "webpack-dev-server";

import type { DevServer } from "./DevServer.js";
import { ChainedMap } from "./utils/index.js";

type DevServerOptions = Configuration;
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
