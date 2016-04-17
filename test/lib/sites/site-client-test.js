import { _, assert, fixture, sinonsb } from "../../common";
import SiteClient from "../../../app/scripts/lib/sites/site-client";

describe("SiteClient", () => {
  describe("#fetch", () => {
    it("returns URL contents", () => {
      const client = new SiteClient;

      return client.fetch("https://kakuyomu.jp/my").then(content => {
        assert(content === fixture("kakuyomu/my.html"));
      });
    });

    it("caches response", () => {
      const testUrl = "https://kakuyomu.jp/my";
      const nowStub = sinonsb.stub(_, "now").returns(1000);
      const client = new SiteClient({ caching: true, cacheExpiresIn: 5000 });

      return client.fetch(testUrl).then(res1 => {
        // Override response
        XMLHttpRequest.addRoute(testUrl, [200, {}, "TEST"]);

        nowStub.returns(3000);  // Not expires caches yet
        return client.fetch(testUrl).then(res2 => {
          assert(res1 === res2);

          nowStub.returns(6000);  // Expires caches
          return client.fetch(testUrl).then(res3 => {
            assert(res3 === "TEST");
          });
        });
      });
    });

    it("waits for interval", (done) => {
      const clock = sinonsb.useFakeTimers(0);
      const nowStub = sinonsb.stub(_, "now").returns(0);
      const client = new SiteClient({ fetchInterval: 5000 });

      const tick = (ms, fn) => {
        nowStub.returns(_.now() + ms);
        clock.tick(ms);
        if (fn) setImmediate(fn);
      };

      client.fetch("https://kakuyomu.jp/my").then(() => {
        let resolved = false;
        client.fetch("https://kakuyomu.jp/works/4852201425154996024").then(() => {
          resolved = true;
          assert(_.now() === 5000);
          done();
        });
        tick(3000, () => {
          assert(!resolved);
          tick(2000);
        });
      });
      tick(0); // for Promise
    });

    it("rejects with LoginRequiredError if no session cookies", () => {
      const testUrl = "https://test/foo";
      const client = new SiteClient({
        sessionCookies: ["session"],
        loginRequiredUrlTester: /foo/,
      });

      // Pretend having no session cookies
      chrome.cookies.get.callsArgWithAsync(1, null);

      XMLHttpRequest.addRoute(testUrl, () => { assert(false); });
      return client.fetch(testUrl)
        .then(() => assert(false))
        .catch(err => {
          assert(err.name === "LoginRequiredError");

          assert(chrome.cookies.get.calledOnce);
          assert.deepEqual(chrome.cookies.get.args[0][0], {
            name: "session",
            url: testUrl,
          });
        });
    });

    it("does not check cookies for not login-required URL", () => {
      const testUrl = "https://test/bar";
      const client = new SiteClient({
        sessionCookies: ["session"],
        loginRequiredUrlTester: /foo/,
      });

      XMLHttpRequest.addRoute(testUrl);
      return client.fetch(testUrl).then(() => {
        assert(!chrome.cookies.get.called);
      });
    });

    it("rejects with LoginRequiredError if redirected to login form", () => {
      const testUrl = "https://test/bar";
      const loginUrl = "https://test/login";
      const client = new SiteClient({
        loginFormUrlTester: /login/,
      });

      XMLHttpRequest.addRoute(testUrl, (xhr) => {
        // Simulate redirection (not supported by FakeXMLHttpRequest)
        xhr.responseURL = loginUrl;
        return [200, {}, ""];
      });
      XMLHttpRequest.addRoute(loginUrl);
      return client.fetch(testUrl)
        .then(() => assert(false))
        .catch(err => {
          assert(err.name === "LoginRequiredError");
        });
    });
  });
});
