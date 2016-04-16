import React, { PropTypes } from "react";
import { translate, getStorePageUrl } from "../../util/chrome-util";
import AppInfo from "../../../../../package.json";
import Link from "../common/link";

const BrandLink = (props) => (
  <Link
    {...props}
    href={getStorePageUrl()}
    title={`${translate("appName")} ver ${AppInfo.version}`}
  >
    <img src="/images/icon-38.png" alt={translate("appName")} />
    {props.showVersion &&
      <span className="app-brand--version">{`ver ${AppInfo.version}`}</span>}
  </Link>
);

BrandLink.propTypes = {
  showVersion: PropTypes.bool,
};

export default BrandLink;
