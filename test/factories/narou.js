import _ from "lodash";
import factory from "../test-utils/factory";

factory.define("narouNovel", Object, {
  url: factory.seqstr("http://ncode.syosetu.com/n#/"),
  title: factory.seqstr("Narou Novel #"),
  description: factory.seqstr("Narou novel description #\nHello, world!"),
  authorName: factory.seqstr("Author#"),
  authorUrl: factory.numstr("http://mypage.syosetu.com/#/"),
  keywords: () => _.sampleSize(["ABC", "DEF", "GHI", "JKL", "MNO", "PQR"], _.random(0, 6)),
  genre: factory.seqstr("Genre#"),
  isShortStory: false,
  isFinished: false,

  characterCount: factory.number(1000000),
  episodeCount: factory.number(1, 100),
  latestEpisodeUrl() { return `${this.url}${this.episodeCount}/`; },

  commentCount: factory.number(1000),
  reviewCount: factory.number(1000),
  bookmarkCount: factory.number(1000),

  point: factory.number(10000),
  pointForQuality: factory.number(1000),
  pointForStory: factory.number(1000),

  createdAt: factory.timestamp(),
  updatedAt() { return this.createdAt + _.random(1000, 100000); },
});

factory.define("narouMessage", Object, {
  id: factory.seq(n => n.toString()),
  title: factory.seqstr("Test message #"),
  url: factory.numstr("http://syosetu.com/messagebox/view/meskey/#/"),
  userName: factory.seqstr("Sender#"),
  userUrl: factory.numstr("http://mypage.syosetu.com/#/"),
  createdAt: factory.timestamp(),
});
