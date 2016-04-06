import Feed from "./feed";
import KakuyomuMyNovelLister from "../sites/kakuyomu/my-novel-lister";
import { translate } from "../util/chrome-util";

/**
 * Feed of received reviews in Kakuyomu
 */
export default class KakuyomuReviewsFeed extends Feed {
  constructor(data) {
    data = data || {};
    const lister = new KakuyomuMyNovelLister(data.options);
    super({
      title: translate("kakuyomuReviewsFeed"),
      pageUrl: lister.getURL(),
      siteName: translate("kakuyomuSiteName"),
    }, data);
    this.lister = lister;
  }

  _fetchItemsFromServer() {
    return this.lister.listNovels().then(novels => {
      return _.flatMap(novels, novel => {
        return _.map(novel.reviews || [], review => ({
          id: review.id,
          title: `${review.rating} ${review.title}`,
          url: review.url,
          body: review.body,
          userName: review.authorName,
          userUrl: review.authorUrl,
          novelTitle: novel.title,
          novelUrl: novel.url,
          createdAt: review.createdAt,
        }));
      });
    });
  }
}
