import React from "react";
import { assert, shallow } from "../../../common";
import TypeIcon from
  "../../../../app/scripts/lib/views/subscriptions/type-icon";
import Icon from "../../../../app/scripts/lib/views/common/icon";

describe("TypeIcon", () => {
  describe("#render", () => {
    context("with known type", () => {
      it("renders Icon", () => {
        const actual = shallow(<TypeIcon type="novel" />);
        const expected = <Icon name="book" />;
        assert.reactEqual(actual, expected);
      });
    });

    context("with unknown type", () => {
      it("renders Icon", () => {
        const actual = shallow(<TypeIcon type="unknownTest" />);
        const expected = <Icon name="asterisk" />;
        assert.reactEqual(actual, expected);
      });
    });
  });
});
