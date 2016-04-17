import React, { PropTypes } from "react";

export default class Num extends React.Component {
  static propTypes = {
    children: PropTypes.number,
  };

  render() {
    const commaNumber = this.props.children.toString().replace(/(\d)(?=(?:\d{3})+$)/g, "$1,");
    return (
      <span className="num">
        {commaNumber}
      </span>
    );
  }
}
