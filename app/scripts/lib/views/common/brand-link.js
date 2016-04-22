import React, { PropTypes } from "react";
import { translate, getVersion, openStorePage } from "@io-monad/chrome-util";
import Link from "../common/link";

export default class BrandLink extends React.Component {
  static propTypes = {
    showVersion: PropTypes.bool,
  };

  render() {
    const version = getVersion();
    return (
      <Link
        {...this.props}
        href="#"
        title={`${translate("appName")} ver ${version}`}
        onClick={(ev) => {
          ev.preventDefault();
          openStorePage();
        }}
      >
        <img src="/images/icon-38.png" alt={translate("appName")} />
        {this.props.showVersion &&
          <span className="app-brand--version">{`ver ${version}`}</span>}
      </Link>
    );
  }
}
