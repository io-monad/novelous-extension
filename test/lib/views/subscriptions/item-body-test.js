import React from "react";
import { assert, shallow, factory } from "../../../common";
import { Icon } from "../../../../app/scripts/lib/views/common";
import ItemBody from
  "../../../../app/scripts/lib/views/subscriptions/item-body";

describe("ItemBody", () => {
  describe("#render", () => {
    context("collapsed with body", () => {
      let item;
      let actual;
      beforeEach(() => {
        item = factory.buildSync("feedItem");
        actual = shallow(<ItemBody item={item} expanded={false} />);
      });

      it("renders collapsed CollapsedText", () => {
        assert(actual.type().name === "CollapsedText");
        assert(actual.prop("expanded") === false);
      });

      it("has plain summarized body", () => {
        const text = actual.children().text();
        const summarized = item.body.slice(0, text.length);
        assert(text === summarized);
      });
    });

    context("collapsed with summary", () => {
      let item;
      let actual;
      beforeEach(() => {
        item = factory.buildSync("feedItem", { body: null });
        item.summary = "Test Summary";
        actual = shallow(<ItemBody item={item} expanded={false} />);
      });

      it("renders collapsed CollapsedText", () => {
        assert(actual.type().name === "CollapsedText");
        assert(actual.prop("expanded") === false);
      });

      it("has summary", () => {
        assert(actual.children().text() === "Test Summary");
      });
    });

    context("expanded", () => {
      let item;
      let actual;
      beforeEach(() => {
        item = factory.buildSync("feedItem", {
          type: "comment",
          sourceType: "novel",
          body: "▼良い点\nGood points 1\nGood points 2\n▼一言\nTest hitokoto\n\n",
        });
        actual = shallow(<ItemBody item={item} expanded />);
      });

      it("renders expanded CollapsedText", () => {
        assert(actual.type().name === "CollapsedText");
        assert(actual.prop("expanded") === true);
      });

      it("has decorated body", () => {
        const expected = [
          <h2 key={0}><Icon name="thumbs-o-up" />良い点</h2>,
          <p key={1}>{"Good points 1\nGood points 2"}</p>,
          <h2 key={2}><Icon name="commenting-o" />一言</h2>,
          <p key={3}>{"Test hitokoto"}</p>,
        ];
        assert(actual.children().length === expected.length);
        actual.children().forEach((el, i) => {
          assert.reactEqual(el, expected[i]);
        });
      });
    });
  });
});
