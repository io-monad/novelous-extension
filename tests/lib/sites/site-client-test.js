import { _, test, fixture, sinonsb } from "../../common";
import SiteClient from "../../../app/scripts/lib/sites/site-client";

test("#fetch returns URL contents", t => {
  const client = new SiteClient;

  return client.fetch("https://kakuyomu.jp/my").then(content => {
    t.is(content, fixture("kakuyomu/my.html"));
  });
});

test.serial("#fetch caches response", t => {
  const testUrl = "https://kakuyomu.jp/my";
  const nowStub = sinonsb.stub(_, "now").returns(1000);
  const client = new SiteClient({ caching: true, cacheExpiresIn: 5000 });

  return client.fetch(testUrl).then(res1 => {
    // Override response
    XMLHttpRequest.addRoute(testUrl, [200, {}, "TEST"]);

    nowStub.returns(3000);  // Not expires caches yet
    return client.fetch(testUrl).then(res2 => {
      t.is(res1, res2);

      nowStub.returns(6000);  // Expires caches
      return client.fetch(testUrl).then(res3 => {
        t.is(res3, "TEST");
      });
    });
  });
});

test.serial.cb("#fetch waits for interval", t => {
  const clock = sinonsb.useFakeTimers(0);
  const nowStub = sinonsb.stub(_, "now").returns(0);
  const client = new SiteClient({ fetchInterval: 5000 });

  const tick = (ms, fn) => {
    nowStub.returns(_.now() + ms);
    clock.tick(ms);
    if (fn) setImmediate(fn);
  };

  t.plan(2);
  client.fetch("https://kakuyomu.jp/my").then(() => {
    let resolved = false;
    client.fetch("https://kakuyomu.jp/works/4852201425154996024").then(() => {
      resolved = true;
      t.is(_.now(), 5000);
      t.end();
    });
    tick(3000, () => {
      t.false(resolved);
      tick(2000);
    });
  });
  tick(0); // for Promise
});

test.serial("#fetch rejects with LoginRequiredError if no session cookies", t => {
  const testUrl = "https://test/foo";
  const client = new SiteClient({
    sessionCookies: ["session"],
    loginRequiredUrlTester: /foo/,
  });

  // Pretend having no session cookies
  chrome.cookies.get.callsArgWithAsync(1, null);

  XMLHttpRequest.addRoute(testUrl, t.fail);
  return client.fetch(testUrl)
    .then(t.fail)
    .catch(err => {
      t.is(err.name, "LoginRequiredError");

      t.true(chrome.cookies.get.calledOnce);
      t.deepEqual(chrome.cookies.get.args[0][0], {
        name: "session",
        url: testUrl,
      });
    });
});

test.serial("#fetch does not check cookies for not login-required URL", t => {
  const testUrl = "https://test/bar";
  const client = new SiteClient({
    sessionCookies: ["session"],
    loginRequiredUrlTester: /foo/,
  });

  XMLHttpRequest.addRoute(testUrl);
  return client.fetch(testUrl).then(() => {
    t.false(chrome.cookies.get.called);
  });
});

test.serial("#fetch rejects with LoginRequiredError if redirected to login form", t => {
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
    .then(t.fail)
    .catch(err => {
      t.is(err.name, "LoginRequiredError");
    });
});
