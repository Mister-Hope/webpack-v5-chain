import { describe, expect, it } from "vitest";

import {
  Callable,
  ChainedMap,
  ChainedSet,
  ChainedValueMap,
  Config,
  DevServer,
  DevServerClient,
  Module,
  Optimization,
  Output,
  Performance,
  Plugin,
  Resolve,
  ResolveLoader,
  Rule,
  Use,
} from "../src/index.js";

describe("public exports", () => {
  it("exports the chain classes", () => {
    for (const value of [
      Callable,
      ChainedMap,
      ChainedSet,
      ChainedValueMap,
      Config,
      DevServer,
      DevServerClient,
      Module,
      Optimization,
      Output,
      Performance,
      Plugin,
      Resolve,
      ResolveLoader,
      Rule,
      Use,
    ])
      expect(value).toBeTypeOf("function");
  });
});
