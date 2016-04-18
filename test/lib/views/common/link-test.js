import React from "react";
import { assert, render, sinon } from "../../../common";
import Link from "../../../../app/scripts/lib/views/common/link";

describe("Link", () => {
  describe("#render", () => {
    it("renders link without href and title", () => {
      const actual = render(<Link>Test Link</Link>);
      const expected = (<span>Test Link</span>);
      assert.reactEqual(actual, expected);
    });

    it("renders link with title", () => {
      const actual = render(<Link title="Test title" />);
      const expected = (<span title="Test title">Test title</span>);
      assert.reactEqual(actual, expected);
    });

    it("renders link with href", () => {
      const actual = render(
        <Link href="about:blank" title="Test title">Test link</Link>
      );
      const expected = (
        <a href="about:blank" title="Test title" target="_blank">Test link</a>
      );
      assert.reactEqual(actual, expected);
    });

    it("handles onClick event by stopPropagation", () => {
      const event = { stopPropagation: sinon.spy() };
      const actual = render(<Link href="about:blank">Test</Link>);
      actual.props.onClick(event);
      assert(event.stopPropagation.calledOnce);
    });
  });
});
