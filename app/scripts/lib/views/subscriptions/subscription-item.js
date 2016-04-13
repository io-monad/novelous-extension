import _ from "lodash";
import React, { PropTypes } from "react";
import classNames from "classnames";
import Subscription from "../../subscriptions/subscription";
import Icon from "../common/icon";
import FeedItem from "./feed-item";

export default class SubscriptionItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = { expanded: false };
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick(ev) {
    ev.stopPropagation();
    ev.preventDefault();
    this.setState({ expanded: !this.state.expanded });
  }
  render() {
    const { subscription, unreadItemIds } = this.props;
    const { expanded } = this.state;
    if (subscription.items.length === 0) return null;

    const items = _.sortBy(subscription.items, it => -it.createdAt);
    const unreadCount = _.sumBy(items, it => (unreadItemIds[it.id] ? 1 : 0));
    return (
      <article
        className={classNames({
          "subscription-item": true,
          "subscription-item--has-unread-items": unreadCount > 0,
          "subscription-item--expanded": expanded,
          "subscription-item--collapsed": !expanded,
          panel: true,
          "panel-default": true,
        })}
      >
        <header className="subscription-item__header panel-heading" onClick={this.handleClick}>
          <h1 className="subscription-item__title">
            <a href="#" onClick={this.handleClick}>
              <Icon name={`caret-${expanded ? "right" : "down"}`} />
            </a>
            {subscription.siteId &&
              <img src={`/images/sites/${subscription.siteId}.png`} />
            }
            {subscription.siteName ?
              `${subscription.siteName}: ${subscription.title}` : subscription.title
            }
          </h1>
          <div className="subscription-item__links">
            <a href={subscription.url} target="_blank" className="btn btn-default btn-xs"
              onClick={(ev) => { ev.stopPropagation(); }}
            >
              <Icon name="external-link" />
            </a>
          </div>
          <div className="subscription-item__counts">
            {unreadCount > 0 &&
              <span className="subscription-item__unread-count">
                {unreadCount}
              </span>
            }
            <span className="subscription-item__item-count">
              {items.length}
            </span>
          </div>
        </header>
        <div className="subscription-item__items panel-body">
          {items.map(item =>
            <FeedItem
              key={item.id}
              item={item}
              isUnread={!!unreadItemIds[item.id]}
              isHidden={!expanded}
            />
          )}
        </div>
      </article>
    );
  }
}

SubscriptionItem.propTypes = {
  subscription: PropTypes.instanceOf(Subscription).isRequired,
  unreadItemIds: PropTypes.object.isRequired,
};
