import _ from "lodash";
import React, { PropTypes } from "react";
import ItemsSubscription from "../../subscriptions/subscription/items";
import ItemsSubscriptionCategory from "./items-subscription-category";

export default class ItemsSubscriptionCategories extends React.Component {
  static propTypes = {
    subscriptions: PropTypes.arrayOf(PropTypes.instanceOf(ItemsSubscription)).isRequired,
    unreadItemIds: PropTypes.object.isRequired,
  };

  render() {
    const { subscriptions, unreadItemIds } = this.props;
    const sortedSubscriptions = _.sortBy(subscriptions, sub => -sub.unreadItemsCount);
    return (
      <section className="items-subscription-categories">
        {_.map(sortedSubscriptions, sub =>
          <ItemsSubscriptionCategory
            key={sub.id}
            subscription={sub}
            unreadItemIds={unreadItemIds[sub.id] || {}}
          />
        )}
      </section>
    );
  }
}
