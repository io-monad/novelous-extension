import React from "react";
import { assert, shallow, sinon, factory } from "../../../common";
import ItemsSubscriptionCategory from
  "../../../../app/scripts/lib/views/subscriptions/items-subscription-category";

describe("ItemsSubscriptionCategory", () => {
  describe("#render", () => {
    let sub;
    let actual;
    beforeEach(() => {
      sub = factory.buildSync("itemsSubscription");
      actual = shallow(
        <ItemsSubscriptionCategory subscription={sub} unreadItemIds={{}} />
      );
    });

    it("renders .items-subscription-category", () => {
      assert(actual.hasClass("items-subscription-category"));
    });

    it("renders title", () => {
      const title = actual.find(".items-subscription-category__title");
      assert(title.length === 1);
      assert(title.childAt(2).text() === `${sub.siteName}: ${sub.title}`);

      const icon = title.find("SiteIcon");
      assert(icon.length === 1);
    });

    it("renders links", () => {
      const links = actual.find(".items-subscription-category__links");
      assert(links.length === 1);
      assert(links.children().type().name === "Link");
      assert(links.children().prop("href") === sub.url);
    });

    it("renders counts", () => {
      const counts = actual.find(".items-subscription-category__counts");
      assert(counts.length === 1);

      const itemCount = counts.find(".items-subscription-category__item-count");
      assert(itemCount.text() === sub.items.length.toString());
    });

    it("is collapsed by default", () => {
      assert(actual.hasClass("items-subscription-category--collapsed"));
      assert(!actual.hasClass("items-subscription-category--expanded"));
    });

    it("is expanded on clicked header", () => {
      const header = actual.find(".items-subscription-category__header");
      assert(header.length === 1);

      const ev = { stopPropagation: sinon.spy(), preventDefault: sinon.spy() };
      header.simulate("click", ev);
      assert(ev.stopPropagation.calledOnce);
      assert(ev.preventDefault.calledOnce);

      assert(!actual.hasClass("items-subscription-category--collapsed"));
      assert(actual.hasClass("items-subscription-category--expanded"));
    });
  });
});
