import React from "react";
import { assert, shallow, sinon } from "../../../common";
import OptionButton from "../../../../app/scripts/lib/views/popup/option-button";

describe("OptionButton", () => {
  describe("#render", () => {
    it("renders .option-button", () => {
      chrome.i18n.getMessage
        .withArgs(sinon.match("openOptions"), sinon.match.any)
        .returns("Open Options Test");
      chrome.i18n.getMessage
        .withArgs(sinon.match("options"), sinon.match.any)
        .returns("Options Test");

      const actual = shallow(<OptionButton />);
      assert(actual.type() === "button");
      assert(actual.hasClass("option-button"));
      assert(actual.prop("title") === "Open Options Test");
      assert(actual.text() === "<Icon /> Options Test");

      const icon = actual.find("Icon");
      assert(icon.length === 1);
      assert(icon.prop("name") === "cog");
    });

    it("handles onClick by opening options page", () => {
      const element = shallow(<OptionButton />);
      element.simulate("click");

      assert(chrome.runtime.openOptionsPage.calledOnce);
    });
  });
});
