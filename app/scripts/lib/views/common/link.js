import React, { PropTypes } from "react";

const stopPropagation = (ev) => { ev.stopPropagation(); };

const Link = (props) => {
  const child = props.children || props.title;
  if (props.href) {
    return <a {...props} target="_blank" onClick={stopPropagation}>{child}</a>;
  } else {
    return <span {...props}>{child}</span>;
  }
};

Link.propTypes = {
  href: PropTypes.string,
  title: PropTypes.string,
  children: PropTypes.any,
};

export default Link;
