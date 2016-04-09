import React, { PropTypes } from "react";
import AppData from "../../app/app-data";

const OptionsView = ({ /* appData */ }) => {
  return (
    <div className="options-view">
    </div>
  );
};

OptionsView.propTypes = {
  appData: PropTypes.arrayOf(PropTypes.instanceOf(AppData)).isRequired,
};

export default OptionsView;
