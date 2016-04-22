import React from "react";
import { assert, shallow } from "../../../common";
import CollapsedText from "../../../../app/scripts/lib/views/common/collapsed-text";

describe("CollapsedText", () => {
  describe("#render", () => {
    it("renders expanded={false}", () => {
      const actual = shallow(
        <CollapsedText expanded={false}>Test text</CollapsedText>
      );
      assert(actual.hasClass("collapsed-text"));
      assert(actual.hasClass("collapsed-text--collapsed"));
      assert(!actual.hasClass("collapsed-text--expanded"));
      assert(actual.text() === "Test text");
    });

    it("renders expanded={true}", () => {
      const actual = shallow(
        <CollapsedText expanded>Test text</CollapsedText>
      );
      assert(!actual.hasClass("collapsed-text--collapsed"));
      assert(actual.hasClass("collapsed-text--expanded"));
    });

    it("does not handle onClick with expanded prop", () => {
      const actual = shallow(<CollapsedText expanded>Test</CollapsedText>);
      actual.simulate("click");
      assert(!actual.hasClass("collapsed-text--collapsed"));
      assert(actual.hasClass("collapsed-text--expanded"));
    });

    it("renders defaultExpanded={false}", () => {
      const actual = shallow(
        <CollapsedText defaultExpanded={false}>Test text</CollapsedText>
      );
      assert(actual.hasClass("collapsed-text--collapsed"));
      assert(!actual.hasClass("collapsed-text--expanded"));
    });

    it("renders defaultExpanded={true}", () => {
      const actual = shallow(
        <CollapsedText defaultExpanded>Test text</CollapsedText>
      );
      assert(!actual.hasClass("collapsed-text--collapsed"));
      assert(actual.hasClass("collapsed-text--expanded"));
    });

    it("handles onClick to toggle expanded with defaultExpanded prop", () => {
      const actual = shallow(<CollapsedText defaultExpanded>Test</CollapsedText>);
      actual.simulate("click");
      assert(actual.hasClass("collapsed-text--collapsed"));
      assert(!actual.hasClass("collapsed-text--expanded"));

      actual.simulate("click");
      assert(!actual.hasClass("collapsed-text--collapsed"));
      assert(actual.hasClass("collapsed-text--expanded"));
    });
  });
});
