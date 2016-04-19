import React from "react";
import { assert, render } from "../../../common";
import PopupView from "../../../../app/scripts/lib/views/popup/popup-view";
import Subscriber from "../../../../app/scripts/lib/subscriptions/subscriber";

describe("PopupView", () => {
  describe("#render", () => {
    let actual;
    beforeEach(() => {
      actual = render(
        <PopupView subscriber={new Subscriber()} unreadItemIds={{}} />
      );
    });

    it("renders .popup-view", () => {
      assert(actual.hasClassName("popup-view"));
      assert(actual.findByTagName("BrandLink"));
      assert(actual.findByTagName("OptionButton"));
    });

    it("renders Dashboard first", () => {
      assert(actual.children[1].tagName === "Dashboard");
    });

    it("switches content by view mode change", () => {
      const vms = actual.findByTagName("ViewModeSwitch");

      vms.props.onChange("events");
      actual.render();
      assert(actual.children[1].tagName === "ItemsSubscriptionFlatItems");

      vms.props.onChange("categories");
      actual.render();
      assert(actual.children[1].tagName === "ItemsSubscriptionCategories");

      vms.props.onChange("dashboard");
      actual.render();
      assert(actual.children[1].tagName === "Dashboard");
    });
  });
});
