import React, { PropTypes } from "react";
import Subscription from "../../subscriptions/subscription";
import flattenSubscriptions from "../helpers/flatten-subscriptions";
import ItemsSubscriptionItem from "./items-subscription-item";

export default class ItemsSubscriptionFlatItems extends React.Component {
  static propTypes = {
    subscriptions: PropTypes.arrayOf(PropTypes.instanceOf(Subscription)).isRequired,
    unreadItemIds: PropTypes.object.isRequired,
    unreadOnly: PropTypes.bool,
  };

  render() {
    const { subscriptions, unreadItemIds, unreadOnly } = this.props;
    const entries = flattenSubscriptions(subscriptions, {
      unreadItemIds,
      unreadOnly,
      order: ["unreadFirst", "newerFirst"],
    });
    if (entries.length === 0) {
      return null;
    }

    return (
      <section className="items-subscription-flat panel panel-default">
        <div className="panel-body" style={{ padding: 0 }}>
          {entries.map(entry =>
            <ItemsSubscriptionItem key={entry.key} {...entry.props} />
          )}
        </div>
      </section>
    );
  }
}
