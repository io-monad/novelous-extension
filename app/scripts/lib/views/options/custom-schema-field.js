import _ from "lodash";
import React, { PropTypes } from "react";
import SchemaField from "react-jsonschema-form/lib/components/fields/SchemaField";
import { translate, translateMessage } from "@io-monad/chrome-util";

export default class CustomSchemaField extends React.Component {
  static propTypes = {
    schema: PropTypes.object.isRequired,
    uiSchema: PropTypes.object,
    name: PropTypes.string,
  };

  render() {
    let props = this.props;
    const setProp = (key, val) => {
      if (props === this.props) props = _.clone(this.props);
      _.setWith(props, key, val, v => _.clone(v));
    };

    if (props.schema) {
      if (props.schema.title) {
        setProp("schema.title", translateMessage(props.schema.title));
      } else if (props.name) {
        setProp("schema.title", translate(props.name));
      }
      if (props.schema.enumNames) {
        setProp("schema.enumNames", _.map(props.schema.enumNames, name => {
          return translateMessage(name);
        }));
      }
    }
    if (props.name && (!props.uiSchema || !props.uiSchema.className)) {
      setProp("uiSchema.classNames", `options-form__${_.kebabCase(props.name)}`);
    }
    if (props.uiSchema && props.uiSchema["ui:help"]) {
      setProp("uiSchema[ui:help]", translateMessage(props.uiSchema["ui:help"]));
    }

    return (
      <SchemaField {...props} />
    );
  }
}
