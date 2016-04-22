import React from "react";
import { assert, shallow } from "../../../common";
import StatsChartList from
  "../../../../app/scripts/lib/views/subscriptions/stats-chart-list";

describe("StatsChartList", () => {
  const stats = [
    { key: "test1", label: "Test Stat1", icon: "check" },
    { key: "test2", label: "Test Stat2", icon: "user" },
    { key: "test3", label: "Test Stat3", icon: "circle" },
  ];
  const statsLog = {
    timestamps: [1, 2, 3],
    stats: {
      test1: [10, 20, 30],
      test2: [40, 50, 60],
      test3: [70, 80, 90],
    },
  };

  describe("#render", () => {
    let actual;
    beforeEach(() => {
      actual = shallow(<StatsChartList stats={stats} statsLog={statsLog} />);
    });

    it("renders .stats-chart-list", () => {
      assert(actual.hasClass("stats-chart-list"));
    });

    it("renders items", () => {
      const items = actual.find(".stats-chart-list__item");
      assert(items.length === stats.length);
      items.forEach((item, i) => {
        const title = item.find(".stats-chart-list__title");
        assert(title.length === 1);
        assert(title.childAt(1).text() === stats[i].label);

        const icon = title.find("Icon");
        assert(icon.length === 1);
        assert(icon.prop("name") === stats[i].icon);

        const chart = item.find("StatsChart");
        assert(chart.length === 1);
        assert(chart.prop("label") === stats[i].label);
        assert(chart.prop("timestamps") === statsLog.timestamps);
        assert(chart.prop("values") === statsLog.stats[stats[i].key]);
      });
    });
  });
});
