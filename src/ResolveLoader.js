import { Resolve } from "./Resolve.js";
import { ChainedSet } from "./utils/index.js";

export class ResolveLoader extends Resolve {
  constructor(parent) {
    super(parent);
    this.extensions = new ChainedSet(this);
    this.mainFields = new ChainedSet(this);
    this.modules = new ChainedSet(this);
  }

  toConfig() {
    return this.clean({
      extensions: this.extensions.values(),
      mainFields: this.mainFields.values(),
      modules: this.modules.values(),
      ...super.toConfig(),
    });
  }

  merge(obj, omit = []) {
    const omissions = ["extensions", "mainFields", "modules"];

    omissions.forEach((key) => {
      if (!omit.includes(key) && key in obj) {
        this[key].merge(obj[key]);
      }
    });

    return super.merge(obj, [...omit, ...omissions]);
  }
}
