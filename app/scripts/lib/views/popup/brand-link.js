import React from "react";
import { translate, getStorePageUrl } from "../../util/chrome-util";
import AppInfo from "../../../../../package.json";
import Link from "../common/link";

const BrandLink = () => (
  <Link href={getStorePageUrl()} title={`${translate("appName")} ver ${AppInfo.version}`}>
    <img src="/images/icon-38.png" alt={translate("appName")} />
  </Link>
);

export default BrandLink;
