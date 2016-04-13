import { test, factory } from "../../common";
import SubscriptionFactory from "../../../app/scripts/lib/subscriptions/subscription-factory";
import ItemsSubscription from "../../../app/scripts/lib/subscriptions/subscription/items";

test(".create returns ItemsSubscription", t => {
  const data = factory.buildSync("itemsSubscriptionData");
  const created = SubscriptionFactory.create(data);
  t.true(created instanceof ItemsSubscription);
});
