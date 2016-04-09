import _ from "lodash";
import React, { PropTypes } from "react";
import Subscription from "../../subscriptions/subscription";
import SubscriptionItem from "./subscription-item";

const SubscriptionList = ({ subscriptions }) => {
  subscriptions = _.sortBy(subscriptions, sub => -sub.newItemsCount);
  return (
    <section className="subscription-list">
      {_.map(subscriptions, sub =>
        <SubscriptionItem key={sub.id} subscription={sub} />
      )}
    </section>
  );
};

SubscriptionList.propTypes = {
  subscriptions: PropTypes.arrayOf(PropTypes.instanceOf(Subscription)).isRequired,
};

export default SubscriptionList;
