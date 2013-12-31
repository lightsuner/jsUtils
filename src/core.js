define(function() {
  "use strict";

  var
  // Use the correct document accordingly with window argument (sandbox)
    document = window.document,
    version = "@VERSION",
    previousJsUtils = document.jsUtils;

  var jsUtils = function () {};

  jsUtils.noConflict = function noConflict() {
    document.jsUtils = previousJsUtils;
    return jsUtils;
  };

  return jsUtils;
});