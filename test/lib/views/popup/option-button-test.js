import React from "react";
import { assert, render, sinon } from "../../../common";
import OptionButton from "../../../../app/scripts/lib/views/popup/option-button";
import { Icon } from "../../../../app/scripts/lib/views/common";

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
      const expected = (
        <button
          title="Open Options Test"
          className="option-button btn btn-sm btn-link"
        >
          <Icon name="cog" />
          {" Options Test"}
        </button>
      );
      assert.reactEqual(actual, expected);
    });

    it("handles onClick by opening options page", () => {
      const element = render(<OptionButton />);
      element.props.onClick();

      assert(chrome.runtime.openOptionsPage.calledOnce);
    });
  });
});
