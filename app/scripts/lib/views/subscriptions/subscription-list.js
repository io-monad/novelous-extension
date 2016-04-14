import React, { PropTypes } from "react";
import ItemsSubscription from "../../subscriptions/subscription/items";
import SubscriptionCategoryList from "./subscription-category-list";
import SubscriptionFlatList from "./subscription-flat-list";

const SubscriptionList = (props) => {
  if (props.categorized) {
    return <SubscriptionCategoryList {...props} />;
  } else {
    return <SubscriptionFlatList {...props} />;
  }
};

SubscriptionList.propTypes = {
  subscriptions: PropTypes.arrayOf(PropTypes.instanceOf(ItemsSubscription)).isRequired,
  unreadItemIds: PropTypes.object.isRequired,
  categorized: PropTypes.bool.isRequired,
};

export default SubscriptionList;
