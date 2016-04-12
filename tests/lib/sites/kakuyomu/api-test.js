import { _, test, sinon } from "../../../common";
import KakuyomuAPI from "../../../../app/scripts/lib/sites/kakuyomu/api";
import SiteClient from "../../../../app/scripts/lib/sites/site-client";

test.beforeEach(t => {
  t.context.api = new KakuyomuAPI;
});

test("new KakuyomuAPI", t => {
  t.true(t.context.api instanceof KakuyomuAPI);
});

test("#client", t => {
  const { api } = t.context;
  t.true(api.client instanceof SiteClient);
});

const apiTests = {
  "#getNovel": {
    call: (api) => api.getNovel("123456"),
    expect: ["NovelFetcher", "fetchNovel", "123456"],
  },
  "#listReviewsByNovelId": {
    call: (api) => api.listReviewsByNovelId("123456"),
    expect: ["ReviewLister", "listReviews", "123456"],
  },
  "#listNovelsByUserId": {
    call: (api) => api.listNovelsByUserId("test"),
    expect: ["UserNovelLister", "listNovelsOfUser", "test"],
  },
  "#listMyNovelIds": {
    call: (api) => api.listMyNovelIds(),
    expect: ["MyNovelLister", "listNovelIds"],
  },
  "#listMyNovels": {
    call: (api) => api.listMyNovels(),
    expect: ["MyNovelLister", "listNovels"],
  },
};
_.each(apiTests, (data, name) => {
  test(name, t => {
    const { api } = t.context;
    const stub = sinon.stub();
    api._api[data.expect[0]] = { [data.expect[1]]: stub };

    data.call(api);
    t.true(stub.calledOnce);
    t.deepEqual(stub.args[0], data.expect.slice(2));
  });
});
