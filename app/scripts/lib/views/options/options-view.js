import React, { PropTypes } from "react";
import OptionsForm from "./options-form";

export default class OptionsView extends React.Component {
  static propTypes = {
    controller: PropTypes.object.isRequired,
    schema: PropTypes.object.isRequired,
    uiSchema: PropTypes.object,
    formData: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }
  handleFormSubmit({ formData }) {
    this.props.controller.saveOptions(formData);
  }
  render() {
    return (
      <div className="options-view">
        <OptionsForm {...this.props} onSubmit={this.handleFormSubmit} />
      </div>
    );
  }
}
