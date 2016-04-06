import factory from "factory-girl";

factory.define("narouNovel", Object, {
  url: factory.seq(n => `http://ncode.syosetu.com/n${n}/`),
  title: factory.seq(n => `Narou Novel ${n}`),
  description: factory.seq(n => `Narou novel description ${n}\nHello, world!`),
  authorName: factory.seq(n => `Author${n}`),
  authorUrl: () => `http://mypage.syosetu.com/${_.random(1, 10000)}/`,
  keywords: () => _.sampleSize(["ABC", "DEF", "GHI", "JKL", "MNO", "PQR"], _.random(0, 6)),
  genre: factory.seq(n => `Genre${n}`),
  isShortStory: false,
  isFinished: false,

  characterCount: () => _.random(0, 1000000),
  episodeCount: () => _.random(1, 100),
  latestEpisodeUrl() { return `${this.url}${this.episodeCount}/`; },

  commentCount: () => _.random(0, 1000),
  reviewCount: () => _.random(0, 1000),
  bookmarkCount: () => _.random(0, 1000),

  point: () => _.random(0, 10000),
  pointForQuality: () => _.random(0, 1000),
  pointForStory: () => _.random(0, 1000),

  createdAt: () => 1458466620000 + _.random(0, 100000),
  updatedAt() { return this.createdAt + _.random(1000, 100000); },
});

factory.define("narouMessage", Object, {
  id: factory.seq(n => n.toString()),
  title: factory.seq(n => `Test message ${n}`),
  url: () => `http://syosetu.com/messagebox/view/meskey/${_.random(1, 1000000)}/`,
  userName: factory.seq(n => `Sender${n}`),
  userUrl: () => `http://mypage.syosetu.com/${_.random(1, 1000000)}/`,
  createdAt: () => 1462073640000 + _.random(0, 100000),
});
