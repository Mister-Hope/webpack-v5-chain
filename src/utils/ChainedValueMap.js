import { Callable } from "./Callable.js";
import { createChainable } from "./createChainable.js";
import { createMap } from "./createMap.js";
import { createValue } from "./createValue.js";

export const ChainedValueMap = createValue(createMap(createChainable(Callable)));
