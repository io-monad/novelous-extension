import React from "react";
import { assert, shallow } from "../../../common";
import Dashboard from "../../../../app/scripts/lib/views/popup/dashboard";
import Subscriber from "../../../../app/scripts/lib/subscriptions/subscriber";

describe("Dashboard", () => {
  describe("#render", () => {
    it("renders .dashboard", () => {
      const actual = shallow(
        <Dashboard subscriber={new Subscriber()} unreadItemIds={{}} />
      );
      assert(actual.hasClass("dashboard"));

      const items = actual.find("ItemsSubscriptionFlatItems");
      assert(items.length === 1);
      assert(items.prop("unreadOnly") === true);

      const stats = actual.find("StatsSubscriptionFlatItems");
      assert(stats.length === 1);
    });
  });
});
