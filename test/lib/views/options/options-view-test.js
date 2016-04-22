import React from "react";
import { assert, shallow, sinon } from "../../../common";
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
      actual = shallow(<OptionsView {...props} />);
    });

    it("renders .options-view", () => {
      assert(actual.hasClass("options-view"));
    });

    it("renders OptionsForm", () => {
      const form = actual.find("OptionsForm");
      assert(form.length > 0);
      assert(form.prop("schema") === props.schema);
      assert(form.prop("uiSchema") === props.uiSchema);
      assert(form.prop("formData") === props.formData);
    });

    it("handles onSubmit by calling controller.saveOptions", () => {
      const form = actual.find("OptionsForm");
      const newFormData = { foo: "bar" };
      form.simulate("submit", { formData: newFormData });

      assert(props.controller.saveOptions.calledOnce);
      assert(props.controller.saveOptions.args[0][0] === newFormData);
    });
  });
});
