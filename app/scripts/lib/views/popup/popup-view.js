import React, { PropTypes } from "react";
import SubscriptionList from "../subscriptions/subscription-list";
import Subscriber from "../../subscriptions/subscriber";
import { translate, getStorePageUrl, openOptionsPage } from "../../util/chrome-util";
import Icon from "../common/icon";
import AppInfo from "../../../../../package.json";
import ViewModeSwitch from "./view-mode-switch";

export default class PopupView extends React.Component {
  constructor(props) {
    super(props);
    this.state = { viewMode: SubscriptionList.defaultViewMode };
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
            <a href={getStorePageUrl()} target="_blank"
              title={`${translate("appName")} ver ${AppInfo.version}`}
            >
              <img src="/images/icon-38.png" />
            </a>
          </div>
          <div className="popup-view__buttons btn-toolbar">
            <button
              title={translate("openOptions")}
              className="popup-view__options-button btn btn-sm btn-link"
              onClick={openOptionsPage}
            >
              <Icon name="cog" />
              {` ${translate("options")}`}
            </button>
            <ViewModeSwitch
              allViewModes={SubscriptionList.viewModes}
              viewMode={viewMode}
              onChange={this.handleViewModeChange}
            />
          </div>
        </div>
        <SubscriptionList
          viewMode={viewMode}
          subscriptions={subscriber.itemsSubscriptions}
          unreadItemIds={unreadItemIds}
        />
      </div>
    );
  }
}

PopupView.propTypes = {
  subscriber: PropTypes.instanceOf(Subscriber).isRequired,
  unreadItemIds: PropTypes.object.isRequired,
};
