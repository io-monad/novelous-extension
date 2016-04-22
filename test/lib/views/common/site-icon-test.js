import React from "react";
import { assert, shallow } from "../../../common";
import SiteIcon from "../../../../app/scripts/lib/views/common/site-icon";

describe("SiteIcon", () => {
  describe("#render", () => {
    it("renders site icon image", () => {
      chrome.i18n.getMessage.returns("Syosetuka ni Narou");

      const actual = shallow(
        <SiteIcon name="narou" />
      );
      const expected = (
        <img
          src="/images/sites/narou.png"
          title="Syosetuka ni Narou"
          alt="Syosetuka ni Narou"
          className="site-icon"
        />
      );
      assert.reactEqual(actual, expected);
    });

    it("renders other site", () => {
      const actual = shallow(
        <SiteIcon name="other test" />
      );
      const expected = (
        <img
          src="/images/sites/other.png"
          title="Other Test"
          alt="Other Test"
          className="site-icon"
        />
      );
      assert.reactEqual(actual, expected);
    });
  });
});
