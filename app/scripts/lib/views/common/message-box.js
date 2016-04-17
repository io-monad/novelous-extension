import _ from "lodash";
import React, { PropTypes } from "react";
import Icon from "./icon";
import Str from "./str";

export default class MessageBox extends React.Component {
  static propTypes = {
    message: PropTypes.string.isRequired,
    details: PropTypes.string,
    icon: PropTypes.string.isRequired,
    spin: PropTypes.bool,
    children: PropTypes.any,
  };

  render() {
    const { message, details, icon, spin, children } = this.props;
    return (
      <div className={`message-box message-box--${_.kebabCase(message)}-message`}>
        <div className="message-box__icon">
          <Icon name={icon} spin={spin} />
        </div>
        <p className="message-box__text">
          <Str name={message} />
        </p>
        {details ? <p className="message-box__details">{details}</p> : ""}
        {children}
      </div>
    );
  }
}
