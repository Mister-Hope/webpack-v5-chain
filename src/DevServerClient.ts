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

  declare public logging: (value: ClientConfig["logging"]) => this;
  declare public overlay: (value: ClientConfig["overlay"]) => this;
  declare public progress: (value: ClientConfig["progress"]) => this;
  declare public reconnect: (value: ClientConfig["reconnect"]) => this;
  declare public webSocketURL: (value: ClientConfig["webSocketURL"]) => this;

  public toConfig(): Record<string, unknown> {
    // oxlint-disable-next-line typescript/no-unsafe-argument
    return this.omitEmpty(this.entries() ?? {});
  }
}
