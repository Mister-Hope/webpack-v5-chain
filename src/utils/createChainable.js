export const createChainable = (superClass) =>
  class Chainable extends superClass {
    constructor(parent) {
      super();
      this.parent = parent;
    }

    batch(handler) {
      handler(this);

      return this;
    }

    end() {
      return this.parent;
    }
  };
