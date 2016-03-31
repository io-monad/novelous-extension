/**
 * Simple scraping utility using jQuery
 */
export default function scrape(html) {
  const $page = jQuery("<div/>").html($.parseHTML(html));
  const $scope = (selector) => $(selector, $page);
  _.extend($scope, scrape.parsers);
  return $scope;
}

scrape.fetch = (url) => {
  return new Promise((resolve, reject) => {
    $.ajax(url)
    .done((html) => resolve(scrape(html)))
    .fail((xhr, status) => reject(status));
  });
};

function stringify(str) {
  if (str && typeof str.text === "function") str = str.text();
  if (_.isElement(str)) str = $(str).text();
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

  localTime(str, re = /(\d{4})\D+(\d+)\D+(\d+)\D+(\d+)\D+(\d+)(?:\D+(\d+))?/) {
    const matched = stringify(str).match(re);
    if (matched) {
      const [, y, m, d, h, i, s] = matched;

      // Use local timezone here as the parsed time.
      return (new Date(y, m, d, h, i, s || 0)).getTime();
    }
    return null;
  },
};
