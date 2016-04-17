import React, { PropTypes } from "react";
import Subscriber from "../../subscriptions/subscriber";
import ItemsSubscriptionFlatItems from "../subscriptions/items-subscription-flat-items";
import StatsSubscriptionFlatItems from "../subscriptions/stats-subscription-flat-items";

export default class Dashboard extends React.Component {
  static propTypes = {
    subscriber: PropTypes.instanceOf(Subscriber).isRequired,
    unreadItemIds: PropTypes.object.isRequired,
  };

  render() {
    const { subscriber, unreadItemIds } = this.props;
    return (
      <div className="dashboard">
        <ItemsSubscriptionFlatItems
          subscriptions={subscriber.itemsSubscriptions}
          unreadItemIds={unreadItemIds}
          unreadOnly
        />
        <StatsSubscriptionFlatItems
          subscriptions={subscriber.statsSubscriptions}
        />
      </div>
    );
  }
}
