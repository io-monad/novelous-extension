import _ from "lodash";  // eslint-disable-line
import React from "react";
import ReactDOM from "react-dom";
import OptionsView from "../views/options/options-view";
import ErrorMessage from "../views/messages/error-message";
import SavingMessage from "../views/messages/saving-message";
import AppData from "../app/app-data";
const logger = debug("options");

export default class OptionsController {
  constructor(container) {
    this.container = container;
    this.appData = null;
    this.lastError = null;
    this.isSaving = false;
  }

  start() {
    return AppData.load({ autoUpdate: false }).then(appData => {
      this.appData = appData;
      logger("Initialized", this);

      this.renderView();
      logger("View rendered");

      return this;
    }).catch((e) => {
      console.error("Error while initialization in OptionsController", e);
      this.lastError = e;
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
    if (this.isSaving) {
      return <SavingMessage />;
    }
    return (
      <OptionsView
        controller={this}
        schema={this.appData.optionsSchema}
        uiSchema={this.appData.optionsSchema.uiSchema}
        formData={this.appData.getOptions()}
      />
    );
  }

  saveOptions(newOptions) {
    this.isSaving = true;
    this.renderView();

    this.appData.setOptions(newOptions);
    return this.appData.save().then(() => {
      window.close();
    });
  }
}
