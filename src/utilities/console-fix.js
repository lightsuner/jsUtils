define([
    "../core"
], function(jsUtils) {

    /**
     * Protect window.console method calls, e.g. console is not defined on IE
     * unless dev tools are open, and IE doesn't define console.debug
     *
     * Source: http://stackoverflow.com/questions/3326650/console-is-undefined-error-for-internet-explorer
     */
    jsUtils.fn.consoleFix = function() {
        // union of Chrome, FF, IE, and Safari console methods
        var methods = [
                "log", "info", "warn", "error", "debug", "trace", "dir", "group",
                "groupCollapsed", "groupEnd", "time", "timeEnd", "profile", "profileEnd",
                "dirxml", "assert", "count", "markTimeline", "timeStamp", "clear"
            ],
            i;

        if (!window.console) {
            window.console = {};
        }

        // define undefined methods as noops to prevent errors
        for (i = 0; i < methods.length; i++) {
            if (!window.console[methods[i]]) {
                window.console[methods[i]] = createFunction();
            }
        }
    };

    function createFunction() {
        return function() {
        };
    }

    return jsUtils;
});
