import React, { PropTypes } from "react";
import classNames from "classnames";

export default class Icon extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    spin: PropTypes.bool,
  };

  render() {
    const { name, spin } = this.props;
    return (
      <i
        className={classNames({
          "fa": true,
          [`fa-${name}`]: true,
          "fa-spin": spin,
        })}
      />
    );
  }
}
