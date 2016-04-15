import React, { PropTypes } from "react";
import Subscriber from "../../subscriptions/subscriber";
import ItemsSubscriptionFlat from "../subscriptions/items-subscription-flat";
import ItemsSubscriptionList from "../subscriptions/items-subscription-list";
import BrandLink from "./brand-link";
import ViewModeSwitch from "./view-mode-switch";
import OptionButton from "./option-button";

export default class PopupView extends React.Component {
  constructor(props) {
    super(props);
    this.state = { viewMode: ViewModeSwitch.defaultViewMode };
    this.handleViewModeChange = this.handleViewModeChange.bind(this);
  }

  handleViewModeChange(viewMode) {
    this.setState({ viewMode });
  }

  render() {
    const { subscriber, unreadItemIds } = this.props;
    const { viewMode } = this.state;
    return (
      <div className="popup-view">
        <div className="popup-view__header">
          <div className="popup-view__brand">
            <BrandLink />
          </div>
          <div className="popup-view__buttons btn-toolbar">
            <OptionButton />
            <ViewModeSwitch viewMode={viewMode} onChange={this.handleViewModeChange} />
          </div>
        </div>

        {viewMode === "categorized"
          ?
            <ItemsSubscriptionList
              subscriptions={subscriber.itemsSubscriptions}
              unreadItemIds={unreadItemIds}
            />
          :
            <ItemsSubscriptionFlat
              subscriptions={subscriber.itemsSubscriptions}
              unreadItemIds={unreadItemIds}
            />
        }
      </div>
    );
  }
}

PopupView.propTypes = {
  subscriber: PropTypes.instanceOf(Subscriber).isRequired,
  unreadItemIds: PropTypes.object.isRequired,
};
