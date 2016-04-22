import React from "react";
import { assert, shallow, sinon } from "../../../common";
import ViewModeSwitch from "../../../../app/scripts/lib/views/popup/view-mode-switch";

describe("ViewModeSwitch", () => {
  describe("#render", () => {
    let onChange;
    let actual;
    beforeEach(() => {
      onChange = sinon.spy();
      actual = shallow(
        <ViewModeSwitch viewMode="dashboard" onChange={onChange} />
      );
    });

    it("renders .view-mode-switch", () => {
      assert(actual.hasClass("view-mode-switch"));
      assert(actual.children().length === ViewModeSwitch.viewModes.length);

      actual.children().forEach((child, i) => {
        const mode = ViewModeSwitch.viewModes[i];
        assert(child.prop("title") === mode.title);
        assert(child.hasClass("view-mode-switch__item"));
        assert(child.hasClass("active") === (mode.name === "dashboard"));
      });
    });

    it("handles button onClick by passing mode name", () => {
      actual.childAt(1).simulate("click");
      assert(onChange.calledOnce);
      assert(onChange.args[0][0] === ViewModeSwitch.viewModes[1].name);
    });
  });
});
