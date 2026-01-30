export class Callable extends Function {
  constructor() {
    super();

    // oxlint-disable-next-line no-constructor-return
    return new Proxy(this, {
      apply: (target, _thisArg, args) => target.classCall(...args),
    });
  }

  // oxlint-disable-next-line class-methods-use-this
  classCall() {
    throw new Error("not implemented");
  }
}
