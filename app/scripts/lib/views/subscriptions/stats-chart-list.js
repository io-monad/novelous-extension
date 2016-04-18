import _ from "lodash";
import React, { PropTypes } from "react";
import { StatIcon, sortLabels, getLabelDisplay } from "./stat";
import StatsChart from "./stats-chart";

export default class StatsChartList extends React.Component {
  static propTypes = {
    statsLog: PropTypes.shape({
      timestamps: PropTypes.arrayOf(PropTypes.number).isRequired,
      stats: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.number)).isRequired,
    }).isRequired,
  };

  render() {
    const { statsLog: { timestamps, stats } } = this.props;
    const statLables = sortLabels(_.keys(stats));
    return (
      <section className="stats-chart-list">
        {statLables.map(label =>
          <section key={label} className="stats-chart-list__item">
            <h1 className="stats-chart-list__title">
              <StatIcon label={label} />
              {getLabelDisplay(label)}
            </h1>
            <StatsChart
              label={label}
              timestamps={timestamps}
              values={stats[label]}
            />
          </section>
        )}
      </section>
    );
  }
}
