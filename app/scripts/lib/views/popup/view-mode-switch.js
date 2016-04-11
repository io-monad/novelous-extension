import React, { PropTypes } from "react";
import classNames from "classnames";
import Icon from "../common/icon";

const ViewModeSwitch = ({ allViewModes, viewMode, onChange }) => {
  return (
    <div className="view-mode-switch btn-group">
      {allViewModes.map(mode =>
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

ViewModeSwitch.propTypes = {
  allViewModes: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  })).isRequired,
  viewMode: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default ViewModeSwitch;
