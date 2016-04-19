import React from "react";
import { assert, render, sinon } from "../../../common";
import ViewModeSwitch from "../../../../app/scripts/lib/views/popup/view-mode-switch";

describe("ViewModeSwitch", () => {
  describe("#render", () => {
    let onChange;
    let actual;
    beforeEach(() => {
      onChange = sinon.spy();
      actual = render(
        <ViewModeSwitch viewMode="dashboard" onChange={onChange} />
      );
    });

    it("renders .view-mode-switch", () => {
      assert(actual.hasClassName("view-mode-switch"));
      assert(actual.children.length === ViewModeSwitch.viewModes.length);

      actual.children.forEach((child, i) => {
        const mode = ViewModeSwitch.viewModes[i];
        assert(child.props.title === mode.title);
        assert(child.hasClassName("view-mode-switch__item"));
        assert(child.hasClassName("active") === (mode.name === "dashboard"));
      });
    });

    it("handles button onClick by passing mode name", () => {
      actual.children[1].props.onClick();
      assert(onChange.calledOnce);
      assert(onChange.args[0][0] === ViewModeSwitch.viewModes[1].name);
    });
  });
});
