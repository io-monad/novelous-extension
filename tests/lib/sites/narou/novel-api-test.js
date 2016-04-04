import { test, fixture } from "../../../common";
import NarouNovelAPI from "../../../../app/scripts/lib/sites/narou/novel-api";

test("#getNovelById", t => {
  const expected = fixture.json("narou/novel-api/expected-novel.json");
  const novelAPI = new NarouNovelAPI;
  return novelAPI.getNovelById("n5191dd").then((novel) => {
    t.same(novel, expected);
  });
});

test("#getNovelsByIds", t => {
  const expected = fixture.json("narou/novel-api/expected-novels.json");
  const novelAPI = new NarouNovelAPI;
  return novelAPI.getNovelsByIds(["n5191dd", "n3861ci"]).then((novels) => {
    t.same(novels, expected);
  });
});

test("#getNovelsByUserId", t => {
  const expected = fixture.json("narou/novel-api/expected-result.json");
  const novelAPI = new NarouNovelAPI;
  return novelAPI.getNovelsByUserId(518056).then((result) => {
    t.same(result, expected);
  });
});
