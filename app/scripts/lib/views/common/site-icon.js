import _ from "lodash";
import React, { PropTypes } from "react";
import Sites from "../../sites";
import { translate } from "../../util/chrome-util";

export default class SiteIcon extends React.Component {
  static propTypes = {
    name: PropTypes.string,
  };

  render() {
    const { name } = this.props;
    const site = Sites[name];
    const displayName = site ? translate(site.name) : _.startCase(name);
    return (
      <img
        src={site ? site.iconUrl : "/images/sites/other.png"}
        title={displayName}
        alt={displayName}
        className="site-icon"
      />
    );
  }
}
