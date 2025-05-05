import { createChainable } from "./createChainable.js";
import { createMap } from "./createMap.js";

export const ChainedMap = createMap(createChainable(Object));
