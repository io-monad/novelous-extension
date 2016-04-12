import _ from "lodash";
import moment from "../../util/moment";
import openPage from "../../util/open-page";
import KakuyomuURL from "./url";

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
  const novelId = _.get(pub, "sites.kakuyomu.novelId");
  if (!novelId) {
    throw new Error("No sites.kakuyomu.novelId in publication data");
  }
  return KakuyomuURL.getNewEpisodeFormURL(novelId);
}

function getCode(pub) {
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
    const time = moment(pub.time).tz("Asia/Tokyo");
    const dateValue = JSON.stringify(time.format("YYYY-MM-DD"));
    const timeValue = JSON.stringify(time.format("HH:mm"));
    code += `
      document.querySelector(".js-reservation-panel-button").click();
      document.getElementById("reservationInput-reserved").click();
      form.reservation_date.value = ${dateValue};
      form.reservation_time.value = ${timeValue};
    `;
  }

  return code;
}
