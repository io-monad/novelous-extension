import React from "react";
import { assert, shallow } from "../../../common";
import StatsChart from
  "../../../../app/scripts/lib/views/subscriptions/stats-chart";

describe("StatsChart", () => {
  const label = "Test Stat";
  const timestamps = [1, 2, 3];
  const values = [10, 20, 30];

  describe("#render", () => {
    let actual;
    beforeEach(() => {
      actual = shallow(
        <StatsChart label={label} timestamps={timestamps} values={values} />
      );
    });

    it("renders .stats-chart", () => {
      assert(actual.hasClass("stats-chart"));
    });

    it("renders chart canvas", () => {
      assert(actual.children().type() === "canvas");
      assert(actual.children().hasClass("starts-chart__canvas"));
    });
  });
});
