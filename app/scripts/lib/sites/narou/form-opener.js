import openPage from "../../util/open-page";
import strftime from "strftime";

/**
 * Opener for a publish form in Narou.
 */
export default class NarouFormOpener {
  /**
   * @param {string} baseUrl - A base URL of Narou.
   */
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
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
    const novelId = _.get(pub, "sites.narou.novelId");
    if (!novelId) {
      throw new Error("No sites.narou.novelId in publication data");
    }
    return `${this.baseUrl}/usernovelmanage/ziwainput/ncode/${encodeURIComponent(novelId)}/`;
  }

  _getCode(pub) {
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
