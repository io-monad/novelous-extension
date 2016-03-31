import kakuyomuMeta from "./meta.json";
import openPage from "../../util/open-page";
import strftime from "strftime";

/**
 * Opener for a publish form in Kakuyomu.
 */
export default class KakuyomuFormOpener {
  /**
   * @param {string} [baseUrl] - A base URL of Kakuyomu.
   */
  constructor(baseUrl) {
    this.baseUrl = baseUrl || kakuyomuMeta.baseUrl;
  }

  /**
   * Open a publish form with publication values set.
   *
   * @param {Publication} pub - A Publication to be set.
   * @return {Promise}
   */
  openForm(pub) {
    const url = this._getURL(pub);
    const code = this._getCode(pub);
    return openPage(url, code);
  }

  _getURL(pub) {
    const novelId = _.get(pub, "sites.kakuyomu.novelId");
    if (!novelId) {
      throw new Error("No sites.kakuyomu.novelId in publication data");
    }
    return `${this.baseUrl}/my/works/${encodeURIComponent(novelId)}/episodes/new`;
  }

  _getCode(pub) {
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
