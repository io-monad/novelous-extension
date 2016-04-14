import _ from "lodash";
import React, { PropTypes } from "react";
import ItemsSubscription from "../../subscriptions/subscription/items";
import SubscriptionItem from "./subscription-item";

const SubscriptionCategoryList = ({ subscriptions, unreadItemIds }) => {
  subscriptions = _.sortBy(subscriptions, sub => -sub.unreadItemsCount);
  return (
    <section className="subscription-category-list">
      {_.map(subscriptions, sub =>
        <SubscriptionItem
          key={sub.id}
          subscription={sub}
          unreadItemIds={unreadItemIds[sub.id] || {}}
        />
      )}
    </section>
  );
};

SubscriptionCategoryList.propTypes = {
  subscriptions: PropTypes.arrayOf(PropTypes.instanceOf(ItemsSubscription)).isRequired,
  unreadItemIds: PropTypes.object.isRequired,
};

export default SubscriptionCategoryList;
