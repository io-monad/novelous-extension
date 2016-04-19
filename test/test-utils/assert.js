import powerAssert from "power-assert";
import stringifier from "stringifier";
import extendReactEqual from "./assert-extension/react-equal";

const s = stringifier.strategies;
const assert = powerAssert.customize({
  output: {
    maxDepth: 2,
    handlers: {
      RenderedElement: s.object(kvp => {
        return !/^_|^\$\$typeof$/.test(kvp.key);
      }),
    },
  },
});

extendReactEqual(assert);
export default assert;
