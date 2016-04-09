import React, { PropTypes } from "react";
import moment from "../../util/moment";

export default class Time extends React.Component {
  constructor(props) {
    super(props);
    this.otherProps = _.without(this.props, _.keys(Time.propTypes));
  }

  componentDidMount() {
    if (this.props.format === "relative") {
      this.timer = setInterval(() => { this.forceUpdate(); }, 3000);
    }
  }
  componentWillUnmount() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  getISODate() {
    return moment(this.props.value).toISOString();
  }
  getTitle() {
    return moment(this.props.value).calendar();
  }
  getFormattedDate() {
    const time = moment(this.props.value);
    if (this.props.format === "relative") {
      return time.fromNow();
    } else if (this.props.format === "calendar") {
      return time.calendar();
    } else {
      return time.format(this.props.format);
    }
  }

  render() {
    return (
      <time dateTime={this.getISODate()} title={this.getTitle()} {...this.otherProps}>
        {this.getFormattedDate()}
      </time>
    );
  }
}

Time.propTypes = {
  format: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.instanceOf(Date),
  ]).isRequired,
};
Time.defaultProps = {
  format: "relative",
};