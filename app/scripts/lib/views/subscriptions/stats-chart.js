import React, { PropTypes } from "react";
import { getLabelDisplay } from "./stat";

export default class StatsChart extends React.Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    xValues: PropTypes.arrayOf(PropTypes.string).isRequired,
    yValues: PropTypes.arrayOf(PropTypes.number).isRequired,
  };

  componentDidMount() {
    const Chart = require("chart.js");
    const ctx = this.canvasElement.getContext("2d");
    this.chart = new Chart(ctx, {
      type: "line",
      data: this.buildChartData(),
      options: {
        title: { display: false },
        legend: { display: false },
      },
    });
  }
  componentWillReceiveProps() {
    this.chart.data = this.buildChartData();
    this.chart.update();
  }
  componentWillUnmount() {
    this.chart.destroy();
    this.chart = null;
  }
  buildChartData() {
    const { label, xValues, yValues } = this.props;
    return {
      labels: xValues,
      datasets: [{
        label: getLabelDisplay(label),
        fill: true,
        borderColor: "rgb(24, 143, 201)",
        backgroundColor: "rgba(24, 143, 201, 0.2)",
        data: yValues,
      }],
    };
  }
  render() {
    return (
      <div className="stats-chart">
        <canvas
          ref={(c) => { this.canvasElement = c; }}
          className="starts-chart__canvas"
          height="100"
        />
      </div>
    );
  }
}
