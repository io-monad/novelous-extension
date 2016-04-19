import React from "react";
import { assert, render, factory } from "../../../common";
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
      actual = render(<StatsSubscriptionItem subscription={sub} item={item} />);
    });

    context("collapsed", () => {
      it("renders .stats-subscription-item", () => {
        assert(actual.hasClassName("stats-subscription-item"));
      });

      it("is collapsed by default", () => {
        assert(actual.hasClassName("stats-subscription-item--collapsed"));
        assert(!actual.hasClassName("stats-subscription-item--expanded"));
      });

      it("toggles expanded on clicked", () => {
        actual.props.onClick();
        actual.render();
        assert(!actual.hasClassName("stats-subscription-item--collapsed"));
        assert(actual.hasClassName("stats-subscription-item--expanded"));
      });

      it("renders title", () => {
        const title = actual.findByClassName("stats-subscription-item__title");
        assert(title);

        const icon = title.findByTagName("SiteIcon");
        assert(icon);
        assert(icon.props.name === sub.siteId);

        const link = title.findByTagName("Link");
        assert(link);
        assert(link.props.href === item.url);
        assert(link.props.title === item.title);
      });

      it("renders body", () => {
        const body = actual.findByClassName("stats-subscription-item__body");
        assert(body);

        const statsList = body.findByTagName("StatsList");
        assert(statsList);
        assert(statsList.props.stats === item.stats);
        assert(statsList.props.statsLog === sub.statsLogs[item.id]);
      });

      it("renders time", () => {
        const time = actual.findByClassName("stats-subscription-item__time");
        assert(time);

        const timeel = actual.findByTagName("Time");
        assert(timeel);
        assert(timeel.props.value === sub.lastUpdatedAt);
      });

      it("renders link list", () => {
        const linkList = actual.findByTagName("LinkList");
        assert(linkList);
        assert(linkList.props.links === item.links);
      });
    });

    context("expanded", () => {
      beforeEach(() => {
        actual.props.onClick();
        actual.render();
      });

      it("is expanded", () => {
        assert(!actual.hasClassName("stats-subscription-item--collapsed"));
        assert(actual.hasClassName("stats-subscription-item--expanded"));
      });

      it("toggles expanded on clicked", () => {
        actual.props.onClick();
        actual.render();
        assert(actual.hasClassName("stats-subscription-item--collapsed"));
        assert(!actual.hasClassName("stats-subscription-item--expanded"));
      });

      it("renders chart list", () => {
        const chartList = actual.findByTagName("StatsChartList");
        assert(chartList);
        assert(chartList.props.stats === item.stats);
        assert(chartList.props.statsLog === sub.statsLogs[item.id]);
      });
    });
  });
});
