import React from "react";
import { assert, shallow, factory } from "../../../common";
import ItemsSubscriptionItem from
  "../../../../app/scripts/lib/views/subscriptions/items-subscription-item";

describe("ItemsSubscriptionItem", () => {
  describe("#render", () => {
    context("in general", () => {
      let item;
      let actual;
      beforeEach(() => {
        item = factory.buildSync("feedItem");
        actual = shallow(<ItemsSubscriptionItem item={item} />);
      });

      it("renders .items-subscription-item", () => {
        assert(actual.hasClass("items-subscription-item"));
      });

      it("renders title", () => {
        const title = actual.find(".items-subscription-item__title");
        assert(title.length === 1);

        const icon = title.find("TypeIcon");
        assert(icon.length === 1);
        assert(icon.prop("type") === item.type);

        const link = title.find("Link");
        assert(link.length === 1);
        assert(link.prop("href") === item.url);
        assert(link.prop("title") === item.title);
      });

      it("renders body", () => {
        const body = actual.find("ItemBody");
        assert(body.length === 1);
        assert(body.prop("item") === item);
        assert(body.prop("expanded") === false);
      });

      it("renders time", () => {
        const time = actual.find(".items-subscription-item__time");
        assert(time.length === 1);

        const timeel = time.find("Time");
        assert(timeel.length === 1);
        assert(timeel.prop("value") === item.createdAt);
      });

      it("renders author", () => {
        const author = actual.find(".items-subscription-item__author");
        assert(author.length === 1);

        const link = author.find("Link");
        assert(link.length === 1);
        assert(link.prop("href") === item.authorUrl);
        assert(link.prop("title") === item.authorName);
      });
    });

    context("as read", () => {
      let item;
      let actual;
      beforeEach(() => {
        item = factory.buildSync("feedItem");
        actual = shallow(<ItemsSubscriptionItem item={item} />);
      });

      it("is collapsed by default", () => {
        assert(actual.hasClass("items-subscription-item--collapsed"));
        assert(!actual.hasClass("items-subscription-item--expanded"));
      });

      it("has collapsed body", () => {
        const body = actual.find(".items-subscription-item__body");
        assert(!body.children().prop("expanded"));
      });

      it("toggles expanded on clicked", () => {
        actual.simulate("click");
        assert(!actual.hasClass("items-subscription-item--collapsed"));
        assert(actual.hasClass("items-subscription-item--expanded"));
      });
    });

    context("as unread", () => {
      let item;
      let actual;
      beforeEach(() => {
        item = factory.buildSync("feedItem");
        actual = shallow(<ItemsSubscriptionItem item={item} isUnread />);
      });

      it("is expanded by default", () => {
        assert(!actual.hasClass("items-subscription-item--collapsed"));
        assert(actual.hasClass("items-subscription-item--expanded"));
      });

      it("has expanded body", () => {
        const body = actual.find(".items-subscription-item__body");
        assert(body.children().prop("expanded"));
      });

      it("toggles expanded on clicked", () => {
        actual.simulate("click");
        assert(actual.hasClass("items-subscription-item--collapsed"));
        assert(!actual.hasClass("items-subscription-item--expanded"));
      });
    });

    context("as list item", () => {
      let item;
      let actual;
      beforeEach(() => {
        item = factory.buildSync("feedItem");
        actual = shallow(<ItemsSubscriptionItem item={item} isUnread />);
      });

      it("is in list", () => {
        assert(actual.hasClass("items-subscription-item--in-list"));
        assert(!actual.hasClass("items-subscription-item--single"));
      });

      it("does not render subscription", () => {
        assert(actual.find(".items-subscription-item__subscription").length === 0);
      });
    });

    context("as single", () => {
      let sub;
      let item;
      let actual;
      beforeEach(() => {
        sub = factory.buildSync("itemsSubscription");
        item = sub.items[0];
        actual = shallow(<ItemsSubscriptionItem subscription={sub} item={item} />);
      });

      it("is single", () => {
        assert(!actual.hasClass("items-subscription-item--in-list"));
        assert(actual.hasClass("items-subscription-item--single"));
      });

      it("renders subscription", () => {
        const el = actual.find(".items-subscription-item__subscription");
        assert(el.length === 1);

        const icon = el.find("SiteIcon");
        assert(icon.length === 1);
        assert(icon.prop("name") === sub.siteId);

        const link = el.find("Link");
        assert(link.length === 1);
        assert(link.prop("href") === sub.feed.url);
        assert(link.prop("children") === sub.title);
      });
    });
  });
});
