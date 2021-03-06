import _ from "lodash";
import React from "react";
import ReactDOM from "react-dom";
import PopupView from "../views/popup/popup-view";
import ErrorMessage from "../views/messages/error-message";
import LoginRequiredMessage from "../views/messages/login-required-message";
import EmptyFeedsMessage from "../views/messages/empty-feeds-message";
import UpdatingMessage from "../views/messages/updating-message";
import AppData from "../app/app-data";
import Subscriber from "../subscriptions/subscriber";
import BackgroundAPI from "./background-api";
const logger = debug("popup");

export default class PopupController {
  constructor(container) {
    this.container = container;
    this.appData = null;
    this.subscriber = null;
    this.lastError = null;
    this.isUpdating = false;
    this.unreadItemIds = {};
  }

  start() {
    return AppData.load().then(appData => {
      this.appData = appData;
      this.subscriber = new Subscriber(this.appData.subscriptionSettings);
      this._saveUnreadItemIds();
      this.appData.on("update", this._handleAppDataUpdate.bind(this));
      logger("Initialized", this);

      this.renderView();
      logger("View rendered");

      if (!this.isAnyFeedAvailable()) {
        return this.triggerUpdate().then(() => { return this; });
      }
      BackgroundAPI.markBadgeAsSeen();
      return this;
    }).catch((e) => {
      console.error("Error while initialization in PopupController", e);
      this.lastError = e;
      this.renderView();
      throw e;
    });
  }

  isAnyFeedAvailable() {
    return _.some(this.subscriber.subscriptions, sub => sub.feed);
  }
  isAnyFeedItemAvailable() {
    return _.some(this.subscriber.subscriptions, sub => sub.items.length > 0);
  }

  triggerUpdate() {
    logger("Triggering updateSubscriptions");
    this.isUpdating = true;
    this.renderView();
    return BackgroundAPI.updateSubscriptions().then(() => {
      logger("Updated subscriptions");
      this.isUpdating = false;
      this.renderView();
    }).catch(e => {
      this.isUpdating = false;
      this.renderView();
      throw e;
    });
  }

  renderView() {
    ReactDOM.render(this.getViewComponent(), this.container);
  }

  getViewComponent() {
    if (this.lastError) {
      return <ErrorMessage reason={this.lastError.message || this.lastError} />;
    }
    if (this.isUpdating) {
      return <UpdatingMessage />;
    }
    if (!this.isAnyFeedAvailable()) {
      return <LoginRequiredMessage />;
    }
    if (!this.isAnyFeedItemAvailable()) {
      return <EmptyFeedsMessage />;
    }
    return (
      <PopupView
        controller={this}
        subscriber={this.subscriber}
        unreadItemIds={this.unreadItemIds}
      />
    );
  }

  _saveUnreadItemIds() {
    _.each(this.subscriber.itemsSubscriptions, sub => {
      _.each(sub.unreadItems, item => {
        _.set(this.unreadItemIds, [sub.id, item.id], true);
      });
    });
  }

  _handleAppDataUpdate(appData, keys) {
    if (keys.indexOf("subscriptionSettings") >= 0) {
      logger("Updating Subscriber with updated settings", appData.subscriptionSettings);
      this.subscriber.subscriptionSettings = appData.subscriptionSettings;
      this._saveUnreadItemIds();
      this.renderView();
    }
  }
}
