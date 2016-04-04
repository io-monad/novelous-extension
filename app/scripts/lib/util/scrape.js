import cheerio from "cheerio";

/**
 * Simple scraping utility using cheerio
 */
export default function scrape(html) {
  const $page = cheerio.load(html);
  _.extend($page, scrape.parsers);
  return $page;
}

scrape.fetch = (url) => {
  return new Promise((resolve, reject) => {
    jQuery.ajax(url)
    .done((html) => resolve(scrape(html)))
    .fail((xhr, status) => reject(status));
  });
};

function stringify(str) {
  if (str && typeof str.text === "function") str = str.text();
  if (_.isElement(str) || (_.isObject(str) && str.type === "tag")) {
    str = $(str).text();
  }
  return _.toString(str);
}

scrape.parsers = {
  text(str) {
    return stringify(str).replace(/^[ \t\r\n]+|[ \t\r\n]+$/g, "");
  },

  number(str, re = /([\d,]+)/) {
    const matched = stringify(str).match(re);
    return matched ? parseInt(matched[1].replace(",", ""), 10) : 0;
  },

  keywords(str, re = /\s+/) {
    return _.reject(stringify(str).split(re), _.isEmpty);
  },

  localTime(str, re = /(\d{4})\D+(\d+)\D+(\d+)\D+(\d+)\D+(\d+)(?:\D+(\d+))?/, tz = "+0900") {
    const matched = stringify(str).match(re);
    if (matched) {
      const [, y, m, d, h, i, s] = matched;
      return (new Date(`${y}-${m}-${d} ${h}:${i}:${s || 0} ${tz}`)).getTime();
    }
    return null;
  },
};
