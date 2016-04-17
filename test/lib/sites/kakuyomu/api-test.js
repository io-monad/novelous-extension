import { _, assert, sinon } from "../../../common";
import KakuyomuAPI from "../../../../app/scripts/lib/sites/kakuyomu/api";
import SiteClient from "../../../../app/scripts/lib/sites/site-client";

describe("KakuyomuAPI", () => {
  let kakuyomuAPI;

  beforeEach(() => {
    kakuyomuAPI = new KakuyomuAPI;
  });

  it("new KakuyomuAPI", () => {
    assert(kakuyomuAPI instanceof KakuyomuAPI);
  });

  describe("#client", () => {
    it("is SiteClient", () => {
      assert(kakuyomuAPI.client instanceof SiteClient);
    });
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
    "#listNewsByUserId": {
      call: (api) => api.listNewsByUserId("test"),
      expect: ["UserNewsLister", "listNewsOfUser", "test"],
    },
    "#getMyUser": {
      call: (api) => api.getMyUser(),
      expect: ["MyUserFetcher", "fetchUser"],
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
    describe(name, () => {
      it("calls API", () => {
        const stub = sinon.stub();
        kakuyomuAPI._api[data.expect[0]] = { [data.expect[1]]: stub };

        data.call(kakuyomuAPI);
        assert(stub.calledOnce);
        assert.deepEqual(stub.args[0], data.expect.slice(2));
      });
    });
  });
});
