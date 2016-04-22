import React from "react";
import Form from "react-jsonschema-form";
import { assert, shallow, sinon } from "../../../common";
import OptionsForm from "../../../../app/scripts/lib/views/options/options-form";
import AppVars from "../../../../app/scripts/lib/app/app-vars";

describe("OptionsForm", () => {
  describe("#render", () => {
    let props;
    let actual;
    beforeEach(() => {
      props = {
        schema: { type: "object" },
        uiSchema: {},
        formData: {},
        onSubmit: sinon.spy(),
      };
      actual = shallow(<OptionsForm {...props} />);
    });

    it("renders .options-form", () => {
      assert(actual.hasClass("options-form"));
    });

    it("renders Form", () => {
      const form = actual.find("Form");
      assert(form.length === 1);
      assert(form.type() === Form);
      assert(form.prop("schema") === props.schema);
      assert(form.prop("uiSchema") === props.uiSchema);
      assert(form.prop("formData") === props.formData);
      assert(form.prop("onSubmit") === props.onSubmit);
    });

    it("renders BrandLink", () => {
      const brandLink = actual.find("BrandLink");
      assert(brandLink.length === 1);
      assert(brandLink.prop("showVersion") === true);
    });

    it("renders footer links", () => {
      const footer = actual.find(".options-form__footer");
      assert(footer.length === 1);

      const links = footer.find("Link");
      assert(links.length === 2);
      assert(links.at(0).prop("href") === AppVars.twitterUrl);
      assert(links.at(1).prop("href") === AppVars.githubUrl);
    });
  });
});
