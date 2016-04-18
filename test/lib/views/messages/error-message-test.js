import React from "react";
import { assert, render } from "../../../common";
import ErrorMessage from "../../../../app/scripts/lib/views/messages/error-message";
import MessageBox from "../../../../app/scripts/lib/views/common/message-box";

describe("ErrorMessage", () => {
  describe("#render", () => {
    it("renders MessageBox", () => {
      const actual = render(<ErrorMessage />);
      const expected = (
        <MessageBox
          message="wentWrong"
          details={null}
          icon="exclamation-triangle"
        />
      );
      assert.reactEqual(actual, expected);
    });
  });
});
