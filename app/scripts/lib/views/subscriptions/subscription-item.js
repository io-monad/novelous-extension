import React, { PropTypes } from "react";
import classNames from "classnames";
import withinElement from "../helpers/within-element";
import Subscription from "../../subscriptions/subscription";
import FeedItem from "./feed-item";

export default class SubscriptionItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = { newItemsOnly: true };
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick(ev) {
    if (withinElement(ev.target, "a")) return;
    this.setState({ newItemsOnly: !this.state.newItemsOnly });
  }
  render() {
    const { subscription } = this.props;
    const { newItemsOnly } = this.state;
    if (subscription.items.length === 0) return null;

    const visibleCount = newItemsOnly ? subscription.newItems.length : subscription.items.length;
    return (
      <article
        className={classNames({
          "subscription-item": true,
          "subscription-item--has-items": visibleCount > 0,
          "subscription-item--has-new-items": subscription.newItemsCount > 0,
          "subscription-item--new-items-only": newItemsOnly,
          panel: true,
          "panel-default": true,
        })}
      >
        <header className="subscription-item__header panel-heading" onClick={this.handleClick}>
          <h1 className="subscription-item__title">
            <i className={`fa fa-caret-${newItemsOnly ? "right" : "down"}`} />
            <a href={subscription.url} target="_blank">{subscription.title}</a>
          </h1>
          <div className="subscription-item__counts">
            {subscription.newItemsCount > 0 &&
              <span className="subscription-item__new-count">{subscription.newItemsCount}</span>
            }
            <span className="subscription-item__item-count">{subscription.items.length}</span>
          </div>
        </header>
        <div className="subscription-item__items panel-body">
          <div>
            {subscription.newItems.map(item =>
              <FeedItem key={item.id} item={item} isNewItem />
            )}
          </div>
          <div style={{ display: newItemsOnly ? "none" : "" }}>
            {subscription.seenItems.map(item =>
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
