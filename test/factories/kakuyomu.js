import _ from "lodash";
import factory from "../test-utils/factory";

factory.define("kakuyomuNovel", Object, {
  id: factory.numstr("#", 1000, 1000000),
  color: "rgb(255, 94, 35)",
  title: factory.seqstr("Narou Novel #"),
  url() { return `https://kakuyomu.jp/works/${this.id}`; },
  catchphrase: factory.seqstr("Catchphrase #"),
  description: factory.seqstr("Narou novel description #\nHello, world!"),
  authorUserId: factory.seqstr("#"),
  authorName: factory.seqstr("Author#"),
  authorUrl: factory.seqstr("https://kakuyomu.jp/users/author#/"),
  keywords: () => _.sampleSize(["ABC", "DEF", "GHI", "JKL", "MNO", "PQR"], _.random(0, 6)),
  genre: factory.seqstr("Genre#"),
  characterCount: factory.number(1000000),
  episodeCount: factory.number(1, 100),
  latestEpisodeUrl() { return `${this.url}/episodes/${_.random(1, 1000000)}`; },
  isFinished: false,
  isFunFiction: false,
  originalTitle: null,
  rateCount: factory.number(1000),
  followerCount: factory.number(1000),
  starCount: factory.number(1000),
  createdAt: factory.timestamp(),
  updatedAt() { return this.createdAt + _.random(1000, 100000); },
  reviews() {
    return _.range(1, 6).map(n =>
      factory.buildSync("kakuyomuReview", { url: `${this.url}/reviews/${n}` })
    );
  },
});

factory.define("kakuyomuReview", Object, {
  id: factory.seqstr("#"),
  title: factory.seqstr("Review #"),
  url() { return `https://kakuyomu.jp/works/${_.random(1000, 1000000)}/reviews/${this.id}`; },
  rating: () => _.repeat("★", _.random(1, 3)),
  authorUserId: factory.seqstr("#"),
  authorName: factory.seqstr("Reviewer#"),
  authorUrl: factory.seqstr("https://kakuyomu.jp/users/author#/"),
  body: factory.seqstr("Review body #\nBlah Blah"),
  createdAt: factory.timestamp(),
});

factory.define("kakuyomuReviewFeedItem", Object, {
  id: factory.seqstr("#"),
  title() { return `${_.repeat("★", _.random(1, 3))} Review ${this.id}`; },
  url() { return `${this.novelUrl}/reviews/${this.id}`; },
  body: factory.seqstr("Review body #\nBlah Blah"),
  userName: factory.seqstr("Reviewer#"),
  userUrl: factory.seqstr("https://kakuyomu.jp/users/author#/"),
  novelTitle: factory.seqstr("Narou Novel #"),
  novelUrl: factory.numstr("https://kakuyomu.jp/works/#", 1000, 1000000),
  createdAt: factory.timestamp(),
});
