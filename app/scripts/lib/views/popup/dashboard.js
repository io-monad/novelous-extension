import React, { PropTypes } from "react";
import Subscriber from "../../subscriptions/subscriber";
import ItemsSubscriptionFlatItems from "../subscriptions/items-subscription-flat-items";
import StatsSubscriptionFlatItems from "../subscriptions/stats-subscription-flat-items";

const Dashboard = ({ subscriber, unreadItemIds }) => (
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

Dashboard.propTypes = {
  subscriber: PropTypes.instanceOf(Subscriber).isRequired,
  unreadItemIds: PropTypes.object.isRequired,
};

export default Dashboard;
