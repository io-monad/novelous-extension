import React, { PropTypes } from "react";
import Form from "react-jsonschema-form";
import Str from "../common/str";
import CustomSchemaField from "./custom-schema-field";

const FormFields = {
  SchemaField: CustomSchemaField,
};

export default class OptionsView extends React.Component {
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
        <div className="options-form">
          <Form
            {...this.props}
            fields={FormFields}
            onSubmit={this.handleFormSubmit}
          >
            <div className="options-form__actions">
              <button
                type="submit"
                className="options-form__save-button btn btn-primary"
              >
                <Str name="saveOptions" />
              </button>
            </div>
          </Form>
        </div>
      </div>
    );
  }
}

OptionsView.propTypes = {
  controller: PropTypes.object.isRequired,
  schema: PropTypes.object.isRequired,
  uiSchema: PropTypes.object,
  formData: PropTypes.object.isRequired,
};
