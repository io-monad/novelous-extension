import NarouMyBlogCommentLister from "./my-blog-comment-lister";
import NarouMyCommentLister from "./my-comment-lister";
import NarouMyMessageLister from "./my-message-lister";
import NarouMyNovelLister from "./my-novel-lister";
import NarouMyReviewLister from "./my-review-lister";
import NarouNovelFetcher from "./novel-fetcher";
import NarouUserNovelLister from "./user-novel-lister";

export default {
  NOVEL: NarouNovelFetcher,
  USER_NOVELS: NarouUserNovelLister,
  MY_NOVELS: NarouMyNovelLister,
  MY_COMMENTS: NarouMyCommentLister,
  MY_REVIEWS: NarouMyReviewLister,
  MY_MESSAGES: NarouMyMessageLister,
  MY_BLOG_COMMENTS: NarouMyBlogCommentLister,
};
