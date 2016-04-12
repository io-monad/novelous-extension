import KakuyomuNovelFetcher from "./novel-fetcher";
import KakuyomuReviewLister from "./review-lister";
import KakuyomuUserNovelLister from "./user-novel-lister";
import KakuyomuMyNovelLister from "./my-novel-lister";

export default {
  NOVEL: KakuyomuNovelFetcher,
  REVIEWS: KakuyomuReviewLister,
  USER_NOVELS: KakuyomuUserNovelLister,
  MY_NOVELS: KakuyomuMyNovelLister,
};
