import React, { PropTypes } from "react";
import Subscriber from "../../subscriptions/subscriber";
import ItemsSubscriptionFlatItems from "../subscriptions/items-subscription-flat-items";
import ItemsSubscriptionCategories from "../subscriptions/items-subscription-categories";
import BrandLink from "../common/brand-link";
import ViewModeSwitch from "./view-mode-switch";
import OptionButton from "./option-button";
import Dashboard from "./dashboard";

export default class PopupView extends React.Component {
  constructor(props) {
    super(props);
    this.state = { viewMode: ViewModeSwitch.defaultViewMode };
    this.handleViewModeChange = this.handleViewModeChange.bind(this);
  }

  handleViewModeChange(viewMode) {
    this.setState({ viewMode });
  }

  renderContent() {
    const { subscriber, unreadItemIds } = this.props;
    switch (this.state.viewMode) {
      case "dashboard": return (
        <Dashboard {...this.props} />
      );
      case "events": return (
        <ItemsSubscriptionFlatItems
          subscriptions={subscriber.itemsSubscriptions}
          unreadItemIds={unreadItemIds}
        />
      );
      case "categories": return (
        <ItemsSubscriptionCategories
          subscriptions={subscriber.itemsSubscriptions}
          unreadItemIds={unreadItemIds}
        />
      );
      default: return null;
    }
  }

  render() {
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
        {this.renderContent()}
      </div>
    );
  }
}

PopupView.propTypes = {
  subscriber: PropTypes.instanceOf(Subscriber).isRequired,
  unreadItemIds: PropTypes.object.isRequired,
};
