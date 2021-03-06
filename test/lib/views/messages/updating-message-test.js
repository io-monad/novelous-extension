import React from "react";
import { assert, shallow } from "../../../common";
import UpdatingMessage from "../../../../app/scripts/lib/views/messages/updating-message";
import MessageBox from "../../../../app/scripts/lib/views/common/message-box";

describe("UpdatingMessage", () => {
  describe("#render", () => {
    it("renders MessageBox", () => {
      const actual = shallow(<UpdatingMessage />);
      const expected = (<MessageBox message="updating" icon="circle-o-notch" spin />);
      assert.reactEqual(actual, expected);
    });
  });
});
