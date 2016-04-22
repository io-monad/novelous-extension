import _ from "lodash";
import { translate } from "@io-monad/chrome-util";
import Feed from "../feed";
import Kakuyomu from "../../sites/kakuyomu";

/**
 * Feed fetcher of my novels in Kakuyomu
 *
 * @implements {FeedFetcher}
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
        links: [
          {
            key: "manage",
            url: Kakuyomu.URL.getMyTopURL(),
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
            key: "starCount",
            value: novel.starCount,
            label: translate("labelStarCount"),
            icon: "star",
            link: Kakuyomu.URL.getNovelReviewsURL(novel.id),
          },
          {
            key: "followerCount",
            value: novel.followerCount,
            label: translate("labelFollowerCount"),
            icon: "bookmark",
            link: Kakuyomu.URL.getNovelFollowersURL(novel.id),
          },
        ],
      }));
    });
  }
}
