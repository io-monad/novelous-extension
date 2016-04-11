import React, { PropTypes } from "react";
import Form from "react-jsonschema-form";
import Str from "../common/str";
import CustomSchemaField from "./custom-schema-field";

const FormFields = {
  SchemaField: CustomSchemaField,
};

const OptionsView = (props) => (
  <div className="options-form">
    <Form {...props} fields={FormFields}>
      <div className="options-form__actions">
        <button type="submit" className="options-form__save-button btn btn-primary">
          <Str name="saveOptions" />
        </button>
      </div>
    </Form>
  </div>
);

OptionsView.propTypes = {
  schema: PropTypes.object.isRequired,
  uiSchema: PropTypes.object,
  formData: PropTypes.object.isRequired,
  onSubmit: PropTypes.func,
};

export default OptionsView;
