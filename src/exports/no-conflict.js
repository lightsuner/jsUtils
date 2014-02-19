define([
    "../core",
    "./instance"
], function(jsUtils, jsUtilsInstance) {

    /**
     * Provide noConflict functionality
     */

    var previousUtils = window.jsUtils;

    jsUtils.noConflict = function noConflict() {
        window.jsUtils = previousUtils;

        return jsUtilsInstance;
    };

});
