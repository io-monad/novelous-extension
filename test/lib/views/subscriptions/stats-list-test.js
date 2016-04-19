import React from "react";
import { assert, render, factory } from "../../../common";
import StatsList from
  "../../../../app/scripts/lib/views/subscriptions/stats-list";

describe("StatsList", () => {
  describe("#render", () => {
    let stats;
    let statsLog;
    let actual;
    beforeEach(() => {
      const sub = factory.buildSync("statsSubscription");
      stats = sub.items[0].stats;
      statsLog = sub.statsLogs[sub.items[0].id];
      actual = render(<StatsList stats={stats} statsLog={statsLog} />);
    });

    it("renders .stats-list", () => {
      assert(actual.hasClassName("stats-list"));
    });

    it("renders items", () => {
      const items = actual.findAllByTagName("StatsItem");
      assert(items.length === stats.length);
      items.forEach((item, i) => {
        assert(item.key === stats[i].key);
        assert(item.props.stat === stats[i]);
        assert(item.props.values === statsLog.stats[stats[i].key]);
      });
    });
  });
});
