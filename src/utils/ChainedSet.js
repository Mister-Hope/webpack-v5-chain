import { createChainable } from "./createChainable.js";
import { createSet } from "./createSet.js";

export const ChainedSet = createSet(createChainable(Object));
