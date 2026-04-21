import type { Configuration } from "webpack-dev-server";

import type { DevServer } from "./DevServer.js";
import { ChainedMap } from "./utils/index.js";

type DevServerOptions = Configuration;
type ClientConfig = Exclude<NonNullable<DevServerOptions["client"]>, boolean>;

export class DevServerClient extends ChainedMap<DevServer> {
  public constructor(parent?: DevServer) {
    super(parent);
    this.extend(["logging", "overlay", "progress", "reconnect", "webSocketURL"]);
  }

  public declare logging: (value: ClientConfig["logging"]) => this;
  public declare overlay: (value: ClientConfig["overlay"]) => this;
  public declare progress: (value: ClientConfig["progress"]) => this;
  public declare reconnect: (value: ClientConfig["reconnect"]) => this;
  public declare webSocketURL: (value: ClientConfig["webSocketURL"]) => this;

  public toConfig(): Record<string, unknown> {
    // oxlint-disable-next-line typescript/no-unsafe-argument
    return this.omitEmpty(this.entries() ?? {});
  }
}
