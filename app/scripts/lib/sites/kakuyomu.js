import Base from "./base";
import strftime from "strftime";

/**
 * Site "Kakuyomu" (kakuyomu.jp)
 *
 * Publication site settings:
 * - `novelId`: `String` A Novel ID of publishing novels.
 */
export default class Kakuyomu extends Base {
  /**
   * @param {Object} [settings] - Settings.
   */
  constructor(settings) {
    settings = _.defaults(settings, Kakuyomu.meta);
    super(settings);
  }

  getPublishPath(pub) {
    const novelId = _.get(pub, "sites.kakuyomu.novelId");
    if (!novelId) {
      throw new Error("No sites.kakuyomu.novelId in publication data");
    }
    return `/my/works/${encodeURIComponent(novelId)}/episodes/new`;
  }

  getCodeForPublishPage(pub) {
    const title = JSON.stringify(pub.title || "");
    const body = JSON.stringify(pub.body || "");
    let code = `
      var form = document.getElementById("episode-editForm");

      var change = document.createEvent("HTMLEvents");
      change.initEvent("change", true, true);

      form.title.value = ${title};
      form.title.dispatchEvent(change);
      form.body.value = ${body};
      form.body.dispatchEvent(change);
    `;

    if (pub.time) {
      const dateValue = JSON.stringify(strftime("%Y-%m-%d", pub.time));
      const timeValue = JSON.stringify(strftime("%H:%M", pub.time));
      code += `
        document.querySelector(".js-reservation-panel-button").click();
        document.getElementById("reservationInput-reserved").click();
        form.reservation_date.value = ${dateValue};
        form.reservation_time.value = ${timeValue};
      `;
    }

    return code;
  }
}

Kakuyomu.meta = {
  name: "kakuyomu",
  displayName: "カクヨム",
  baseUrl: "https://kakuyomu.jp",
};
