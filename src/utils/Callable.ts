export class Callable extends Function {
  public constructor() {
    super();

    // oxlint-disable-next-line no-constructor-return
    return new Proxy(this, {
      apply: (target, _thisArg, args): unknown => target.classCall(...(args as unknown[])),
    });
  }

  // oxlint-disable-next-line class-methods-use-this
  public classCall(..._args: unknown[]): unknown {
    throw new Error("not implemented");
  }
}
