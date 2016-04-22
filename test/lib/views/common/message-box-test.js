import React from "react";
import { assert, shallow } from "../../../common";
import { Str, Icon } from "../../../../app/scripts/lib/views/common";
import MessageBox from "../../../../app/scripts/lib/views/common/message-box";

describe("MessageBox", () => {
  describe("#render", () => {
    it("renders .message-box", () => {
      const actual = shallow(<MessageBox message="helloTest" icon="check" />);
      assert(actual.hasClass("message-box"));
      assert(actual.hasClass("message-box--hello-test-message"));

      const icon = actual.find(".message-box__icon");
      assert.reactEqual(icon.find("Icon"), <Icon name="check" />);

      const text = actual.find(".message-box__text");
      assert.reactEqual(text.find("Str"), <Str name="helloTest" />);
    });

    it("renders details if given", () => {
      const actual = shallow(
        <MessageBox message="helloTest" icon="check" details="Details test" />
      );
      const details = actual.find(".message-box__details");
      assert(details.text() === "Details test");
    });

    it("renders children", () => {
      const testChild = <p className="testChild">Test children</p>;
      const actual = shallow(
        <MessageBox message="helloTest" icon="check">{testChild}</MessageBox>
      );
      const children = actual.find(".testChild");
      assert.reactEqual(children, testChild);
    });
  });
});
