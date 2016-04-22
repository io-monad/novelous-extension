import React from "react";
import { assert, shallow } from "../../../common";
import PopupView from "../../../../app/scripts/lib/views/popup/popup-view";
import Subscriber from "../../../../app/scripts/lib/subscriptions/subscriber";

describe("PopupView", () => {
  describe("#render", () => {
    let actual;
    beforeEach(() => {
      actual = shallow(
        <PopupView subscriber={new Subscriber()} unreadItemIds={{}} />
      );
    });

    it("renders .popup-view", () => {
      assert(actual.hasClass("popup-view"));
      assert(actual.find("BrandLink").length === 1);
      assert(actual.find("OptionButton").length === 1);
    });

    it("renders Dashboard first", () => {
      assert(actual.childAt(1).type().name === "Dashboard");
    });

    it("switches content by view mode change", () => {
      const vms = actual.find("ViewModeSwitch");

      vms.simulate("change", "events");
      assert(actual.childAt(1).type().name === "ItemsSubscriptionFlatItems");

      vms.simulate("change", "categories");
      assert(actual.childAt(1).type().name === "ItemsSubscriptionCategories");

      vms.simulate("change", "dashboard");
      assert(actual.childAt(1).type().name === "Dashboard");
    });
  });
});
