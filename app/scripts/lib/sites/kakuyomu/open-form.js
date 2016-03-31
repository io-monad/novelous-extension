import OpenFormStrategy from "../strategies/open-form";
import strftime from "strftime";

/**
 * Open a publish form in Kakuyomu.
 */
export default class KakuyomuOpenFormStrategy extends OpenFormStrategy {
  /**
   * @param {string} baseUrl - A base URL of Kakuyomu.
   */
  constructor(baseUrl) {
    super();
    this.baseUrl = baseUrl;
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
