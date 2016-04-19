import React from "react";
import { assert, render, sinon, factory } from "../../../common";
import ItemsSubscriptionCategory from
  "../../../../app/scripts/lib/views/subscriptions/items-subscription-category";

describe("ItemsSubscriptionCategory", () => {
  describe("#render", () => {
    let sub;
    let actual;
    beforeEach(() => {
      sub = factory.buildSync("itemsSubscription");
      actual = render(
        <ItemsSubscriptionCategory subscription={sub} unreadItemIds={{}} />
      );
    });

    it("renders .items-subscription-category", () => {
      assert(actual.hasClassName("items-subscription-category"));
    });

    it("renders title", () => {
      const title = actual.findByClassName("items-subscription-category__title");
      assert(title);
      assert(title.text === `${sub.siteName}: ${sub.title}`);

      const icon = title.findByTagName("SiteIcon");
      assert(icon);
    });

    it("renders links", () => {
      const links = actual.findByClassName("items-subscription-category__links");
      assert(links);
      assert(links.children.tagName === "Link");
      assert(links.children.props.href === sub.url);
    });

    it("renders counts", () => {
      const counts = actual.findByClassName("items-subscription-category__counts");
      assert(counts);

      const itemCount = counts.findByClassName("items-subscription-category__item-count");
      assert(itemCount.children === sub.items.length);
    });

    it("is collapsed by default", () => {
      assert(actual.hasClassName("items-subscription-category--collapsed"));
      assert(!actual.hasClassName("items-subscription-category--expanded"));
    });

    it("is expanded on clicked header", () => {
      const header = actual.findByClassName("items-subscription-category__header");
      assert(header);

      const ev = { stopPropagation: sinon.spy(), preventDefault: sinon.spy() };
      header.props.onClick(ev);
      assert(ev.stopPropagation.calledOnce);
      assert(ev.preventDefault.calledOnce);

      actual.render();
      assert(!actual.hasClassName("items-subscription-category--collapsed"));
      assert(actual.hasClassName("items-subscription-category--expanded"));
    });
  });
});
