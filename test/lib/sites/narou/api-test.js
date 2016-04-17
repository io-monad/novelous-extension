import { _, assert, sinon } from "../../../common";
import NarouAPI from "../../../../app/scripts/lib/sites/narou/api";
import SiteClient from "../../../../app/scripts/lib/sites/site-client";

describe("NarouAPI", () => {
  let narouAPI;

  beforeEach(() => {
    narouAPI = new NarouAPI;
  });

  it("new NarouAPI", () => {
    assert(narouAPI instanceof NarouAPI);
  });

  describe("#client", () => {
    it("is SiteClient", () => {
      assert(narouAPI.client instanceof SiteClient);
    });
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
    describe(name, () => {
      it("calls API", () => {
        const stub = sinon.stub();
        narouAPI._api[data.expect[0]] = { [data.expect[1]]: stub };

        data.call(narouAPI);
        assert(stub.calledOnce);
        assert.deepEqual(stub.args[0], data.expect.slice(2));
      });
    });
  });
});
