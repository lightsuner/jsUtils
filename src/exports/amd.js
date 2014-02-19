define([
    "./instance"
], function(jsUtilsInstance) {

    /**
     * Add supporting AMD (require.js)
     */

    if (typeof define === "function" && define.amd) {
        define("jsUtils", [], function() {
            return jsUtilsInstance;
        });
    }

});
