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
        links: [
          {
            key: "manage",
            url: novel.manageUrl,
            label: translate("linkManage"),
            icon: "cog",
          },
          {
            key: "newEpisode",
            url: novel.newEpisodeUrl,
            label: translate("linkNewEpisode"),
            icon: "pencil-square-o",
          },
        ],
        stats: [
          {
            key: "point",
            value: novel.point,
            label: translate("labelPoint"),
            icon: "plus",
            unit: translate("unitPoints"),
            link: novel.manageUrl,
          },
          {
            key: "ratePoint",
            value: novel.ratePoint,
            label: translate("labelRatePoint"),
            icon: "star",
            unit: translate("unitPoints"),
          },
          {
            key: "bookmarkCount",
            value: novel.bookmarkCount,
            label: translate("labelBookmarkCount"),
            icon: "bookmark",
          },
        ],
      }));
    });
  }
}
