import React, { PropTypes } from "react";
import SubscriptionList from "../subscriptions/subscription-list";
import Subscription from "../../subscriptions/subscription";

const PopupView = ({ subscriptions }) => {
  return (
    <div className="popup-view">
      <SubscriptionList subscriptions={subscriptions} />
    </div>
  );
};

PopupView.propTypes = {
  subscriptions: PropTypes.arrayOf(PropTypes.instanceOf(Subscription)).isRequired,
};

export default PopupView;
