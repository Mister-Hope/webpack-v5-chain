import { Resolve } from "./Resolve.js";
import { TypedChainedSet } from "./utils/index.js";

export class ResolveLoader extends Resolve {
  moduleExtensions: TypedChainedSet<this, string>;
  packageMains: TypedChainedSet<this, string>;

  constructor(parent?: unknown) {
    super(parent as never);
    this.extensions = new TypedChainedSet(this);
    this.mainFields = new TypedChainedSet(this);
    this.modules = new TypedChainedSet(this);
    this.moduleExtensions = new TypedChainedSet(this);
    this.packageMains = new TypedChainedSet(this);
  }

  override toConfig(): Record<string, unknown> {
    return this.omitEmpty({
      extensions: this.extensions.values(),
      mainFields: this.mainFields.values(),
      modules: this.modules.values(),
      ...super.toConfig(),
    });
  }

  override merge(obj: Record<string, unknown>, omit: string[] = []): this {
    const omissions = ["extensions", "mainFields", "modules"];

    for (const key of omissions) {
      if (!omit.includes(key) && key in obj)
        // oxlint-disable-next-line typescript/no-explicit-any, typescript/no-unsafe-member-access
        (this as any)[key].merge(obj[key]);
    }

    return super.merge(obj, [...omit, ...omissions]);
  }
}
