import _ from "lodash";
import { translate } from "@io-monad/chrome-util";
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
  return openPage(url, code, { update: true });
}

function getURL(pub) {
  const novelId = _.get(pub, "sites.kakuyomu.novelId");
  if (!novelId) {
    throw new Error("No sites.kakuyomu.novelId in publication data");
  }
  return KakuyomuURL.getNewEpisodeFormURL(novelId);
}

function getCode(pub) {
  const embedPub = {
    title: pub.title || "",
    body: pub.body || "",
  };
  if (pub.time) {
    const time = moment(pub.time).tz("Asia/Tokyo");
    embedPub.date = time.format("YYYY-MM-DD");
    embedPub.time = time.format("HH:mm");
  }
  return `
    var pub = ${JSON.stringify(embedPub)};
    var form = document.getElementById("episode-editForm");

    var lastPub = window.novelousLastPublication || { title: "", body: "" };
    if (form.title.value !== lastPub.title || form.body.value !== lastPub.body) {
      if (!confirm(${JSON.stringify(translate("confirmPublishOverwrite"))})) {
        return;
      }
    }

    var change = document.createEvent("HTMLEvents");
    change.initEvent("change", true, true);

    form.title.value = pub.title;
    form.title.dispatchEvent(change);
    form.body.value = pub.body;
    form.body.dispatchEvent(change);

    if (pub.date && pub.time) {
      var button = document.querySelector(".js-reservation-panel-button");
      if (!/isPanelShown/.test(button.className)) {
        button.click();
      }
      document.getElementById("reservationInput-reserved").click();
      form.reservation_date.value = pub.date;
      form.reservation_time.value = pub.time;
    }

    window.novelousLastPublication = pub;
  `;
}
