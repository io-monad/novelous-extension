import _ from "lodash";
import React, { PropTypes } from "react";
import { translate } from "../../util/chrome-util";
import Subscription from "../../subscriptions/subscription";
import SubscriptionItem from "./subscription-item";
import FeedItem from "./feed-item";

const MAX_FLAT_ITEMS = 50;  // Not customizable currently

export default class SubscriptionList extends React.Component {
  renderInFlatItems() {
    if (!this.flattenedEntries) {
      const entries = _.flatMap(this.props.subscriptions, subscription => {
        const unreadItems = _.keyBy(subscription.unreadItems, item => item.id);
        return _.map(subscription.items, item => ({
          id: `${subscription.id}::${item.id}`,
          isUnread: !!unreadItems[item.id],
          subscription,
          item,
        }));
      });
      this.flattenedEntries = _.sortBy(entries, entry => (
        -entry.item.createdAt * (entry.isUnread ? 2 : 1),  // Prioritize unread
      )).slice(0, MAX_FLAT_ITEMS);
    }
    return (
      <section className="subscription-list subscription-list--flat panel panel-default">
        <div className="panel-body">
          {_.map(this.flattenedEntries, (entry) =>
            <FeedItem key={entry.id} {...entry} />
          )}
        </div>
      </section>
    );
  }

  renderInFolders() {
    if (!this.sortedSubscriptions) {
      this.sortedSubscriptions = _.sortBy(this.props.subscriptions, sub => -sub.unreadItemsCount);
    }
    return (
      <section className="subscription-list subscription-list--categorized">
        {_.map(this.sortedSubscriptions, sub =>
          <SubscriptionItem key={sub.id} subscription={sub} />
        )}
      </section>
    );
  }

  render() {
    switch (this.props.viewMode) {
      case "flat":
        return this.renderInFlatItems();
      case "categorized":
        return this.renderInFolders();
      default:
        return null;
    }
  }
}

SubscriptionList.viewModes = [
  { name: "flat", title: translate("viewModeFlat"), icon: "list-ul" },
  { name: "categorized", title: translate("viewModeCategorized"), icon: "folder" },
];
SubscriptionList.defaultViewMode = SubscriptionList.viewModes[0].name;

SubscriptionList.propTypes = {
  subscriptions: PropTypes.arrayOf(PropTypes.instanceOf(Subscription)).isRequired,
  viewMode: PropTypes.oneOf(_.map(SubscriptionList.viewModes, "name")),
};

export default SubscriptionList;
