import _ from "lodash";
import { createRenderer, isElement } from "react-addons-test-utils";

export default function render(element) {
  const renderer = createRenderer();
  renderer.render(element);
  return RenderedElement.wrapIfElement(renderer.getRenderOutput(), renderer);
}

class RenderedElement {
  static wrapIfElement(value, renderer) {
    if (isElement(value) && !(value instanceof RenderedElement)) {
      return new RenderedElement(value, renderer);
    } else {
      return value;
    }
  }

  constructor(element, renderer) {
    this.element = element;
    this._renderer = renderer;
  }

  get element() {
    return this._element;
  }

  set element(el) {
    if (this._element) {
      this._keys(this._element).forEach(k => { delete this[k]; });
    }
    this._element = el;
    this._caches = {};
    this._keys(this._element).forEach(k => { this[k] = this._element[k]; });
  }

  get tagName() {
    return _.isFunction(this.type) ? this.type.name : this.type;
  }

  get classNames() {
    if (!this._caches.classNames) {
      if (this.props && this.props.className) {
        this._caches.classNames = this.props.className.split(/\s+/);
      } else {
        this._caches.classNames = [];
      }
    }
    return this._caches.classNames;
  }

  get children() {
    if (!this._caches.children) {
      if (this.props && _.isArray(this.props.children)) {
        this._caches.children = this.props.children.map(el => {
          return RenderedElement.wrapIfElement(el);
        });
      } else {
        this._caches.children = RenderedElement.wrapIfElement(this.props.children);
      }
    }
    return this._caches.children;
  }

  get text() {
    if (!this._caches.text) {
      this._caches.text = _.castArray(this.children).map(child => {
        return child && _.isString(child.text) ? child.text : _.toString(child);
      }).join("");
    }
    return this._caches.text;
  }

  hasClassName(className) {
    return this.classNames.indexOf(className) >= 0;
  }

  render() {
    if (!this._renderer) {
      throw new Error("This is not re-renderable element");
    }
    this.element = this._renderer.getRenderOutput();
    return this;
  }

  findAll(test) {
    const found = [];
    this._walkElement(this, el => {
      if (el !== this && test(el)) found.push(el);
    });
    return found;
  }

  find(test) {
    const found = this.findAll(test);
    if (found.length > 1) throw new Error("Too many matched elements");
    return found[0];
  }

  findAllByClassName(classNames) {
    if (!_.isArray(classNames)) {
      classNames = classNames.split(/\s+/);
    }
    return this.findAll(el => {
      return _.intersection(classNames, el.classNames).length > 0;
    });
  }

  findByClassName(classNames) {
    const found = this.findAllByClassName(classNames);
    if (found.length > 1) throw new Error("Too many matched elements");
    return found[0];
  }

  findAllByTagName(tagName) {
    return this.findAll(el => {
      return el.tagName === tagName;
    });
  }

  findByTagName(tagName) {
    const found = this.findAllByTagName(tagName);
    if (found.length > 1) throw new Error("Too many matched elements");
    return found[0];
  }

  _keys(obj) {
    return _.reject(Object.keys(obj), k => /^_/.test(k));
  }

  _walkElement(element, fn) {
    if (isElement(element)) {
      fn(element);
      if (_.isArray(element.children)) {
        element.children.forEach(el => this._walkElement(el, fn));
      } else if (element.children) {
        this._walkElement(element.children, fn);
      }
    }
  }
}
