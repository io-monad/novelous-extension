import React from "react";
import { assert, render, factory } from "../../../common";
import StatsSubscriptionFlatItems from
  "../../../../app/scripts/lib/views/subscriptions/stats-subscription-flat-items";

describe("StatsSubscriptionFlatItems", () => {
  describe("#render", () => {
    context("with subscriptions", () => {
      let subs;
      let actual;
      beforeEach(() => {
        subs = factory.buildManySync(3, "statsSubscription");
        actual = render(<StatsSubscriptionFlatItems subscriptions={subs} />);
      });

      it("renders .stats-subscription-flat-items", () => {
        assert(actual.hasClassName("stats-subscription-flat-items"));
      });

      it("renders items", () => {
        const items = actual.findAllByTagName("StatsSubscriptionItem");
        assert(items.length === subs.length * subs[0].items.length);
      });
    });

    context("with no subscriptions", () => {
      let actual;
      beforeEach(() => {
        actual = render(<StatsSubscriptionFlatItems subscriptions={[]} />);
      });

      it("renders null", () => {
        assert(actual === null);
      });
    });
  });
});
