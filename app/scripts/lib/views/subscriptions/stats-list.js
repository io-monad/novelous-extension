import _ from "lodash";
import React, { PropTypes } from "react";
import ReactTooltip from "react-tooltip";
import StatsItem from "./stats-item";
import { sortLabels } from "./stat";

const StatsList = ({ statsLog, links }) => {
  links = links || {};
  const labels = sortLabels(_.keys(statsLog.stats));
  return (
    <div className="stats-list">
      <ReactTooltip id="stats-tooltip" effect="solid" />
      <div className="stats-list__items">
        {labels.map(label =>
          <StatsItem
            key={label}
            label={label}
            link={links[label]}
            timestamps={statsLog.timestamps}
            values={statsLog.stats[label]}
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
