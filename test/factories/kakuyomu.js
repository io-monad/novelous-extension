import _ from "lodash";
import factory from "factory-girl";

factory.define("kakuyomuNovel", Object, {
  id: () => _.random(1000, 1000000).toString(),
  color: "rgb(255, 94, 35)",
  title: factory.seq(n => `Narou Novel ${n}`),
  url() { return `https://kakuyomu.jp/works/${this.id}`; },
  catchphrase: factory.seq(n => `Catchphrase ${n}`),
  description: factory.seq(n => `Narou novel description ${n}\nHello, world!`),
  authorUserId: factory.seq(n => `${n}`),
  authorName: factory.seq(n => `Author${n}`),
  authorUrl: factory.seq(n => `https://kakuyomu.jp/users/author${n}/`),
  keywords: () => _.sampleSize(["ABC", "DEF", "GHI", "JKL", "MNO", "PQR"], _.random(0, 6)),
  genre: factory.seq(n => `Genre${n}`),
  characterCount: () => _.random(0, 1000000),
  episodeCount: () => _.random(1, 100),
  latestEpisodeUrl() { return `${this.url}/episodes/${_.random(1, 1000000)}`; },
  isFinished: false,
  isFunFiction: false,
  originalTitle: null,
  rateCount: () => _.random(0, 1000),
  followerCount: () => _.random(0, 1000),
  starCount: () => _.random(0, 1000),
  createdAt: () => 1458466620000 + _.random(0, 100000),
  updatedAt() { return this.createdAt + _.random(1000, 100000); },
  reviews() {
    return _.range(1, 6).map(n =>
      factory.buildSync("kakuyomuReview", { url: `${this.url}/reviews/${n}` })
    );
  },
});

factory.define("kakuyomuReview", Object, {
  id: factory.seq(n => `${n}`),
  title: factory.seq(n => `Review ${n}`),
  url: factory.seq(n => `https://kakuyomu.jp/works/${_.random(1000, 1000000)}/reviews/${n}`),
  rating: () => _.repeat("★", _.random(1, 3)),
  authorUserId: factory.seq(n => `${n}`),
  authorName: factory.seq(n => `Reviewer${n}`),
  authorUrl: factory.seq(n => `https://kakuyomu.jp/users/author${n}/`),
  body: factory.seq(n => `Review body ${n}\nBlah Blah`),
  createdAt: () => 1458466620000 + _.random(0, 100000),
});

factory.define("kakuyomuReviewFeedItem", Object, {
  id: factory.seq(n => `${n}`),
  title() { return `${_.repeat("★", _.random(1, 3))} Review ${this.id}`; },
  url() { return `${this.url}/reviews/${this.id}`; },
  body: factory.seq(n => `Review body ${n}\nBlah Blah`),
  userName: factory.seq(n => `Reviewer${n}`),
  userUrl: factory.seq(n => `https://kakuyomu.jp/users/author${n}/`),
  novelTitle: factory.seq(n => `Narou Novel ${n}`),
  novelUrl: () => `https://kakuyomu.jp/works/${_.random(1000, 1000000)}`,
  createdAt: () => 1458466620000 + _.random(0, 100000),
});
