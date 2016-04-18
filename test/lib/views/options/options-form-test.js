import React from "react";
import Form from "react-jsonschema-form";
import { assert, render } from "../../../common";
import OptionsForm from "../../../../app/scripts/lib/views/options/options-form";

describe("OptionsForm", () => {
  describe("#render", () => {
    it("renders .options-form", () => {
      const props = {
        schema: { type: "object" },
        uiSchema: {},
        formData: {},
        onSubmit: () => {},
      };

      const actual = render(<OptionsForm {...props} />);
      assert(actual.props.className === "options-form");
      assert(actual.props.children.type === (<Form {...props} />).type);
    });
  });
});
