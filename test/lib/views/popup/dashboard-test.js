import React from "react";
import { assert, render } from "../../../common";
import Dashboard from "../../../../app/scripts/lib/views/popup/dashboard";
import Subscriber from "../../../../app/scripts/lib/subscriptions/subscriber";

describe("Dashboard", () => {
  describe("#render", () => {
    it("renders .dashboard", () => {
      const actual = render(
        <Dashboard subscriber={new Subscriber()} unreadItemIds={{}} />
      );
      assert(actual.hasClassName("dashboard"));

      const items = actual.findByTagName("ItemsSubscriptionFlatItems");
      assert(items);
      assert(items.props.unreadOnly === true);

      const stats = actual.findByTagName("StatsSubscriptionFlatItems");
      assert(stats);
    });
  });
});
