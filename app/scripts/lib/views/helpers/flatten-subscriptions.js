import _ from "lodash";

export default function flattenSubscriptions(subscriptions, {
  unreadItemIds = {},
  unreadOnly = false,
  order = null,
}) {
  let entries = [];
  _.each(subscriptions, subscription => {
    const unread = unreadItemIds[subscription.id] || {};
    _.each(subscription.items, item => {
      if (unreadOnly && !unread[item.id]) return;
      entries.push({
        key: `${subscription.id}::${item.id}`,
        unreadFirst: unread[item.id] ? 0 : 1,
        newerFirst: -(item.updatedAt || item.createdAt || 0),
        props: {
          isUnread: !!unread[item.id],
          subscription,
          item,
        },
      });
    });
  });
  if (order) {
    entries = _.sortBy(entries, order);
  }
  return entries;
}
