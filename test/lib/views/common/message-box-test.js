import React from "react";
import { assert, render } from "../../../common";
import { Str, Icon } from "../../../../app/scripts/lib/views/common";
import MessageBox from "../../../../app/scripts/lib/views/common/message-box";

describe("MessageBox", () => {
  describe("#render", () => {
    it("renders .message-box", () => {
      const actual = render(<MessageBox message="helloTest" icon="check" />);
      assert(actual.hasClassName("message-box"));
      assert(actual.hasClassName("message-box--hello-test-message"));

      const icon = actual.findByClassName("message-box__icon");
      assert.reactEqual(icon.children, <Icon name="check" />);

      const text = actual.findByClassName("message-box__text");
      assert.reactEqual(text.children, <Str name="helloTest" />);
    });

    it("renders details if given", () => {
      const actual = render(
        <MessageBox message="helloTest" icon="check" details="Details test" />
      );
      const details = actual.findByClassName("message-box__details");
      assert(details.children === "Details test");
    });

    it("renders children", () => {
      const testChild = <p className="testChild">Test children</p>;
      const actual = render(
        <MessageBox message="helloTest" icon="check">{testChild}</MessageBox>
      );
      const children = actual.findByClassName("testChild");
      assert.reactEqual(children, testChild);
    });
  });
});
