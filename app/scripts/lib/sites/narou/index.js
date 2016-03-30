import Base from "../base";
import strftime from "strftime";

/**
 * Site "Syosetuka ni Narou" (syosetu.com)
 *
 * Publication site settings:
 * - `novelId`: `String` A Novel ID of publishing novel.
 */
export default class Narou extends Base {
  /**
   * @param {Object} [settings] - Settings.
   */
  constructor(settings) {
    settings = _.defaults(settings, Narou.meta);
    super(settings);
  }

  getPublishPath(pub) {
    const novelId = _.get(pub, "sites.narou.novelId");
    if (!novelId) {
      throw new Error("No sites.narou.novelId in publication data");
    }
    return `/usernovelmanage/ziwainput/ncode/${encodeURIComponent(novelId)}/`;
  }

  getCodeForPublishPage(pub) {
    const title = JSON.stringify(pub.title || "");
    const body = JSON.stringify(pub.body || "");
    let code = `
      var form = document.getElementById("manage_form");
      form.subtitle.value = ${title};
      form.novel.value = ${body};
    `;

    if (pub.time) {
      const monthValue = JSON.stringify(strftime("%Y-%m", pub.time));
      const dayValue = JSON.stringify(strftime("%-d", pub.time));
      const hourValue = JSON.stringify(strftime("%-H", pub.time));
      code += `
        form.month.value = ${monthValue};
        form.day.value = ${dayValue};
        form.hour.value = ${hourValue};
      `;
    }

    return code;
  }
}

Narou.meta = {
  name: "narou",
  displayName: "小説家になろう",
  baseUrl: "http://syosetu.com",
};
