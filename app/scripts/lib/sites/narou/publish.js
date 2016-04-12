import _ from "lodash";
import moment from "../../util/moment";
import openPage from "../../util/open-page";
import NarouURL from "./url";

/**
 * Open a publish form with publication values set.
 *
 * @param {Publication} publication - A Publication to be set.
 * @return {Promise}
 */
export default function publish(publication) {
  const url = getURL(publication);
  const code = getCode(publication);
  return openPage(url, code);
}

function getURL(pub) {
  const novelId = _.get(pub, "sites.narou.novelId");
  if (!novelId) {
    throw new Error("No sites.narou.novelId in publication data");
  }
  return NarouURL.getNewEpisodeFormURL(novelId);
}

function getCode(pub) {
  const title = JSON.stringify(pub.title || "");
  const body = JSON.stringify(pub.body || "");
  let code = `
    var form = document.getElementById("manage_form");
    form.subtitle.value = ${title};
    form.novel.value = ${body};
  `;

  if (pub.time) {
    const time = moment(pub.time).tz("Asia/Tokyo");
    const monthValue = JSON.stringify(time.format("YYYY-MM"));
    const dayValue = JSON.stringify(time.format("D"));
    const hourValue = JSON.stringify(time.format("H"));
    code += `
      form.month.value = ${monthValue};
      form.day.value = ${dayValue};
      form.hour.value = ${hourValue};
    `;
  }

  return code;
}
