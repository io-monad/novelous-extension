import React from "react";
import { assert, render } from "../../../common";
import LoginRequiredMessage from
  "../../../../app/scripts/lib/views/messages/login-required-message";

describe("LoginRequiredMessage", () => {
  describe("#render", () => {
    it("renders MessageBox", () => {
      const actual = render(<LoginRequiredMessage />);
      assert(actual.tagName === "MessageBox");
      assert(actual.props.message === "loginRequired");
      assert(actual.props.icon === "user-times");

      assert(actual.children.hasClassName("sites"));
      assert(actual.children.children.length > 0);

      actual.children.children.forEach(link => {
        assert(link.tagName === "a");
        assert(/^https?:/.test(link.props.href));
        assert(link.props.target === "_blank");
        assert(link.findByTagName("SiteIcon"));
        assert(link.findByTagName("Str"));
      });
    });
  });
});
