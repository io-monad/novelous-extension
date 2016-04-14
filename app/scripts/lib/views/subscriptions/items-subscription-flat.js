import _ from "lodash";
import React, { PropTypes } from "react";
import Subscription from "../../subscriptions/subscription";
import FeedItem from "./feed-item";

const ItemsSubscriptionFlat = ({ subscriptions, unreadItemIds }) => {
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
  ));

  return (
    <section className="items-subscription-flat panel panel-default">
      <div className="panel-body">
        {_.map(flattenedEntries, (entry) =>
          <FeedItem key={entry.id} {...entry} />
        )}
      </div>
    </section>
  );
};

ItemsSubscriptionFlat.propTypes = {
  subscriptions: PropTypes.arrayOf(PropTypes.instanceOf(Subscription)).isRequired,
  unreadItemIds: PropTypes.object.isRequired,
};

export default ItemsSubscriptionFlat;
