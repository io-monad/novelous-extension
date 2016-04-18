import React from "react";
import { assert, render } from "../../../common";
import EmptyFeedsMessage from "../../../../app/scripts/lib/views/messages/empty-feeds-message";
import MessageBox from "../../../../app/scripts/lib/views/common/message-box";

describe("EmptyFeedsMessage", () => {
  describe("#render", () => {
    it("renders MessageBox", () => {
      const actual = render(<EmptyFeedsMessage />);
      const expected = (<MessageBox message="emptyFeeds" icon="meh-o" />);
      assert.reactEqual(actual, expected);
    });
  });
});
