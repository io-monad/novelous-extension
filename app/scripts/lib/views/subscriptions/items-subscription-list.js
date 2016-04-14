import _ from "lodash";
import React, { PropTypes } from "react";
import ItemsSubscription from "../../subscriptions/subscription/items";
import ItemsSubscriptionItem from "./items-subscription-item";

const ItemsSubscriptionList = ({ subscriptions, unreadItemIds }) => {
  subscriptions = _.sortBy(subscriptions, sub => -sub.unreadItemsCount);
  return (
    <section className="items-subscription-list">
      {_.map(subscriptions, sub =>
        <ItemsSubscriptionItem
          key={sub.id}
          subscription={sub}
          unreadItemIds={unreadItemIds[sub.id] || {}}
        />
      )}
    </section>
  );
};

ItemsSubscriptionList.propTypes = {
  subscriptions: PropTypes.arrayOf(PropTypes.instanceOf(ItemsSubscription)).isRequired,
  unreadItemIds: PropTypes.object.isRequired,
};

export default ItemsSubscriptionList;
