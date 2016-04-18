import _ from "lodash";
import React, { PropTypes } from "react";
import { Link, Icon } from "../common";

export default class LinkList extends React.Component {
  static propTypes = {
    links: PropTypes.arrayOf(PropTypes.shape({
      key: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
      label: PropTypes.string,
      icon: PropTypes.string,
    })).isRequired,
  };

  render() {
    const { links } = this.props;
    return (
      <ul className="link-list">
        {links.map(({ key, url, label, icon }) =>
          <li key={key} className="link-list__item">
            <Link href={url}>
              <Icon name={icon || "link"} />
              { label || _.startCase(key) }
            </Link>
          </li>
        )}
      </ul>
    );
  }
}
