import React from "react";
import { assert, shallow, factory } from "../../../common";
import ItemsSubscriptionCategories from
  "../../../../app/scripts/lib/views/subscriptions/items-subscription-categories";

describe("ItemsSubscriptionCategories", () => {
  describe("#render", () => {
    let subs;
    let actual;
    beforeEach(() => {
      subs = factory.buildManySync(3, "itemsSubscription");
      actual = shallow(
        <ItemsSubscriptionCategories subscriptions={subs} unreadItemIds={{}} />
      );
    });

    it("renders .items-subscription-categories", () => {
      assert(actual.hasClass("items-subscription-categories"));
    });

    it("renders items", () => {
      const items = actual.find("ItemsSubscriptionCategory");
      assert(items.length === subs.length);
    });
  });
});
