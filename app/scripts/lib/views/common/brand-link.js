import React, { PropTypes } from "react";
import { translate, getStorePageUrl } from "../../util/chrome-util";
import AppInfo from "../../../../../package.json";
import Link from "../common/link";

export default class BrandLink extends React.Component {
  static propTypes = {
    showVersion: PropTypes.bool,
  };

  render() {
    return (
      <Link
        {...this.props}
        href={getStorePageUrl()}
        title={`${translate("appName")} ver ${AppInfo.version}`}
      >
        <img src="/images/icon-38.png" alt={translate("appName")} />
        {this.props.showVersion &&
          <span className="app-brand--version">{`ver ${AppInfo.version}`}</span>}
      </Link>
    );
  }
}
