import React from "react";
import { assert, shallow } from "../../../common";
import LoginRequiredMessage from
  "../../../../app/scripts/lib/views/messages/login-required-message";

describe("LoginRequiredMessage", () => {
  describe("#render", () => {
    it("renders MessageBox", () => {
      const actual = shallow(<LoginRequiredMessage />);
      assert(actual.type().name === "MessageBox");
      assert(actual.prop("message") === "loginRequired");
      assert(actual.prop("icon") === "user-times");

      const sites = actual.find(".sites");
      assert(sites.length > 0);
      assert(sites.children().length > 0);

      sites.children().forEach(link => {
        assert(link.type() === "a");
        assert(/^https?:/.test(link.prop("href")));
        assert(link.prop("target") === "_blank");
        assert(link.find("SiteIcon").length > 0);
        assert(link.find("Str").length > 0);
      });
    });
  });
});
