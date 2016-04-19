import React from "react";
import { assert, render } from "../../../common";
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
      actual = render(<StatsChartList stats={stats} statsLog={statsLog} />);
    });

    it("renders .stats-chart-list", () => {
      assert(actual.hasClassName("stats-chart-list"));
    });

    it("renders items", () => {
      const items = actual.findAllByClassName("stats-chart-list__item");
      assert(items.length === stats.length);
      items.forEach((item, i) => {
        const title = item.findByClassName("stats-chart-list__title");
        assert(title);
        assert(title.text === stats[i].label);

        const icon = title.findByTagName("Icon");
        assert(icon);
        assert(icon.props.name === stats[i].icon);

        const chart = item.findByTagName("StatsChart");
        assert(chart);
        assert(chart.props.label === stats[i].label);
        assert(chart.props.timestamps === statsLog.timestamps);
        assert(chart.props.values === statsLog.stats[stats[i].key]);
      });
    });
  });
});
