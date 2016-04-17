import _ from "lodash";
import React, { PropTypes } from "react";
import { translate } from "../../util/chrome-util";

export default class Str extends React.Component {
  static propTypes = {
    name: PropTypes.string,
    args: PropTypes.arrayOf(PropTypes.string),
    defaults: PropTypes.string,
    children: PropTypes.string,
  };

  render() {
    const { name, args, defaults, children } = this.props;
    const otherProps = _.without(this.props, _.keys(Str.propTypes));

    if (!name && !children) {
      console.error("Missing translation name");
      return <span {...otherProps} />;
    }

    let translated = translate(
      name || children,
      args || [],
      defaults || null
    );
    if (!translated && children) {
      translated = children;
    }
    if (!translated) {
      console.error(`Missing translation for: ${name}`);
      return <span {...otherProps} />;
    }

    return <span {...otherProps}>{translated}</span>;
  }
}
