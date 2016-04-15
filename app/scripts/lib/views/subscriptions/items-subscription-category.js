import _ from "lodash";
import React, { PropTypes } from "react";
import classNames from "classnames";
import ItemsSubscription from "../../subscriptions/subscription/items";
import { Link, Icon, SiteIcon } from "../common";
import ItemsSubscriptionItem from "./items-subscription-item";

export default class ItemsSubscriptionCategory extends React.Component {
  constructor(props) {
    super(props);
    this.state = { expanded: false };
    this.handleExpand = this.handleExpand.bind(this);
  }
  handleExpand(ev) {
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
    const cls = "items-subscription-category";
    return (
      <article
        className={classNames({
          [cls]: true,
          [`${cls}--has-unread-items`]: unreadCount > 0,
          [`${cls}--expanded`]: expanded,
          [`${cls}--collapsed`]: !expanded,
          "panel": true,
          "panel-default": true,
        })}
      >
        <header className={`${cls}__header panel-heading`} onClick={this.handleExpand}>
          <h1 className={`${cls}__title`}>
            <a href="#" onClick={this.handleExpand}>
              <Icon name={`caret-${expanded ? "down" : "right"}`} />
            </a>
            <SiteIcon name={subscription.siteId} />
            {subscription.siteName ?
              `${subscription.siteName}: ${subscription.title}` : subscription.title
            }
          </h1>
          <div className={`${cls}__links`}>
            <Link href={subscription.url} className="btn btn-default btn-xs">
              <Icon name="external-link" />
            </Link>
          </div>
          <div className={`${cls}__counts`}>
            {unreadCount > 0 &&
              <span className={`${cls}__unread-count`}>
                {unreadCount}
              </span>
            }
            <span className={`${cls}__item-count`}>
              {items.length}
            </span>
          </div>
        </header>
        <div className={`${cls}__items panel-body`}>
          {items.map(item =>
            <ItemsSubscriptionItem
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

ItemsSubscriptionCategory.propTypes = {
  subscription: PropTypes.instanceOf(ItemsSubscription).isRequired,
  unreadItemIds: PropTypes.object.isRequired,
};
