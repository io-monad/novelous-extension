import React, { PropTypes } from "react";
import ReactTooltip from "react-tooltip";
import StatsItem from "./stats-item";

export default class StatsList extends React.Component {
  static propTypes = {
    stats: PropTypes.arrayOf(PropTypes.shape({
      key: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
      label: PropTypes.string,
      icon: PropTypes.string,
      unit: PropTypes.string,
      link: PropTypes.string,
    })).isRequired,
    statsLog: PropTypes.shape({
      stats: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.number)).isRequired,
    }).isRequired,
  };

  render() {
    const { stats, statsLog } = this.props;
    return (
      <div className="stats-list">
        <ReactTooltip id="stats-tooltip" effect="solid" />
        <div className="stats-list__items">
          {stats.map(stat =>
            <StatsItem
              key={stat.key}
              stat={stat}
              values={statsLog.stats[stat.key]}
            />
          )}
        </div>
      </div>
    );
  }
}
