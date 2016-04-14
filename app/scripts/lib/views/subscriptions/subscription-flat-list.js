import _ from "lodash";
import React, { PropTypes } from "react";
import ItemsSubscription from "../../subscriptions/subscription/items";
import FeedItem from "./feed-item";

const MAX_FLAT_ITEMS = 50;  // Not customizable currently

const SubscriptionFlatList = ({ subscriptions, unreadItemIds }) => {
  const entries = _.flatMap(subscriptions, subscription => {
    const unread = unreadItemIds[subscription.id] || {};
    return _.map(subscription.items, item => ({
      id: `${subscription.id}::${item.id}`,
      isUnread: !!unread[item.id],
      subscription,
      item,
    }));
  });
  const flattenedEntries = _.sortBy(entries, entry => (
    -entry.item.createdAt * (entry.isUnread ? 2 : 1),  // Prioritize unread
  )).slice(0, MAX_FLAT_ITEMS);

  return (
    <section className="subscription-flat-list panel panel-default">
      <div className="panel-body">
        {_.map(flattenedEntries, (entry) =>
          <FeedItem key={entry.id} {...entry} />
        )}
      </div>
    </section>
  );
};

SubscriptionFlatList.propTypes = {
  subscriptions: PropTypes.arrayOf(PropTypes.instanceOf(ItemsSubscription)).isRequired,
  unreadItemIds: PropTypes.object.isRequired,
};

export default SubscriptionFlatList;
