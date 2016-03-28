import { test } from "../../common";
import Options from "../../../app/scripts/lib/app/options";

let options;

test.beforeEach(() => {
  options = new Options();
});

test("new Options", t => {
  t.ok(options instanceof Options);
});

test("#constructor sets default", t => {
  t.true(options.sites.narou.enabled);
  t.true(options.sites.kakuyomu.enabled);
});

test("#overwrite updates values with default values", t => {
  options.overwrite({
    sites: { narou: { enabled: false } },
  });
  t.false(options.sites.narou.enabled);

  options.overwrite({
    sites: { kakuyomu: { enabled: false } },
  });
  t.true(options.sites.narou.enabled);
  t.false(options.sites.kakuyomu.enabled);
});

test("#schema returns schema", t => {
  t.ok(_.isObject(options.schema));
});

test("#sites returns sites Object", t => {
  t.ok(_.isObject(options.sites));
  t.ok(_.isObject(options.sites.narou));
});

test(".load returns options Promise", t => {
  chrome.storage.sync.get.callsArgWithAsync(1, {});
  return Options.load().then((opts) => {
    t.ok(opts instanceof Options);
  });
});

test("#load returns options Promise", t => {
  chrome.storage.sync.get.callsArgWithAsync(1, {});
  return options.load().then((opts) => {
    t.ok(opts instanceof Options);
  });
});

test("#save saves values into storage", t => {
  chrome.storage.sync.set.callsArgAsync(1);
  return options.save().then(() => {
    t.ok(chrome.storage.sync.set.called);
    t.pass();
  });
});

test.cb("#observeUpdate registers listener", t => {
  t.plan(1);
  options.observeUpdate((opts) => {
    t.ok(opts instanceof Options);
    t.end();
  });
  chrome.storage.onChanged.trigger({ options: {} }, "sync");
});
