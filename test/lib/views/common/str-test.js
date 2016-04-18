import React from "react";
import { assert, render, sinon } from "../../../common";
import Str from "../../../../app/scripts/lib/views/common/str";

describe("Str", () => {
  describe("#render", () => {
    it("renders translated string", () => {
      chrome.i18n.getMessage
        .withArgs(sinon.match("hello"), sinon.match.any)
        .returns("Hello message");

      const actual = render(<Str name="hello" />);
      const expected = (<span>Hello message</span>);
      assert.reactEqual(actual, expected);
    });

    it("renders translated string with defaults", () => {
      const actual = render(<Str name="hello" defaults="Default message" />);
      const expected = (<span>Default message</span>);
      assert.reactEqual(actual, expected);
    });

    it("renders translated string with args", () => {
      chrome.i18n.getMessage
        .withArgs(sinon.match("hello"), sinon.match(["one", "two"]))
        .returns("Hello message");

      const actual = render(<Str name="hello" args={["one", "two"]} />);
      const expected = (<span>Hello message</span>);
      assert.reactEqual(actual, expected);
    });

    it("renders other props", () => {
      chrome.i18n.getMessage
        .withArgs(sinon.match("helloWorld"), sinon.match.any)
        .returns("Hello message");

      const actual = render(<Str className="foo" id="bar">hello world</Str>);
      const expected = (<span className="foo" id="bar">Hello message</span>);
      assert.reactEqual(actual, expected);
    });
  });
});
