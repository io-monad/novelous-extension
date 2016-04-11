import _ from "lodash";
import React, { PropTypes } from "react";
import SchemaField from "react-jsonschema-form/lib/components/fields/SchemaField";
import { translate } from "../../util/chrome-util";

const CustomSchemaField = (props) => {
  let isNewProps = false;
  const newPropsKeys = {};
  const getProps = (key) => {
    if (!isNewProps) {
      props = _.clone(props);
      isNewProps = true;
    }
    if (key && !newPropsKeys[key]) {
      props[key] = _.clone(props[key] || {});
      newPropsKeys[key] = true;
    }
    return key ? props[key] : props;
  };

  if (props.schema && props.name && !props.schema.title) {
    getProps("schema").title = translate(props.name);
  }
  if (props.schema && props.schema.enumNames) {
    getProps("schema").enumNames = _.map(props.schema.enumNames, name => translate(name));
  }
  if (props.name && (!props.uiSchema || !props.uiSchema.className)) {
    getProps("uiSchema").classNames = `options-form__${_.kebabCase(props.name)}`;
  }
  if (props.uiSchema && props.uiSchema["ui:help"]) {
    getProps("uiSchema")["ui:help"] = translate(props.uiSchema["ui:help"]);
  }

  return (
    <SchemaField {...props} />
  );
};

CustomSchemaField.propTypes = {
  schema: PropTypes.object.isRequired,
  uiSchema: PropTypes.object,
  name: PropTypes.string,
};

export default CustomSchemaField;
