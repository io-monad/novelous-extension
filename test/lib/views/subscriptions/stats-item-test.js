import React from "react";
import { assert, render, factory } from "../../../common";
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
        actual = render(<StatsItem stat={stat} values={[]} />);
      });

      it("renders .stats-item", () => {
        assert(actual.hasClassName("stats-item"));
      });

      it("renders current stat", () => {
        const current = actual.findByClassName("stats-item__current");
        assert(current);
        assert(current.children.tagName === "Link");
        assert(current.children.props.href === stat.link);

        const icon = current.findByTagName("Icon");
        assert(icon);
        assert(icon.props.name === stat.icon);

        const value = current.findByClassName("stat__value");
        assert(value);
        assert(value.children.tagName === "Num");
        assert(value.children.children === stat.value);

        const unit = current.findByClassName("stat__unit");
        assert(unit);
        assert(unit.children === stat.unit);
      });
    });

    context("with values", () => {
      const values = [10, 20, 30];

      let actual;
      beforeEach(() => {
        actual = render(<StatsItem stat={stat} values={values} />);
      });

      it("renders sparkline", () => {
        const sparkline = actual.findByClassName("stats-item__sparkline");
        assert(sparkline);
        assert(sparkline.children.tagName === "Sparklines");
        assert(sparkline.children.props.data === values);
      });
    });

    context("with empty values", () => {
      let actual;
      beforeEach(() => {
        actual = render(<StatsItem stat={stat} values={[]} />);
      });

      it("does not render sparkline", () => {
        const sparkline = actual.findByClassName("stats-item__sparkline");
        assert(!sparkline);
      });
    });
  });
});
