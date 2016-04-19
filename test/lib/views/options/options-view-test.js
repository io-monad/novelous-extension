import React from "react";
import { assert, render, sinon } from "../../../common";
import OptionsView from "../../../../app/scripts/lib/views/options/options-view";

describe("OptionsView", () => {
  describe("#render", () => {
    let props;
    let actual;
    beforeEach(() => {
      props = {
        controller: { saveOptions: sinon.spy() },
        schema: { type: "object" },
        uiSchema: {},
        formData: {},
      };
      actual = render(<OptionsView {...props} />);
    });

    it("renders .options-view", () => {
      assert(actual.hasClassName("options-view"));
    });

    it("renders OptionsForm", () => {
      const form = actual.findByTagName("OptionsForm");
      assert(form);
      assert(form.props.schema === props.schema);
      assert(form.props.uiSchema === props.uiSchema);
      assert(form.props.formData === props.formData);
    });

    it("handles onSubmit by calling controller.saveOptions", () => {
      const form = actual.findByTagName("OptionsForm");
      const newFormData = { foo: "bar" };
      form.props.onSubmit({ formData: newFormData });

      assert(props.controller.saveOptions.calledOnce);
      assert(props.controller.saveOptions.args[0][0] === newFormData);
    });
  });
});
