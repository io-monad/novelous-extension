import React from "react";
import { assert, shallow, factory } from "../../../common";
import StatsItem from
  "../../../../app/scripts/lib/views/subscriptions/stats-item";

describe("StatsItem", () => {
  describe("#render", () => {
    let stat;
    beforeEach(() => {
      stat = factory.buildSync("novelFeedItem").stats[0];
    });

    context("in general", () => {
      let actual;
      beforeEach(() => {
        actual = shallow(<StatsItem stat={stat} values={[]} />);
      });

      it("renders .stats-item", () => {
        assert(actual.hasClass("stats-item"));
      });

      it("renders current stat", () => {
        const current = actual.find(".stats-item__current");
        assert(current.length === 1);
        assert(current.children().type().name === "Link");
        assert(current.children().prop("href") === stat.link);

        const icon = current.find("Icon");
        assert(icon.length === 1);
        assert(icon.prop("name") === stat.icon);

        const value = current.find(".stat__value");
        assert(value.length === 1);
        assert(value.children().type().name === "Num");
        assert(value.children().children().text() === stat.value.toString());

        const unit = current.find(".stat__unit");
        assert(unit.length === 1);
        assert(unit.children().text() === stat.unit);
      });
    });

    context("with values", () => {
      const values = [10, 20, 30];

      let actual;
      beforeEach(() => {
        actual = shallow(<StatsItem stat={stat} values={values} />);
      });

      it("renders sparkline", () => {
        const sparkline = actual.find(".stats-item__sparkline");
        assert(sparkline.length === 1);
        assert(sparkline.children().type().name === "Sparklines");
        assert(sparkline.children().prop("data") === values);
      });
    });

    context("with empty values", () => {
      let actual;
      beforeEach(() => {
        actual = shallow(<StatsItem stat={stat} values={[]} />);
      });

      it("does not render sparkline", () => {
        const sparkline = actual.find(".stats-item__sparkline");
        assert(sparkline.length === 0);
      });
    });
  });
});
