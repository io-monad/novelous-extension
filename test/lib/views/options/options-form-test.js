import React from "react";
import Form from "react-jsonschema-form";
import { assert, render, sinon } from "../../../common";
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
      actual = render(<OptionsForm {...props} />);
    });

    it("renders .options-form", () => {
      assert(actual.hasClassName("options-form"));
    });

    it("renders Form", () => {
      const form = actual.findByTagName("Form");
      assert(form);
      assert(form.type === Form);
      assert(form.props.schema === props.schema);
      assert(form.props.uiSchema === props.uiSchema);
      assert(form.props.formData === props.formData);
      assert(form.props.onSubmit === props.onSubmit);
    });

    it("renders BrandLink", () => {
      const brandLink = actual.findByTagName("BrandLink");
      assert(brandLink);
      assert(brandLink.props.showVersion === true);
    });

    it("renders footer links", () => {
      const footer = actual.findByClassName("options-form__footer");
      assert(footer);

      const links = footer.findAllByTagName("Link");
      assert(links.length === 2);
      assert(links[0].props.href === AppVars.twitterUrl);
      assert(links[1].props.href === AppVars.githubUrl);
    });
  });
});
