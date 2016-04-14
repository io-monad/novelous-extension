import React, { PropTypes } from "react";
import classNames from "classnames";
import Icon from "../common/icon";
import { translate } from "../../util/chrome-util";

const viewModes = [
  { name: "flat", title: translate("viewModeFlat"), icon: "list-ul" },
  { name: "categorized", title: translate("viewModeCategorized"), icon: "folder" },
];

const ViewModeSwitch = ({ viewMode, onChange }) => {
  return (
    <div className="view-mode-switch btn-group">
      {viewModes.map(mode =>
        <button
          key={mode.name}
          title={mode.title}
          onClick={() => onChange(mode.name)}
          className={classNames({
            "view-mode-switch__item": true,
            btn: true,
            "btn-sm": true,
            "btn-default": true,
            active: mode.name === viewMode,
          })}
        >
          <Icon name={mode.icon} />
        </button>
      )}
    </div>
  );
};

ViewModeSwitch.viewModes = viewModes;
ViewModeSwitch.defaultViewMode = viewModes[0].name;

ViewModeSwitch.propTypes = {
  viewMode: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default ViewModeSwitch;
