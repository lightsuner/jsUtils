define([
  "./core"
], function(jsUtils) {
  "use strict";


  /**
   * Protect window.console method calls, e.g. console is not defined on IE
   * unless dev tools are open, and IE doesn't define console.debug
   *
   * Source: http://stackoverflow.com/questions/3326650/console-is-undefined-error-for-internet-explorer
   */
  jsUtils.prototype.consoleFix = function () {
    if (!window.console) {
      window.console = {};
    }
    // union of Chrome, FF, IE, and Safari console methods
    var methods = [
      "log", "info", "warn", "error", "debug", "trace", "dir", "group",
      "groupCollapsed", "groupEnd", "time", "timeEnd", "profile", "profileEnd",
      "dirxml", "assert", "count", "markTimeline", "timeStamp", "clear"
    ];
    // define undefined methods as noops to prevent errors
    for (var i = 0; i < methods.length; i++) {
      if (!window.console[methods[i]]) {
        window.console[methods[i]] = function () {};
      }
    }
  };

  return jsUtils;
});