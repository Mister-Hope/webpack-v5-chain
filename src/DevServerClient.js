import { ChainedMap } from "./utils/index.js";

export class DevServerClient extends ChainedMap {
  constructor(parent) {
    super(parent);

    this.extend(["logging", "overlay", "progress", "reconnect", "webSocketURL"]);
  }

  toConfig() {
    return this.clean(this.entries() || {});
  }
}
