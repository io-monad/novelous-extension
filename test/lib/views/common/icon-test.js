import React from "react";
import { assert, render } from "../../../common";
import Icon from "../../../../app/scripts/lib/views/common/icon";

describe("Icon", () => {
  describe("#render", () => {
    it("renders icon", () => {
      const actual = render(<Icon name="check" />);
      const expected = (<i className="fa fa-check" />);
      assert.reactEqual(actual, expected);
    });

    it("renders icon with spin", () => {
      const actual = render(<Icon name="check" spin />);
      const expected = (<i className="fa fa-check fa-spin" />);
      assert.reactEqual(actual, expected);
    });
  });
});
