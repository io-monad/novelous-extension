import _ from "lodash";
import { isElement } from "react-addons-test-utils";

const filterReactElement = (element) => {
  if (!isElement(element)) return element;
  const filtered = {};
  filtered.type = element.type;

  let props = _.omitBy(element.props, _.isFunction);
  props = _.omit(props, "children");
  props = _.omitBy(props, _.isUndefined);
  filtered.props = props;

  if (_.isArrayLikeObject(element.props.children)) {
    filtered.props.children = _.compact(_.map(element.props.children, filterReactElement));
  } else {
    filtered.props.children = filterReactElement(element.props.children);
  }
  return filtered;
};

export default function extendAssert(assert) {
  assert.reactEqual = (actual, expected) => {
    assert(isElement(actual), "Actual is not a React element");
    assert(isElement(expected), "Expected is not a React element");
    assert.deepStrictEqual(
      filterReactElement(actual),
      filterReactElement(expected)
    );
  };
}
