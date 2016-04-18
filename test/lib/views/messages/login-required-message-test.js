import React from "react";
import { assert, render } from "../../../common";
import LoginRequiredMessage from
  "../../../../app/scripts/lib/views/messages/login-required-message";
import { MessageBox, SiteIcon, Str } from "../../../../app/scripts/lib/views/common";

describe("LoginRequiredMessage", () => {
  describe("#render", () => {
    it("renders MessageBox", () => {
      const actual = render(<LoginRequiredMessage />);
      const expected = (
        <MessageBox message="loginRequired" icon="user-times">
          <div className="sites">
            <a href="https://kakuyomu.jp/" target="_blank" className="btn btn-link">
              <SiteIcon site="kakuyomu" />
              {" "}
              <Str name="kakuyomu" />
            </a>
            <a href="http://syosetu.com/" target="_blank" className="btn btn-link">
              <SiteIcon site="narou" />
              {" "}
              <Str name="narou" />
            </a>
          </div>
        </MessageBox>
      );
      assert.reactEqual(actual, expected);
    });
  });
});
