import type { Rule } from "./Rule.js";
import { ChainedMap } from "./utils/index.js";
import { mergeValues } from "./utils/merge.js";
import { setAfter, setBefore } from "./utils/Orderable.js";

// oxlint-disable-next-line typescript/no-explicit-any
type LoaderOptions = Record<string, any>;

export class Use<Parent = Rule> extends ChainedMap<Parent> {
  name: string;
  __before?: string;
  __after?: string;

  constructor(parent?: Parent, name?: string) {
    super(parent);
    this.name = name ?? "";
    this.extend(["ident", "loader", "options"]);
  }

  declare ident: (value: string) => this;
  declare loader: (value: string) => this;
  declare options: (value: LoaderOptions) => this;

  tap(func: (options: LoaderOptions) => LoaderOptions): this {
    this.options(func(this.get("options") as LoaderOptions));

    return this;
  }

  before(name: string): this {
    setBefore(this, name);

    return this;
  }

  after(name: string): this {
    setAfter(this, name);

    return this;
  }

  override merge(obj: Record<string, unknown>, omit: string[] = []): this {
    if ("before" in obj) this.before(obj.before as string);

    if ("after" in obj) this.after(obj.after as string);

    if (!omit.includes("loader") && "loader" in obj) this.loader(obj.loader as string);

    if (!omit.includes("options") && "options" in obj)
      this.options(mergeValues(this.store.get("options") ?? {}, obj.options) as LoaderOptions);

    return super.merge(obj, [...omit, "before", "after", "loader", "options"]);
  }

  toConfig(): Record<string, unknown> {
    // oxlint-disable-next-line typescript/no-unsafe-argument
    const config = this.omitEmpty(this.entries() ?? {});

    Object.defineProperties(config, {
      __useName: { value: this.name },
      // oxlint-disable-next-line typescript/no-explicit-any, typescript/no-unsafe-member-access, typescript/no-unsafe-assignment
      __ruleNames: { value: (this.parent as any)?.names },
      // oxlint-disable-next-line typescript/no-explicit-any, typescript/no-unsafe-member-access, typescript/no-unsafe-assignment
      __ruleTypes: { value: (this.parent as any)?.kinds },
    });

    return config;
  }
}
