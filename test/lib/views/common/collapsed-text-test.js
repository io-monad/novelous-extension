import React from "react";
import { assert, render } from "../../../common";
import CollapsedText from "../../../../app/scripts/lib/views/common/collapsed-text";

describe("CollapsedText", () => {
  describe("#render", () => {
    it("renders expanded={false}", () => {
      const actual = render(
        <CollapsedText expanded={false}>Test text</CollapsedText>
      );
      assert(actual.hasClassName("collapsed-text"));
      assert(actual.hasClassName("collapsed-text--collapsed"));
      assert(!actual.hasClassName("collapsed-text--expanded"));
      assert(actual.text === "Test text");
    });

    it("renders expanded={true}", () => {
      const actual = render(
        <CollapsedText expanded>Test text</CollapsedText>
      );
      assert(!actual.hasClassName("collapsed-text--collapsed"));
      assert(actual.hasClassName("collapsed-text--expanded"));
    });

    it("does not handle onClick with expanded prop", () => {
      const actual = render(<CollapsedText expanded>Test</CollapsedText>);
      actual.props.onClick();
      actual.render();
      assert(!actual.hasClassName("collapsed-text--collapsed"));
      assert(actual.hasClassName("collapsed-text--expanded"));
    });

    it("renders defaultExpanded={false}", () => {
      const actual = render(
        <CollapsedText defaultExpanded={false}>Test text</CollapsedText>
      );
      assert(actual.hasClassName("collapsed-text--collapsed"));
      assert(!actual.hasClassName("collapsed-text--expanded"));
    });

    it("renders defaultExpanded={true}", () => {
      const actual = render(
        <CollapsedText defaultExpanded>Test text</CollapsedText>
      );
      assert(!actual.hasClassName("collapsed-text--collapsed"));
      assert(actual.hasClassName("collapsed-text--expanded"));
    });

    it("handles onClick to toggle expanded with defaultExpanded prop", () => {
      const actual = render(<CollapsedText defaultExpanded>Test</CollapsedText>);
      actual.props.onClick();
      actual.render();
      assert(actual.hasClassName("collapsed-text--collapsed"));
      assert(!actual.hasClassName("collapsed-text--expanded"));

      actual.props.onClick();
      actual.render();
      assert(!actual.hasClassName("collapsed-text--collapsed"));
      assert(actual.hasClassName("collapsed-text--expanded"));
    });
  });
});
