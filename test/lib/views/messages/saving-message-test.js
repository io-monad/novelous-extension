import React from "react";
import { assert, shallow } from "../../../common";
import SavingMessage from "../../../../app/scripts/lib/views/messages/saving-message";
import MessageBox from "../../../../app/scripts/lib/views/common/message-box";

describe("SavingMessage", () => {
  describe("#render", () => {
    it("renders MessageBox", () => {
      const actual = shallow(<SavingMessage />);
      const expected = (<MessageBox message="saving" icon="circle-o-notch" spin />);
      assert.reactEqual(actual, expected);
    });
  });
});
