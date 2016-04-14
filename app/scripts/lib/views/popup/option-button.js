import React from "react";
import { translate, openOptionsPage } from "../../util/chrome-util";
import Icon from "../common/icon";

const OptionButton = () => (
  <button
    title={translate("openOptions")}
    className="option-button btn btn-sm btn-link"
    onClick={openOptionsPage}
  >
    <Icon name="cog" />
    {` ${translate("options")}`}
  </button>
);

export default OptionButton;
