import _ from "lodash";
import React, { PropTypes } from "react";
import moment from "../../util/moment";

export default class StatsChart extends React.Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    timestamps: PropTypes.arrayOf(PropTypes.number).isRequired,
    values: PropTypes.arrayOf(PropTypes.number).isRequired,
  };
  static chartOption = {
    type: "line",
    options: {
      title: { display: false },
      legend: { display: false },
      tooltips: {
        callbacks: {
          title: (items, data) => {
            const timestamp = data.labels[items[0].index];
            return moment(timestamp).format("L LT");
          },
        },
      },
      scales: {
        xAxes: [{
          ticks: {
            callback: (timestamp) => moment(timestamp).format("H:mm"),
            maxTicksLimit: 20,
          },
        }],
        yAxes: [{
          ticks: {
            callback: (value) => {
              value = value.toString();
              return /\./.test(value) ? "" : value;
            },
          },
        }],
      },
    },
  };

  componentDidMount() {
    const Chart = require("chart.js");
    const ctx = this.canvasElement.getContext("2d");
    const options = _.extend(
      { data: this.buildChartData() },
      StatsChart.chartOption,
    );
    this.chart = new Chart(ctx, options);
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
    const { label, timestamps, values } = this.props;
    return {
      labels: timestamps,
      datasets: [{
        label,
        fill: true,
        borderColor: "rgb(24, 143, 201)",
        backgroundColor: "rgba(24, 143, 201, 0.2)",
        data: values,
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
