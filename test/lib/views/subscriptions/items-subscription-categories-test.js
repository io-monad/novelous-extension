import React from "react";
import { assert, render, factory } from "../../../common";
import ItemsSubscriptionCategories from
  "../../../../app/scripts/lib/views/subscriptions/items-subscription-categories";

describe("ItemsSubscriptionCategories", () => {
  describe("#render", () => {
    let subs;
    let actual;
    beforeEach(() => {
      subs = factory.buildManySync(3, "itemsSubscription");
      actual = render(
        <ItemsSubscriptionCategories subscriptions={subs} unreadItemIds={{}} />
      );
    });

    it("renders .items-subscription-categories", () => {
      assert(actual.hasClassName("items-subscription-categories"));
    });

    it("renders items", () => {
      const items = actual.findAllByTagName("ItemsSubscriptionCategory");
      assert(items.length === subs.length);
    });
  });
});
