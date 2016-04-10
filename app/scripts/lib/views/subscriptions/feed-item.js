import React, { PropTypes } from "react";
import shallowCompare from "react-addons-shallow-compare";
import classNames from "classnames";
import withinElement from "../helpers/within-element";
import Icon from "../common/icon";
import Time from "../common/time";
import CollapsedText from "../common/collapsed-text";

const ItemTypeIcons = {
  message: "envelope-o",
  comment: "comment-o",
  review: "bookmark",
  other: "asterisk",
};
const SourceTypeIcons = {
  blog: "file-text-o",
  novel: "book",
  other: "feed",
};

export default class FeedItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = { expanded: false };
    this.handleClick = this.handleClick.bind(this);
  }
  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }
  getIconFromItemType(itemType) {
    return ItemTypeIcons[itemType] || ItemTypeIcons.other;
  }
  getIconFromSourceType(sourceType) {
    return SourceTypeIcons[sourceType] || SourceTypeIcons.other;
  }
  handleClick(ev) {
    if (withinElement(ev.target, "a")) return;
    this.setState({ expanded: !this.state.expanded });
  }
  render() {
    const { item, isUnread } = this.props;
    const { expanded } = this.state;
    const link = (url, text) => (url ? <a href={url} target="_blank">{text}</a> : text);
    return (
      <article
        className={classNames({
          "feed-item": true,
          "feed-item--unread": isUnread,
          "feed-item--expandable": !!item.body,
          "feed-item--collapsed": !expanded,
          "feed-item--expanded": expanded,
        })}
        onClick={this.handleClick}
      >
        <header className="feed-item__header">
          <h1 className="feed-item__title">
            <Icon name={this.getIconFromItemType(item.type)} />
            {link(item.url, item.title)}
          </h1>
        </header>
        {item.body &&
          <div className="feed-item__body">
            <CollapsedText expanded={expanded}>
              {expanded ? item.body : item.body.slice(0, 100)}
            </CollapsedText>
          </div>
        }
        <footer className="feed-item__footer">
          {item.authorName &&
            <div className="feed-item__footer-item feed-item__author">
              <Icon name="user" />
              {link(item.authorUrl, item.authorName)}
            </div>
          }
          {item.sourceTitle &&
            <div className="feed-item__footer-item feed-item__source">
              <Icon name={this.getIconFromSourceType(item.sourceType)} />
              {link(item.sourceUrl, item.sourceTitle)}
            </div>
          }
          {(item.createdAt || item.updatedAt) &&
            <div className="feed-item__footer-item feed-item__time">
              <Icon name="clock-o" />
              <Time value={item.updatedAt || item.createdAt} />
            </div>
          }
        </footer>
      </article>
    );
  }
}

FeedItem.propTypes = {
  item: PropTypes.object.isRequired,
  isUnread: PropTypes.bool,
};

export default FeedItem;
