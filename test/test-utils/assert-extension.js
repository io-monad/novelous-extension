import _ from "lodash";

export default function extendAssert(assert) {
  const isReactElement = (value) => {
    return value && value.$$typeof === Symbol.for("react.element");
  };

  const filterReactElement = (element) => {
    if (!isReactElement(element)) return element;
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

  assert.reactEqual = function reactEqual(actual, expected) {
    assert(isReactElement(actual), "Actual is not a React element");
    assert(isReactElement(expected), "Expected is not a React element");
    assert.deepStrictEqual(
      filterReactElement(actual),
      filterReactElement(expected)
    );
  };

  return assert;
}
