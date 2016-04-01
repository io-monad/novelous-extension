import factory from "factory-girl";

factory.define("kakuyomuNovel", Object, {
  color: "rgb(255, 94, 35)",
  title: factory.seq(n => `Narou Novel ${n}`),
  url: () => `https://kakuyomu.jp/works/${_.random(1000, 1000000)}`,
  authorName: factory.seq(n => `Author${n}`),
  authorUrl: factory.seq(n => `https://kakuyomu.jp/users/author${n}/`),
  starCount: () => _.random(0, 1000),
  catchphrase: factory.seq(n => `Catchphrase ${n}`),
  description: factory.seq(n => `Narou novel description ${n}\nHello, world!`),
  latestEpisodeUrl() { return `${this.url}/episodes/${_.random(1, 1000000)}`; },
  isFinished: false,
  isOrignal: true,
  episodeCount: () => _.random(1, 100),
  genre: factory.seq(n => `Genre${n}`),
  originalTitle: null,
  keywords: () => _.sampleSize(["ABC", "DEF", "GHI", "JKL", "MNO", "PQR"], _.random(0, 6)),
  characterCount: () => _.random(0, 1000000),
  createdAt: () => 1458466620000 + _.random(0, 100000),
  updatedAt() { return this.createdAt + _.random(1000, 100000); },
  reviewCount: () => _.random(0, 1000),
  followerCount: () => _.random(0, 1000),
});
