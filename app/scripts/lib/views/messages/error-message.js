import React from "react";
import MessageBox from "../common/message-box";

export default class ErrorMessage extends React.Component {
  static propTypes = {
    reason: React.PropTypes.string,
  };

  render() {
    const { reason } = this.props;
    const details = __ENV__ === "development" ? reason : null;
    return (
      <MessageBox message="wentWrong" details={details} icon="exclamation-triangle" />
    );
  }
}
