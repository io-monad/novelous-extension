import React from "react";
import ReactDOM from "react-dom";
import PopupView from "../views/popup/popup-view";
import AppData from "../app/app-data";
import Subscriber from "../subscriptions/subscriber";
import BackgroundAPI from "./background-api";
const logger = debug("popup");

export default class PopupController {
  constructor(container) {
    this.container = container;
    this.appData = null;
    this.subscriber = null;
  }

  start() {
    return AppData.load().then(appData => {
      BackgroundAPI.markBadgeAsSeen();

      this.appData = appData;
      this.subscriber = new Subscriber(this.appData.subscriptionSettings);
      logger("Initialized", this);

      this.renderView();
      return this;
    }).catch((e) => {
      console.error("Error while initialization in PopupController", e);
      throw e;
    });
  }

  renderView() {
    ReactDOM.render(
      <PopupView
        controller={this}
        subscriptions={this.subscriber.subscriptions}
      />,
      this.container
    );
  }
}
