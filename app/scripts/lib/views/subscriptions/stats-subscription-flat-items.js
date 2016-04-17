import React, { PropTypes } from "react";
import StatsSubscription from "../../subscriptions/subscription/stats";
import flattenSubscriptions from "../helpers/flatten-subscriptions";
import StatsSubscriptionItem from "./stats-subscription-item";

export default class StatsSubscriptionFlatItems extends React.Component {
  static propTypes = {
    subscriptions: PropTypes.arrayOf(PropTypes.instanceOf(StatsSubscription)).isRequired,
  };

  render() {
    const { subscriptions } = this.props;
    const entries = flattenSubscriptions(subscriptions, { order: "newerFirst" });
    if (entries.length === 0) {
      return null;
    }
    return (
      <section className="stats-subscription-flat-items panel panel-default">
        <div className="panel-body" style={{ padding: 0 }}>
          {entries.map(entry =>
            <StatsSubscriptionItem key={entry.key} {...entry.props} />
          )}
        </div>
      </section>
    );
  }
}
