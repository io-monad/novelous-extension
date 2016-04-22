import React, { PropTypes } from "react";

const stopPropagation = (ev) => { ev.stopPropagation(); };

export default class Link extends React.Component {
  static propTypes = {
    href: PropTypes.string,
    title: PropTypes.string,
    children: PropTypes.any,
  };

  render() {
    const child = this.props.children || this.props.title;
    if (this.props.href) {
      return <a target="_blank" onClick={stopPropagation} {...this.props}>{child}</a>;
    }
    return <span {...this.props}>{child}</span>;
  }
}
