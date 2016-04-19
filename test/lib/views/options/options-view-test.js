import React from "react";
import { assert, render } from "../../../common";
import OptionsView from "../../../../app/scripts/lib/views/options/options-view";

describe("OptionsView", () => {
  describe("#render", () => {
    it("renders .options-view", () => {
      const props = {
        controller: {},
        schema: { type: "object" },
        uiSchema: {},
        formData: {},
      };

      const actual = render(<OptionsView {...props} />);
      assert(actual.hasClassName("options-view"));
      assert(actual.children.tagName === "OptionsForm");
    });
  });
});
