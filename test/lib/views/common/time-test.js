import React from "react";
import { assert, render, sinonsb } from "../../../common";
import moment from "../../../../app/scripts/lib/util/moment";
import Time from "../../../../app/scripts/lib/views/common/time";

describe("Time", () => {
  let realLocale;
  before(() => {
    realLocale = moment.locale();
    moment.locale("en");
    moment.tz.setDefault("Asia/Tokyo");
  });
  after(() => {
    moment.locale(realLocale);
    moment.tz.setDefault(null);
  });

  describe("#render", () => {
    it("renders formtatted time", () => {
      const actual = render(
        <Time value={1234567890123} format="Y-M-D H:m:s" />
      );
      const expected = (
        <time
          dateTime="2009-02-13T23:31:30.123Z"
          title="Sat, Feb 14, 2009 8:31 AM"
        >
          2009-2-14 8:31:30
        </time>
      );
      assert.reactEqual(actual, expected);
    });

    it("renders relative time by default", () => {
      const clockTime = 1234567890123;
      const renderTime = clockTime + 3 * 60 * 60 * 1000;
      sinonsb.useFakeTimers(clockTime);

      const actual = render(
        <Time value={renderTime} />
      );
      const expected = (
        <time
          dateTime="2009-02-14T02:31:30.123Z"
          title="Sat, Feb 14, 2009 11:31 AM"
        >
          in 3 hours
        </time>
      );
      assert.reactEqual(actual, expected);
    });
  });
});
