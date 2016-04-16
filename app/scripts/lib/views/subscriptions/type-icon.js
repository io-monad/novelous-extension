import React, { PropTypes } from "react";
import Icon from "../common/icon";

const TypeToIcon = {
  novel: "book",
  message: "envelope-o",
  comment: "comment-o",
  review: "pencil",
  blog: "file-text-o",
  news: "file-text-o",
  other: "asterisk",
};

const TypeIcon = ({ type }) => {
  return (
    <Icon name={TypeToIcon[type] || TypeToIcon.other} />
  );
};

TypeIcon.propTypes = {
  type: PropTypes.string.isRequired,
};

export default TypeIcon;
