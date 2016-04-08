import React, { PropTypes } from "react";
import classNames from "classnames";
import Subscription from "../../subscriptions/subscription";
import FeedItem from "./feed-item";

export default class SubscriptionItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = { newItemsOnly: true };
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick(ev) {
    let el = ev.target;
    while (el) {
      if (/^a$/i.test(el.tagName)) return;
      el = el.parentNode;
    }
    this.setState({ newItemsOnly: !this.state.newItemsOnly });
  }
  render() {
    const { subscription } = this.props;
    const { newItemsOnly } = this.state;
    if (subscription.items.length === 0) return "";

    const items = newItemsOnly ? subscription.newItems : subscription.items;
    const newItemIds = _.keyBy(_.map(subscription.newItems, "id"));
    return (
      <article
        className={classNames({
          "subscription-item": true,
          "subscription-item--has-items": items.length > 0,
          "subscription-item--has-new-items": subscription.newItemsCount > 0,
          "subscription-item--new-items-only": newItemsOnly,
          panel: true,
          "panel-default": true,
        })}
      >
        <header className="subscription-item__header panel-heading" onClick={this.handleClick}>
          <h1 className="subscription-item__title">
            {newItemsOnly
              ? <i className="fa fa-caret-right" />
                : <i className="fa fa-caret-down" />}
            <a href={subscription.url} target="_blank">{subscription.title}</a>
          </h1>
          <div className="subscription-item__counts">
            {subscription.newItemsCount > 0 &&
              <span className="subscription-item__new-count">{subscription.newItemsCount}</span>
            }
            <span className="subscription-item__item-count">{subscription.items.length}</span>
          </div>
        </header>
        {items.length > 0 &&
          <div className="subscription-item__items panel-body">
            {items.map(item =>
              <FeedItem
                key={item.id}
                item={item}
                isNewItem={!!newItemIds[item.id]}
              />
            )}
          </div>
        }
      </article>
    );
  }
}

SubscriptionItem.propTypes = {
  subscription: PropTypes.instanceOf(Subscription).isRequired,
};
