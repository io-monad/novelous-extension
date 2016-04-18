import _ from "lodash";
import React, { PropTypes } from "react";
import { Icon } from "../common";
import StatsChart from "./stats-chart";

export default class StatsChartList extends React.Component {
  static propTypes = {
    stats: PropTypes.arrayOf(PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string,
      icon: PropTypes.string,
    })).isRequired,
    statsLog: PropTypes.shape({
      timestamps: PropTypes.arrayOf(PropTypes.number).isRequired,
      stats: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.number)).isRequired,
    }).isRequired,
  };

  render() {
    const { stats, statsLog } = this.props;
    return (
      <section className="stats-chart-list">
        {stats.map(stat =>
          <section key={stat.key} className="stats-chart-list__item">
            <h1 className="stats-chart-list__title">
              <Icon name={stat.icon || "asterisk"} />
              {stat.label || _.startCase(stat.key)}
            </h1>
            <StatsChart
              label={stat.label}
              timestamps={statsLog.timestamps}
              values={statsLog.stats[stat.key]}
            />
          </section>
        )}
      </section>
    );
  }
}
