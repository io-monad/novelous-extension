import React from "react";
import { assert, shallow, factory } from "../../../common";
import StatsSubscriptionItem from
  "../../../../app/scripts/lib/views/subscriptions/stats-subscription-item";

describe("StatsSubscriptionItem", () => {
  describe("#render", () => {
    let sub;
    let item;
    let actual;
    beforeEach(() => {
      sub = factory.buildSync("statsSubscription");
      item = sub.items[0];
      actual = shallow(<StatsSubscriptionItem subscription={sub} item={item} />);
    });

    context("collapsed", () => {
      it("renders .stats-subscription-item", () => {
        assert(actual.hasClass("stats-subscription-item"));
      });

      it("is collapsed by default", () => {
        assert(actual.hasClass("stats-subscription-item--collapsed"));
        assert(!actual.hasClass("stats-subscription-item--expanded"));
      });

      it("toggles expanded on clicked", () => {
        actual.simulate("click");
        assert(!actual.hasClass("stats-subscription-item--collapsed"));
        assert(actual.hasClass("stats-subscription-item--expanded"));
      });

      it("renders title", () => {
        const title = actual.find(".stats-subscription-item__title");
        assert(title.length === 1);

        const icon = title.find("SiteIcon");
        assert(icon.length === 1);
        assert(icon.prop("name") === sub.siteId);

        const link = title.find("Link");
        assert(link.length === 1);
        assert(link.prop("href") === item.url);
        assert(link.prop("title") === item.title);
      });

      it("renders body", () => {
        const body = actual.find(".stats-subscription-item__body");
        assert(body.length === 1);

        const statsList = body.find("StatsList");
        assert(statsList.length === 1);
        assert(statsList.prop("stats") === item.stats);
        assert(statsList.prop("statsLog") === sub.statsLogs[item.id]);
      });

      it("renders time", () => {
        const time = actual.find(".stats-subscription-item__time");
        assert(time.length === 1);

        const timeel = actual.find("Time");
        assert(timeel.length === 1);
        assert(timeel.prop("value") === sub.lastUpdatedAt);
      });

      it("renders link list", () => {
        const linkList = actual.find("LinkList");
        assert(linkList.length === 1);
        assert(linkList.prop("links") === item.links);
      });
    });

    context("expanded", () => {
      beforeEach(() => {
        actual.simulate("click");
      });

      it("is expanded", () => {
        assert(!actual.hasClass("stats-subscription-item--collapsed"));
        assert(actual.hasClass("stats-subscription-item--expanded"));
      });

      it("toggles expanded on clicked", () => {
        actual.simulate("click");
        assert(actual.hasClass("stats-subscription-item--collapsed"));
        assert(!actual.hasClass("stats-subscription-item--expanded"));
      });

      it("renders chart list", () => {
        const chartList = actual.find("StatsChartList");
        assert(chartList.length === 1);
        assert(chartList.prop("stats") === item.stats);
        assert(chartList.prop("statsLog") === sub.statsLogs[item.id]);
      });
    });
  });
});
