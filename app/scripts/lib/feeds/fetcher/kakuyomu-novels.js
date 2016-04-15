import _ from "lodash";
import Feed from "../feed";
import Kakuyomu from "../../sites/kakuyomu";
import { translate } from "../../util/chrome-util";

/**
 * Feed fetcher of my novels in Kakuyomu
 *
 * @implements FeedFetcher
 */
export default class FetcherKakuyomuNovels {
  isLoginRequired() {
    return true;
  }

  fetchFeed() {
    return this._fetchItems().then(items => {
      return new Feed({
        title: translate("kakuyomuNovelsFeed"),
        url: Kakuyomu.URL.getMyTopURL(),
        siteName: translate(Kakuyomu.name),
        siteId: Kakuyomu.name,
        items,
      });
    });
  }

  _fetchItems() {
    return Kakuyomu.API.listMyNovels().then(novels => {
      return _.map(novels, novel => ({
        id: novel.id,
        title: novel.title,
        url: novel.url,
        type: "novel",
        authorName: novel.authorName,
        authorUrl: novel.authorUrl,
        updatedAt: novel.updatedAt,
        links: {
          manage: Kakuyomu.URL.getMyTopURL(),
          newEpisode: novel.newEpisodeUrl,
          stats: {
            starCount: Kakuyomu.URL.getNovelReviewsURL(novel.id),
            followerCount: Kakuyomu.URL.getNovelFollowersURL(novel.id),
          },
        },
        stats: {
          starCount: novel.starCount,
          followerCount: novel.followerCount,
        },
      }));
    });
  }
}
