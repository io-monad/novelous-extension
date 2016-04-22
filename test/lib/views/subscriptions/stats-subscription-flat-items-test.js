import React from "react";
import { assert, shallow, factory } from "../../../common";
import StatsSubscriptionFlatItems from
  "../../../../app/scripts/lib/views/subscriptions/stats-subscription-flat-items";

describe("StatsSubscriptionFlatItems", () => {
  describe("#render", () => {
    context("with subscriptions", () => {
      let subs;
      let actual;
      beforeEach(() => {
        subs = factory.buildManySync(3, "statsSubscription");
        actual = shallow(<StatsSubscriptionFlatItems subscriptions={subs} />);
      });

      it("renders .stats-subscription-flat-items", () => {
        assert(actual.hasClass("stats-subscription-flat-items"));
      });

      it("renders items", () => {
        const items = actual.find("StatsSubscriptionItem");
        assert(items.length === subs.length * subs[0].items.length);
      });
    });

    context("with no subscriptions", () => {
      let actual;
      beforeEach(() => {
        actual = shallow(<StatsSubscriptionFlatItems subscriptions={[]} />);
      });

      it("renders null", () => {
        assert(actual.type() === null);
      });
    });
  });
});
