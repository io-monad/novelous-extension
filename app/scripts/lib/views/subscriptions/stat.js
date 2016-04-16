import _ from "lodash";
import React, { PropTypes } from "react";
import { translate } from "../../util/chrome-util";
import { Icon, Num, Str } from "../common";

const StatOrder = _.invert([
  "point",
  "starCount", "ratePoint",
  "bookmarkCount", "followerCount",
  "reviewCount",
]);
const StatLabelToIcon = {
  point: "plus",
  starCount: "star",
  ratePoint: "star",
  bookmarkCount: "bookmark",
  followerCount: "bookmark",
  reviewCount: "pencil",
  other: "asterisk",
};
const StatUnit = {
  point: "unitPoints",
  ratePoint: "unitPoints",
};

const StatIcon = ({ label }) => (
  <Icon name={StatLabelToIcon[label] || StatLabelToIcon.other} />
);
StatIcon.propTypes = {
  label: PropTypes.string.isRequired,
};

const Stat = ({ label, value }) => (
  <span className="stat">
    <StatIcon label={label} />
    <span className="stat__value"><Num>{value}</Num></span>
    {StatUnit[label] &&
      <span className="stat__unit"><Str>{StatUnit[label]}</Str></span>
    }
  </span>
);
Stat.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
};

module.exports = {
  order: StatOrder,
  getLabelDisplay: (label) => translate(`label-${label}`, _.startCase(label)),
  sortLabels: (labels) => _.sortBy(labels, label => StatOrder[label] || Infinity),
  StatIcon,
  Stat,
};
