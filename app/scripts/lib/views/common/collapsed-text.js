import React, { PropTypes } from "react";
import classNames from "classnames";

export default class CollapsedText extends React.Component {
  constructor(props) {
    super(props);
    this.state = { expanded: this.props.defaultExpanded || false };
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick() {
    if (!_.isUndefined(this.props.expanded)) return;
    this.setState({ expanded: !this.state.expanded });
  }
  isExapnded() {
    if (_.isUndefined(this.props.expanded)) {
      return this.state.expanded;
    } else {
      return this.props.expanded;
    }
  }
  render() {
    const expanded = this.isExapnded();
    return (
      <div
        className={classNames({
          "collapsed-text": true,
          "collapsed-text--collapsed": !expanded,
          "collapsed-text--expanded": expanded,
        })}
        onClick={this.handleClick}
      >
        {this.props.children}
      </div>
    );
  }
}

CollapsedText.propTypes = {
  children: PropTypes.any.isRequired,
  expanded: PropTypes.bool,
  defaultExpanded: PropTypes.bool,
};
