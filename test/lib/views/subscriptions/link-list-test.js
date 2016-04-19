import React from "react";
import { assert, render, factory } from "../../../common";
import LinkList from
  "../../../../app/scripts/lib/views/subscriptions/link-list";

describe("LinkList", () => {
  describe("#render", () => {
    let links;
    let actual;
    beforeEach(() => {
      links = factory.buildSync("novelFeedItem").links;
      actual = render(<LinkList links={links} />);
    });

    it("renders .link-list", () => {
      assert(actual.hasClassName("link-list"));
    });

    it("renders items", () => {
      assert(actual.children.length === links.length);

      actual.children.forEach((item, i) => {
        assert(item.hasClassName("link-list__item"));

        const link = item.findByTagName("Link");
        assert(link);
        assert(link.props.href === links[i].url);
        assert(link.text === links[i].label);

        const icon = link.findByTagName("Icon");
        assert(icon);
        assert(icon.props.name === links[i].icon);
      });
    });
  });
});
