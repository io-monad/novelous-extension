import React from "react";
import { assert, shallow, factory } from "../../../common";
import LinkList from
  "../../../../app/scripts/lib/views/subscriptions/link-list";

describe("LinkList", () => {
  describe("#render", () => {
    let links;
    let actual;
    beforeEach(() => {
      links = factory.buildSync("novelFeedItem").links;
      actual = shallow(<LinkList links={links} />);
    });

    it("renders .link-list", () => {
      assert(actual.hasClass("link-list"));
    });

    it("renders items", () => {
      assert(actual.children().length === links.length);

      actual.children().forEach((item, i) => {
        assert(item.hasClass("link-list__item"));

        const link = item.find("Link");
        assert(link.length === 1);
        assert(link.prop("href") === links[i].url);
        assert(link.childAt(1).text() === links[i].label);

        const icon = link.find("Icon");
        assert(icon.length === 1);
        assert(icon.prop("name") === links[i].icon);
      });
    });
  });
});
