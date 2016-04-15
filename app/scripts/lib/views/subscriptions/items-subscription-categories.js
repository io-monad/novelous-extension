import _ from "lodash";
import React, { PropTypes } from "react";
import ItemsSubscription from "../../subscriptions/subscription/items";
import ItemsSubscriptionCategory from "./items-subscription-category";

const ItemsSubscriptionCategories = ({ subscriptions, unreadItemIds }) => {
  subscriptions = _.sortBy(subscriptions, sub => -sub.unreadItemsCount);
  return (
    <section className="items-subscription-categories">
      {_.map(subscriptions, sub =>
        <ItemsSubscriptionCategory
          key={sub.id}
          subscription={sub}
          unreadItemIds={unreadItemIds[sub.id] || {}}
        />
      )}
    </section>
  );
};

ItemsSubscriptionCategories.propTypes = {
  subscriptions: PropTypes.arrayOf(PropTypes.instanceOf(ItemsSubscription)).isRequired,
  unreadItemIds: PropTypes.object.isRequired,
};

export default ItemsSubscriptionCategories;
