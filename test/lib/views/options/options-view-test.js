import React from "react";
import { assert, render } from "../../../common";
import OptionsView from "../../../../app/scripts/lib/views/options/options-view";
import OptionsForm from "../../../../app/scripts/lib/views/options/options-form";

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
      assert(actual.props.className === "options-view");
      assert(actual.props.children.type === (<OptionsForm {...props} />).type);
    });
  });
});
