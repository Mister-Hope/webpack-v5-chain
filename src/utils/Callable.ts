export class Callable extends Function {
  constructor() {
    super();

    // oxlint-disable-next-line no-constructor-return
    return new Proxy(this, {
      apply: (target, _thisArg, args) => {
        return target.classCall(...(args as unknown[]));
      },
    });
  }

  // oxlint-disable-next-line class-methods-use-this
  classCall(..._args: unknown[]): unknown {
    throw new Error("not implemented");
  }
}
