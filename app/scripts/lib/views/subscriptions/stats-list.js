import _ from "lodash";
import React, { PropTypes } from "react";
import ReactTooltip from "react-tooltip";
import StatsItem from "./stats-item";

const STAT_ORDERS = _.invert([
  "point",
  "starCount", "ratePoint",
  "bookmarkCount", "followerCount",
  "reviewCount",
]);
const STAT_PROPS = {
  point: { icon: "plus", unit: "unitPoints" },
  starCount: { icon: "star" },
  ratePoint: { icon: "star", unit: "unitPoints" },
  bookmarkCount: { icon: "bookmark" },
  followerCount: { icon: "bookmark" },
  reviewCount: { icon: "pencil" },
  other: { icon: "asterisk" },
};

const StatsList = ({ statsLog, links }) => {
  links = links || {};
  const keys = _.sortBy(_.keys(statsLog.stats), k => STAT_ORDERS[k] || Infinity);
  return (
    <div className="stats-list">
      <ReactTooltip id="stats-tooltip" effect="solid" />
      <div className="stats-list__items">
        {keys.map(key =>
          <StatsItem
            key={key}
            label={key}
            link={links[key]}
            timestamps={statsLog.timestamps}
            values={statsLog.stats[key]}
            {...(STAT_PROPS[key] || STAT_PROPS.other)}
          />
        )}
      </div>
    </div>
  );
};

StatsList.propTypes = {
  statsLog: PropTypes.shape({
    timestamps: PropTypes.arrayOf(PropTypes.number).isRequired,
    stats: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.number)).isRequired,
  }).isRequired,
  links: PropTypes.objectOf(PropTypes.string),
};

export default StatsList;
