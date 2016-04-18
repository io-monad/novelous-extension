import React from "react";
import { assert, render } from "../../../common";
import Num from "../../../../app/scripts/lib/views/common/num";

describe("Num", () => {
  describe("#render", () => {
    it("renders commafied nummber", () => {
      const actual = render(
        <Num>{1234567890}</Num>
      );
      const expected = (
        <span className="num">1,234,567,890</span>
      );
      assert.reactEqual(actual, expected);
    });
  });
});
