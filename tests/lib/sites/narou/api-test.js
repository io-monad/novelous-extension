import { _, test, sinon } from "../../../common";
import NarouAPI from "../../../../app/scripts/lib/sites/narou/api";
import SiteClient from "../../../../app/scripts/lib/sites/site-client";

test.beforeEach(t => {
  t.context.api = new NarouAPI;
});

test("new NarouAPI", t => {
  t.true(t.context.api instanceof NarouAPI);
});

test("#client", t => {
  const { api } = t.context;
  t.true(api.client instanceof SiteClient);
});

const apiTests = {
  "#getNovel": {
    call: (api) => api.getNovel("n12345"),
    expect: ["NovelFetcher", "fetchNovel", "n12345"],
  },
  "#listNovelsByUserId": {
    call: (api) => api.listNovelsByUserId("12345"),
    expect: ["UserNovelLister", "listNovelsOfUser", "12345"],
  },
  "#listMyNovels": {
    call: (api) => api.listMyNovels(),
    expect: ["MyNovelLister", "listNovels"],
  },
  "#listMyReceivedComments": {
    call: (api) => api.listMyReceivedComments(),
    expect: ["MyCommentLister", "listReceivedComments"],
  },
  "#listMyReceivedReviews": {
    call: (api) => api.listMyReceivedReviews(),
    expect: ["MyReviewLister", "listReceivedReviews"],
  },
  "#listMyReceivedMessages": {
    call: (api) => api.listMyReceivedMessages(),
    expect: ["MyMessageLister", "listReceivedMessages"],
  },
  "#listMyReceivedBlogComments": {
    call: (api) => api.listMyReceivedBlogComments(),
    expect: ["MyBlogCommentLister", "listReceivedComments"],
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
