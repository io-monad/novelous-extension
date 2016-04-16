import _ from "lodash";
import Feed from "../feed";
import Narou from "../../sites/narou";
import { translate } from "../../util/chrome-util";

/**
 * Feed fetcher of my novels in Narou
 *
 * @implements FeedFetcher
 */
export default class FetcherNarouNovels {
  isLoginRequired() {
    return true;
  }

  fetchFeed() {
    return this._fetchItems().then(items => {
      return new Feed({
        title: translate("narouNovelsFeed"),
        url: Narou.URL.getMyNovelsURL(),
        siteName: translate(Narou.name),
        siteId: Narou.name,
        items,
      });
    });
  }

  _fetchItems() {
    return Narou.API.listMyNovels().then(novels => {
      return _.map(novels, novel => ({
        id: novel.id,
        title: novel.title,
        url: novel.url,
        type: "novel",
        authorName: novel.authorName,
        authorUrl: novel.authorUrl,
        createdAt: novel.createdAt,
        updatedAt: novel.updatedAt,
        links: {
          manage: novel.manageUrl,
          newEpisode: novel.newEpisodeUrl,
          stats: {
            point: novel.manageUrl,
            reviewCount: Narou.URL.getNovelReviewsURL(novel.id),
          },
        },
        stats: {
          point: novel.point,
          bookmarkCount: novel.bookmarkCount,
          reviewCount: novel.reviewCount,
          ratePoint: novel.ratePoint,
        },
      }));
    });
  }
}