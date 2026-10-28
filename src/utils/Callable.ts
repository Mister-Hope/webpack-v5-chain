export class Callable extends Function {
  constructor() {
    super();

    // Keep `this` bound to the proxy instead of the wrapped target: subclass
    // private fields are initialized on the proxy, so calling classCall() with
    // the target would throw for `#private` field access.
    const proxy = new Proxy(this, {
      apply: (_target, _thisArg, args): unknown => proxy.classCall(...(args as unknown[])),
    });

    // oxlint-disable-next-line no-constructor-return
    return proxy;
  }

  // oxlint-disable-next-line class-methods-use-this
  classCall(..._args: unknown[]): unknown {
    throw new Error("not implemented");
  }
}
