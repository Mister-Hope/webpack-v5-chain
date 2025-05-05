export class Callable extends Function {
  constructor() {
    super();

    return new Proxy(this, {
      apply: (target, _thisArg, args) => target.classCall(...args),
    });
  }

  classCall() {
    throw new Error("not implemented");
  }
}
