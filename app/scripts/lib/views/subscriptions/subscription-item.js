import React, { PropTypes } from "react";
import classNames from "classnames";
import withinElement from "../helpers/within-element";
import Subscription from "../../subscriptions/subscription";
import Icon from "../common/icon";
import FeedItem from "./feed-item";

export default class SubscriptionItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = { unreadOnly: true };
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick(ev) {
    if (withinElement(ev.target, "a")) return;
    this.setState({ unreadOnly: !this.state.unreadOnly });
  }
  render() {
    const { subscription } = this.props;
    const { unreadOnly } = this.state;
    if (subscription.items.length === 0) return null;

    const visibleCount = unreadOnly ? subscription.unreadItems.length : subscription.items.length;
    return (
      <article
        className={classNames({
          "subscription-item": true,
          "subscription-item--has-items": visibleCount > 0,
          "subscription-item--has-unread-items": subscription.unreadItemsCount > 0,
          "subscription-item--unread-items-only": unreadOnly,
          panel: true,
          "panel-default": true,
        })}
      >
        <header className="subscription-item__header panel-heading" onClick={this.handleClick}>
          <h1 className="subscription-item__title">
            <Icon name={`caret-${unreadOnly ? "right" : "down"}`} />
            <a href={subscription.url} target="_blank">{subscription.title}</a>
          </h1>
          <div className="subscription-item__counts">
            {subscription.unreadItemsCount > 0 &&
              <span className="subscription-item__unread-count">
                {subscription.unreadItemsCount}
              </span>
            }
            <span className="subscription-item__item-count">
              {subscription.items.length}
            </span>
          </div>
        </header>
        <div className="subscription-item__items panel-body">
          <div>
            {subscription.unreadItems.map(item =>
              <FeedItem key={item.id} item={item} isUnread />
            )}
          </div>
          <div style={{ display: unreadOnly ? "none" : "" }}>
            {subscription.readItems.map(item =>
              <FeedItem key={item.id} item={item} />
            )}
          </div>
        </div>
      </article>
    );
  }
}

SubscriptionItem.propTypes = {
  subscription: PropTypes.instanceOf(Subscription).isRequired,
};
