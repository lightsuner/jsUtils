define(function() {

    /* jshint unused:false */
    var document = window.document,

        jsUtils = function() {

            var version = "@VERSION";

            /**
             * get version of library
             *
             * @returns {string}
             */
            this.getVersion = function() {
                return version;
            };
        };

    jsUtils.fn = jsUtils.prototype = {
        constructor: jsUtils
    };

    return jsUtils;
});
