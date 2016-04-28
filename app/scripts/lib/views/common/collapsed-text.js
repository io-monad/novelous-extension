import _ from "lodash";
import React, { PropTypes } from "react";
import classNames from "classnames";

export default class CollapsedText extends React.Component {
  static propTypes = {
    children: PropTypes.any.isRequired,
    expanded: PropTypes.bool,
    defaultExpanded: PropTypes.bool,
    expandable: PropTypes.bool,
  };
  static defaultProps = {
    expandable: true,
  };

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
    const { expandable } = this.props;
    const expanded = this.isExapnded();
    return (
      <div
        className={classNames({
          "collapsed-text": true,
          "collapsed-text--collapsed": !expanded,
          "collapsed-text--expanded": expanded,
          "collapsed-text--exapandable": expandable,
        })}
        onClick={expandable ? this.handleClick : null}
      >
        {this.props.children}
      </div>
    );
  }
}
