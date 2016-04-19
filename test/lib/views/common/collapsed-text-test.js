import React from "react";
import { assert, render } from "../../../common";
import CollapsedText from "../../../../app/scripts/lib/views/common/collapsed-text";

describe("CollapsedText", () => {
  describe("#render", () => {
    it("renders expanded={false}", () => {
      const actual = render(
        <CollapsedText expanded={false}>Test text</CollapsedText>
      );
      const expected = (
        <div className="collapsed-text collapsed-text--collapsed">Test text</div>
      );
      assert.reactEqual(actual, expected);
    });

    it("renders expanded={true}", () => {
      const actual = render(
        <CollapsedText expanded>Test text</CollapsedText>
      );
      const expected = (
        <div className="collapsed-text collapsed-text--expanded">Test text</div>
      );
      assert.reactEqual(actual, expected);
    });

    it("does not handle onClick with expanded prop", () => {
      const element = render(<CollapsedText expanded>Test</CollapsedText>);
      element.props.onClick();
      element.render();
      assert(element.props.className === "collapsed-text collapsed-text--expanded");
    });

    it("renders defaultExpanded={false}", () => {
      const actual = render(
        <CollapsedText defaultExpanded={false}>Test text</CollapsedText>
      );
      const expected = (
        <div className="collapsed-text collapsed-text--collapsed">Test text</div>
      );
      assert.reactEqual(actual, expected);
    });

    it("renders defaultExpanded={true}", () => {
      const actual = render(
        <CollapsedText defaultExpanded>Test text</CollapsedText>
      );
      const expected = (
        <div className="collapsed-text collapsed-text--expanded">Test text</div>
      );
      assert.reactEqual(actual, expected);
    });

    it("handles onClick to toggle expanded with defaultExpanded prop", () => {
      const element = render(<CollapsedText defaultExpanded>Test</CollapsedText>);
      element.props.onClick();
      element.render();
      assert(element.hasClassName("collapsed-text--collapsed"));
      assert(!element.hasClassName("collapsed-text--expanded"));

      element.props.onClick();
      element.render();
      assert(!element.hasClassName("collapsed-text--collapsed"));
      assert(element.hasClassName("collapsed-text--expanded"));
    });
  });
});
