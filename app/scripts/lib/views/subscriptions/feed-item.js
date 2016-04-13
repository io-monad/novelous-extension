import React, { PropTypes } from "react";
import shallowCompare from "react-addons-shallow-compare";
import classNames from "classnames";
import Subscription from "../../subscriptions/subscription";
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
    this.state = { expanded: this.props.isUnread };
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
  handleClick() {
    this.setState({ expanded: !this.state.expanded });
  }
  render() {
    const { subscription, item, isUnread, isHidden } = this.props;
    const { expanded } = this.state;

    const stop = (ev) => { ev.stopPropagation(); };
    const link = (url, text, children) => (
      url ? <a href={url} title={text} target="_blank" onClick={stop}>{children || text}</a>
        : <span title={text}>{children || text}</span>
    );

    return (
      <article
        className={classNames({
          "feed-item": true,
          "feed-item--single": subscription,
          "feed-item--in-list": !subscription,
          "feed-item--unread": isUnread,
          "feed-item--expandable": !!item.body,
          "feed-item--collapsed": !expanded,
          "feed-item--expanded": expanded,
          hidden: isHidden,
        })}
        onClick={this.handleClick}
      >
        <header className="feed-item__header">
          <h1 className="feed-item__title">
            <div className="feed-item__item-title">
              <Icon name={this.getIconFromItemType(item.type)} />
              {link(item.url, item.title)}
            </div>
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
          <div className="feed-item__footer-right">
            {(item.createdAt || item.updatedAt) &&
              <div className="feed-item__footer-item feed-item__time">
                <Icon name="clock-o" />
                <Time value={item.updatedAt || item.createdAt} />
              </div>
            }
          </div>
          <div className="feed-item__footer-left">
            {subscription &&
              <div className="feed-item__footer-item feed-item__subscription">
                {subscription.siteId
                  ?
                    <img
                      src={`/images/sites/${subscription.siteId}.png`}
                      title={subscription.siteName}
                    />
                  :
                    <Icon name="folder" />
                }
                {link(
                  subscription.feed.url,
                  subscription.siteName ? `${subscription.siteName}: ${subscription.title}`
                  : subscription.title,
                  subscription.title
                )}
              </div>
            }
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
          </div>
        </footer>
      </article>
    );
  }
}

FeedItem.propTypes = {
  subscription: PropTypes.instanceOf(Subscription),
  item: PropTypes.object.isRequired,
  isUnread: PropTypes.bool,
  isHidden: PropTypes.bool,
};

export default FeedItem;
