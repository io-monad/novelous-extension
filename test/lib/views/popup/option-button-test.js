import React from "react";
import { assert, render, sinon } from "../../../common";
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

      const actual = render(<OptionButton />);
      assert(actual.tagName === "button");
      assert(actual.hasClassName("option-button"));
      assert(actual.props.title === "Open Options Test");
      assert(actual.text === " Options Test");

      const icon = actual.findByTagName("Icon");
      assert(icon);
      assert(icon.props.name === "cog");
    });

    it("handles onClick by opening options page", () => {
      const element = render(<OptionButton />);
      element.props.onClick();

      assert(chrome.runtime.openOptionsPage.calledOnce);
    });
  });
});
