import React, { PropTypes } from "react";

const Num = ({ children }) => {
  const commaNumber = children.toString().replace(/(\d)(?=(?:\d{3})+$)/g, "$1,");
  return (
    <span className="num">
      {commaNumber}
    </span>
  );
};

Num.propTypes = {
  children: PropTypes.number,
};

export default Num;
