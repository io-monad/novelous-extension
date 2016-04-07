import { test } from "../../common";
import SiteFactory from "../../../app/scripts/lib/sites/site-factory";
import Narou from "../../../app/scripts/lib/sites/narou";

test("#create returns Site for settings Object", t => {
  const site = SiteFactory.create("narou", {});
  t.truthy(site instanceof Narou);
});
test("#create returns Site for true", t => {
  const site = SiteFactory.create("narou", true);
  t.truthy(site instanceof Narou);
});
test("#create returns Site instance for itself", t => {
  const narou = new Narou();
  const site = SiteFactory.create("narou", narou);
  t.truthy(site === narou);
});
test("#create returns null for false", t => {
  const site = SiteFactory.create("narou", false);
  t.truthy(site === null);
});
test("#create throws Error for unknown site name", t => {
  t.throws(
    () => { SiteFactory.create("nonexist"); },
    "Unknown site name: nonexist"
  );
});
