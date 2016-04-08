import React from "react";
import MessageBox from "../common/message-box";

const ErrorMessage = ({ reason }) => {
  const details = __ENV__ === "development" ? reason : null;
  return (
    <MessageBox message="wentWrong" details={details} icon="exclamation-triangle" />
  );
};

ErrorMessage.propTypes = {
  reason: React.PropTypes.string,
};

export default ErrorMessage;
