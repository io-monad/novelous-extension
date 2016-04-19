import React from "react";
import { assert, render, factory } from "../../../common";
import ItemsSubscriptionFlatItems from
  "../../../../app/scripts/lib/views/subscriptions/items-subscription-flat-items";

describe("ItemsSubscriptionFlatItems", () => {
  describe("#render", () => {
    let subs;
    let actual;
    beforeEach(async () => {
      subs = await factory.buildMany("itemsSubscription", 3);
      actual = render(
        <ItemsSubscriptionFlatItems subscriptions={subs} unreadItemIds={{}} />
      );
    });

    it("renders .items-subscription-flat-items", () => {
      assert(actual.hasClassName("items-subscription-flat-items"));
    });

    it("renders list of ItemsSubscriptionItem", () => {
      const items = actual.findAllByTagName("ItemsSubscriptionItem");
      assert(items.length === subs.length * subs[0].items.length);
    });
  });
});
