import React, { PropTypes } from "react";
import classNames from "classnames";

const Icon = ({ name, spin }) => {
  return (
    <i
      className={classNames({
        fa: true,
        [`fa-${name}`]: true,
        "fa-spin": spin,
      })}
    />
  );
};

Icon.propTypes = {
  name: PropTypes.string.isRequired,
  spin: PropTypes.bool,
};

export default Icon;
