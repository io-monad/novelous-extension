import test from "ava";
import jquery from "jquery";
import jqueryMockjax from "jquery-mockjax";

let promise;

export default function () {
  if (promise) return promise;
  promise = new Promise((resolve, reject) => {
    require("jsdom").env("", (errors, window) => {
      if (errors && errors.length > 0) {
        reject(errors[0]);
      } else {
        global.window = window;
        global.jQuery = global.$ = jquery(window);
        global.mockjax = jqueryMockjax(global.jQuery, window);
        global.jQuery.mockjaxSettings.logging = false;
        resolve();
      }
    });
  });
  return promise;
}

test.afterEach(() => {
  if (global.mockjax) {
    global.mockjax.clear();
  }
});
