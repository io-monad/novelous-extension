import { assert, factory } from "../../common";
import Publication from "../../../app/scripts/lib/publications/publication";

describe("Publication", () => {
  let settings;
  let pub;

  beforeEach(() => {
    settings = factory.buildSync("publicationSettings");
    pub = new Publication(settings);
  });

  it("new Publication", () => {
    assert(pub instanceof Publication);
  });

  it("has properties", () => {
    assert(pub.title === settings.title);
    assert(pub.body === settings.body);
    assert(pub.time instanceof Date);
    assert(pub.time.toISOString() === settings.time);
    assert.deepEqual(pub.sites, settings.sites);
  });
});
