import React from "react";
import ReactDOM from "react-dom";
import PopupView from "../views/popup/popup-view";
import ErrorMessage from "../views/messages/error-message";
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
  }

  start() {
    return AppData.load({ autoUpdate: false }).then(appData => {
      BackgroundAPI.markBadgeAsSeen();

      this.appData = appData;
      this.subscriber = new Subscriber(this.appData.subscriptionSettings);
      logger("Initialized", this);

      this.renderView();
      logger("View rendered");

      if (!this.appData.lastUpdatedAt) {
        return this.triggerUpdate().then(() => { return this; });
      }
      return this;
    }).catch((e) => {
      console.error("Error while initialization in PopupController", e);
      this.lastError = e;
      this.renderView();
      throw e;
    });
  }

  triggerUpdate() {
    logger("Triggering updateSubscriptions");
    return BackgroundAPI.updateSubscriptions().then(subscriber => {
      logger("Updated subscriptions");
      this.subscriber = subscriber;
      return BackgroundAPI.getAppData().then(appData => {
        this.appData.overwrite(_.cloneDeep(appData.data));
        this.renderView();
      });
    });
  }

  renderView() {
    ReactDOM.render(this.getViewComponent(), this.container);
  }

  getViewComponent() {
    if (this.lastError) {
      return <ErrorMessage reason={this.lastError.message || this.lastError} />;
    }
    if (!this.appData.lastUpdatedAt) {
      return <UpdatingMessage />;
    }
    return (
      <PopupView
        controller={this}
        subscriptions={this.subscriber.subscriptions}
      />
    );
  }
}
