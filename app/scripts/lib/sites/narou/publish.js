import _ from "lodash";
import { translate } from "@io-monad/chrome-util";
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
  return openPage(url, code, { update: true });
}

function getURL(pub) {
  const novelId = _.get(pub, "sites.narou.novelId");
  if (!novelId) {
    throw new Error("No sites.narou.novelId in publication data");
  }
  return NarouURL.getNewEpisodeFormURL(novelId);
}

function getCode(pub) {
  const embedPub = {
    title: pub.title || "",
    body: pub.body || "",
  };
  if (pub.time) {
    const time = moment(pub.time).tz("Asia/Tokyo");
    embedPub.date = time.format("YYYY年M月D日");
    embedPub.hour = time.format("H");
  }
  return `
    var pub = ${JSON.stringify(embedPub)};
    var form = document.getElementById("manage_form");

    var lastPub = window.novelousLastPublication || { title: "", body: "" };
    if (form.subtitle.value !== lastPub.title || form.novel.value !== lastPub.body) {
      if (!confirm(${JSON.stringify(translate("confirmPublishOverwrite"))})) {
        return;
      }
    }

    form.subtitle.value = pub.title;
    form.novel.value = pub.body;

    if (pub.date) {
      form.reserve_date.value = pub.date;
      form.hour.value = pub.hour;
    }

    window.novelousLastPublication = pub;
  `;
}
