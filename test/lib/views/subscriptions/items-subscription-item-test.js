import React from "react";
import { assert, render, factory } from "../../../common";
import ItemsSubscriptionItem from
  "../../../../app/scripts/lib/views/subscriptions/items-subscription-item";

describe("ItemsSubscriptionItem", () => {
  describe("#render", () => {
    context("in general", () => {
      let item;
      let actual;
      beforeEach(() => {
        item = factory.buildSync("feedItem");
        actual = render(<ItemsSubscriptionItem item={item} />);
      });

      it("renders .items-subscription-item", () => {
        assert(actual.hasClassName("items-subscription-item"));
      });

      it("renders title", () => {
        const title = actual.findByClassName("items-subscription-item__title");
        assert(title);

        const icon = title.findByTagName("TypeIcon");
        assert(icon);
        assert(icon.props.type === item.type);

        const link = title.findByTagName("Link");
        assert(link);
        assert(link.props.href === item.url);
        assert(link.props.title === item.title);
      });

      it("renders body", () => {
        const body = actual.findByTagName("ItemBody");
        assert(body);
        assert(body.props.item === item);
        assert(body.props.expanded === false);
      });

      it("renders time", () => {
        const time = actual.findByClassName("items-subscription-item__time");
        assert(time);

        const timeel = time.findByTagName("Time");
        assert(timeel);
        assert(timeel.props.value === item.createdAt);
      });

      it("renders author", () => {
        const author = actual.findByClassName("items-subscription-item__author");
        assert(author);

        const link = author.findByTagName("Link");
        assert(link);
        assert(link.props.href === item.authorUrl);
        assert(link.props.title === item.authorName);
      });
    });

    context("as read", () => {
      let item;
      let actual;
      beforeEach(() => {
        item = factory.buildSync("feedItem");
        actual = render(<ItemsSubscriptionItem item={item} />);
      });

      it("is collapsed by default", () => {
        assert(actual.hasClassName("items-subscription-item--collapsed"));
        assert(!actual.hasClassName("items-subscription-item--expanded"));
      });

      it("has collapsed body", () => {
        const body = actual.findByClassName("items-subscription-item__body");
        assert(!body.children.props.expanded);
      });

      it("toggles expanded on clicked", () => {
        actual.props.onClick();
        actual.render();

        assert(!actual.hasClassName("items-subscription-item--collapsed"));
        assert(actual.hasClassName("items-subscription-item--expanded"));
      });
    });

    context("as unread", () => {
      let item;
      let actual;
      beforeEach(() => {
        item = factory.buildSync("feedItem");
        actual = render(<ItemsSubscriptionItem item={item} isUnread />);
      });

      it("is expanded by default", () => {
        assert(!actual.hasClassName("items-subscription-item--collapsed"));
        assert(actual.hasClassName("items-subscription-item--expanded"));
      });

      it("has expanded body", () => {
        const body = actual.findByClassName("items-subscription-item__body");
        assert(body.children.props.expanded);
      });

      it("toggles expanded on clicked", () => {
        actual.props.onClick();
        actual.render();

        assert(actual.hasClassName("items-subscription-item--collapsed"));
        assert(!actual.hasClassName("items-subscription-item--expanded"));
      });
    });

    context("as list item", () => {
      let item;
      let actual;
      beforeEach(() => {
        item = factory.buildSync("feedItem");
        actual = render(<ItemsSubscriptionItem item={item} isUnread />);
      });

      it("is in list", () => {
        assert(actual.hasClassName("items-subscription-item--in-list"));
        assert(!actual.hasClassName("items-subscription-item--single"));
      });

      it("does not render subscription", () => {
        assert(!actual.findByClassName("items-subscription-item__subscription"));
      });
    });

    context("as single", () => {
      let sub;
      let item;
      let actual;
      beforeEach(() => {
        sub = factory.buildSync("itemsSubscription");
        item = sub.items[0];
        actual = render(<ItemsSubscriptionItem subscription={sub} item={item} />);
      });

      it("is single", () => {
        assert(!actual.hasClassName("items-subscription-item--in-list"));
        assert(actual.hasClassName("items-subscription-item--single"));
      });

      it("renders subscription", () => {
        const el = actual.findByClassName("items-subscription-item__subscription");
        assert(el);

        const icon = el.findByTagName("SiteIcon");
        assert(icon);
        assert(icon.props.name === sub.siteId);

        const link = el.findByTagName("Link");
        assert(link);
        assert(link.props.href === sub.feed.url);
        assert(link.props.children === sub.title);
      });
    });
  });
});
