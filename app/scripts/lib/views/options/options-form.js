import React, { PropTypes } from "react";
import Form from "react-jsonschema-form";
import AppVars from "../../app/app-vars";
import { Str, Link, Icon, BrandLink } from "../common";
import CustomSchemaField from "./custom-schema-field";

const FormFields = {
  SchemaField: CustomSchemaField,
};

export default class OptionsForm extends React.Component {
  static propTypes = {
    schema: PropTypes.object.isRequired,
    uiSchema: PropTypes.object,
    formData: PropTypes.object.isRequired,
    onSubmit: PropTypes.func,
  };

  render() {
    return (
      <div className="options-form">
        <Form {...this.props} fields={FormFields}>
          <div className="options-form__footer">
            <div className="options-form__icons">
              <BrandLink className="options-form__icon" showVersion />
              <Link
                href={AppVars.twitterUrl}
                title="Follow me at Twitter!"
                className="options-form__icon"
              >
                <Icon name="twitter" />
              </Link>
              <Link
                href={AppVars.githubUrl}
                title="Open source at GitHub!"
                className="options-form__icon"
              >
                <Icon name="github" />
              </Link>
            </div>
            <div className="options-form__actions">
              <button type="submit" className="options-form__save-button btn btn-primary">
                <Str name="saveOptions" />
              </button>
            </div>
          </div>
        </Form>
      </div>
    );
  }
}
