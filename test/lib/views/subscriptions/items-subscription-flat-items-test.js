import React from "react";
import { assert, shallow, factory } from "../../../common";
import ItemsSubscriptionFlatItems from
  "../../../../app/scripts/lib/views/subscriptions/items-subscription-flat-items";

describe("ItemsSubscriptionFlatItems", () => {
  describe("#render", () => {
    let subs;
    let actual;
    beforeEach(async () => {
      subs = await factory.buildMany("itemsSubscription", 3);
      actual = shallow(
        <ItemsSubscriptionFlatItems subscriptions={subs} unreadItemIds={{}} />
      );
    });

    it("renders .items-subscription-flat-items", () => {
      assert(actual.hasClass("items-subscription-flat-items"));
    });

    it("renders list of ItemsSubscriptionItem", () => {
      const items = actual.find("ItemsSubscriptionItem");
      assert(items.length === subs.length * subs[0].items.length);
    });
  });
});
