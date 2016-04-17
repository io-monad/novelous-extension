/**
 * Adapter for factory-girl
 *
 * This uses given properties for the first argument of constructor call.
 */
export default class FactoryAdapter {
  build(Model, props) {
    if (Model === Object) {
      return props;
    }
    return new Model(props);
  }
  save(doc, Model, cb) {
    process.nextTick(() => {
      cb(null, doc);
    });
  }
  destroy(doc, Model, cb) {
    process.nextTick(() => {
      cb();
    });
  }
}
