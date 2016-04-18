import React from "react";
import { assert, render } from "../../../common";
import { Str, Icon } from "../../../../app/scripts/lib/views/common";
import MessageBox from "../../../../app/scripts/lib/views/common/message-box";

describe("MessageBox", () => {
  describe("#render", () => {
    it("renders .message-box", () => {
      const actual = render(<MessageBox message="helloTest" icon="check" />);
      const expected = (
        <div className="message-box message-box--hello-test-message">
          <div className="message-box__icon">
            <Icon name="check" />
          </div>
          <p className="message-box__text">
            <Str name="helloTest" />
          </p>
        </div>
      );
      assert.reactEqual(actual, expected);
    });

    it("renders details if given", () => {
      const actual = render(
        <MessageBox message="helloTest" icon="check" details="Details test" />
      );
      const expected = (
        <div className="message-box message-box--hello-test-message">
          <div className="message-box__icon">
            <Icon name="check" />
          </div>
          <p className="message-box__text">
            <Str name="helloTest" />
          </p>
          <p className="message-box__details">Details test</p>
        </div>
      );
      assert.reactEqual(actual, expected);
    });

    it("renders children", () => {
      const actual = render(
        <MessageBox message="helloTest" icon="check">Test children</MessageBox>
      );
      const expected = (
        <div className="message-box message-box--hello-test-message">
          <div className="message-box__icon">
            <Icon name="check" />
          </div>
          <p className="message-box__text">
            <Str name="helloTest" />
          </p>
          Test children
        </div>
      );
      assert.reactEqual(actual, expected);
    });
  });
});
