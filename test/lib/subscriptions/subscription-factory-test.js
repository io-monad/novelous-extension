import { assert, factory } from "../../common";
import SubscriptionFactory from "../../../app/scripts/lib/subscriptions/subscription-factory";
import ItemsSubscription from "../../../app/scripts/lib/subscriptions/subscription/items";

describe("SubscriptionFactory", () => {
  describe(".create", () => {
    it("returns ItemsSubscription", () => {
      const data = factory.buildSync("itemsSubscriptionData");
      const created = SubscriptionFactory.create(data);
      assert(created instanceof ItemsSubscription);
    });
  });
});
