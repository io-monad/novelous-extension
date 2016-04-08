import React, { PropTypes } from "react";
import classNames from "classnames";
import Str from "./str";

const MessageBox = ({ str, details, icon, spin, children }) => (
  <div className={`message-box message-box--${_.kebabCase(str)}-message`}>
    <div className="message-box__icon">
      <i
        className={classNames({
          fa: true,
          [`fa-${icon}`]: true,
          "fa-spin": spin,
        })}
      />
    </div>
    <p className="message-box__text">
      <Str name={str} />
    </p>
    {details ? <p className="message-box__details">{details}</p> : ""}
    {children}
  </div>
);

MessageBox.propTypes = {
  str: PropTypes.string.isRequired,
  details: PropTypes.string,
  icon: PropTypes.string.isRequired,
  spin: PropTypes.bool,
  children: PropTypes.any,
};

export default MessageBox;
