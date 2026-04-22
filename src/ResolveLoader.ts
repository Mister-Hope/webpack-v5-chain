import { Resolve } from "./Resolve.js";
import { TypedChainedSet } from "./utils/index.js";

export class ResolveLoader extends Resolve {
  public moduleExtensions: TypedChainedSet<this, string>;
  public packageMains: TypedChainedSet<this, string>;

  public constructor(parent?: unknown) {
    super(parent as never);
    this.extensions = new TypedChainedSet(this);
    this.mainFields = new TypedChainedSet(this);
    this.modules = new TypedChainedSet(this);
    this.moduleExtensions = new TypedChainedSet(this);
    this.packageMains = new TypedChainedSet(this);
  }

  public override toConfig(): Record<string, unknown> {
    return this.omitEmpty({
      ...super.toConfig(),
      moduleExtensions: this.moduleExtensions.values(),
      packageMains: this.packageMains.values(),
    });
  }

  public override merge(obj: Record<string, unknown>, omit: string[] = []): this {
    const omissions = ["extensions", "mainFields", "modules", "moduleExtensions", "packageMains"];

    for (const key of omissions) {
      if (!omit.includes(key) && key in obj)
        // oxlint-disable-next-line typescript/no-explicit-any, typescript/no-unsafe-call, typescript/no-unsafe-member-access
        (this as any)[key].merge(obj[key]);
    }

    return super.merge(obj, [...omit, ...omissions]);
  }
}
