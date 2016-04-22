import React from "react";
import { assert, shallow, factory } from "../../../common";
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
      actual = shallow(<StatsList stats={stats} statsLog={statsLog} />);
    });

    it("renders .stats-list", () => {
      assert(actual.hasClass("stats-list"));
    });

    it("renders items", () => {
      const items = actual.find("StatsItem");
      assert(items.length === stats.length);
      items.forEach((item, i) => {
        assert(item.node.key === stats[i].key);
        assert(item.prop("stat") === stats[i]);
        assert(item.prop("values") === statsLog.stats[stats[i].key]);
      });
    });
  });
});
