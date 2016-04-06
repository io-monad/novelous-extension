import { test, sinon } from "../../common";
import cutil from "../../../app/scripts/lib/util/chrome-util";

/**
 * Feed test cases
 */
export default function feedTestCases(settings) {
  let translateStub;
  test.before(() => {
    translateStub = sinon.stub(cutil, "translate").returns("test");
  });
  test.after(() => {
    translateStub.restore();
  });

  test.beforeEach(t => {
    t.context.feed = settings.feed();
  });

  test("has meta properties", t => {
    const { feed } = t.context;
    t.true(_.isString(feed.title));
    t.true(_.isString(feed.pageUrl));
    t.true(_.isString(feed.siteName));
  });

  test("#getData returns data object", t => {
    const { feed } = t.context;
    t.true(_.isPlainObject(feed.getData()));
  });

  test("#update fetches items from server", t => {
    const { feed } = t.context;
    const itemsFixture = settings.itemsFixture();

    t.same(feed.items, []);
    return feed.update().then(updated => {
      t.true(updated);
      t.is(feed.items.length, itemsFixture.length);
      t.same(_.map(feed.items, "id"), _.map(itemsFixture, "id"));
    });
  });

  test("#update clears new items on first update", t => {
    const { feed } = t.context;
    t.same(feed.newItems, []);
    t.is(feed.updateCount, 0);
    return feed.update().then(() => {
      t.same(feed.newItems, []);
      t.is(feed.updateCount, 0);
    });
  });

  test("#update sets new items if has any updates", t => {
    const { feed } = t.context;
    return feed.update().then(() => {
      const item = feed.items.pop();  // Simulate new item
      feed.clearNewItems();

      return feed.update().then(updated => {
        t.true(updated);
        t.same(feed.newItems, [item]);
        t.is(feed.updateCount, 1);
      });
    });
  });

  test("#update sets empty new items if no updates", t => {
    const { feed } = t.context;
    return feed.update().then(() => {
      return feed.update().then(updated => {
        t.false(updated);
        t.same(feed.newItems, []);
        t.is(feed.updateCount, 0);
      });
    });
  });

  test("#clearNewItems cleares new items", t => {
    const { feed } = t.context;
    return feed.update().then(() => {
      feed.clearNewItems();
      t.true(feed.items.length !== 0);
      t.same(feed.newItems, []);
      t.is(feed.updateCount, 0);
    });
  });
}
