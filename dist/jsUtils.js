/*
 * jsUtils JavaScript Library v0.3.0
 * https://github.com/lightsuner/jsUtils
 *
 * Date: 2014-02-19T09:59Z
 */

!(function(window) {
    



    
    var document = window.document,

        jsUtils = function() {

            var version = "0.3.0";

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


    /**
     * Emulate browser's post request with redirect to passed uri
     *
     * @param uri
     * @param data hash
     */
    jsUtils.fn.postForm = function(uri, data) {
        uri || (uri = "");
        data || (data = {});
        var method = "post",
            form = document.createElement("form");

        form.setAttribute("method", method);
        form.setAttribute("action", uri);
        form.style.display = "none";

        generateHiddenElements(form, "", data);

        document.body.appendChild(form);
        form.submit();

    };

    function generateHiddenElements(form, parentName, value) {
        var nextName,
            hiddenField,
            key;

        // if value is not scalar - run function recursively
        if (value instanceof Object) {
            for (key in value) {
                if (value.hasOwnProperty(key)) {
                    nextName = key;
                    if (parentName) {
                        nextName = parentName + "[" + nextName + "]";
                    }
                    generateHiddenElements(form, nextName, value[key]);
                }
            }
            return;
        }

        // else create hidden element
        hiddenField = document.createElement("input");
        hiddenField.setAttribute("type", "hidden");
        hiddenField.setAttribute("name", parentName);
        hiddenField.setAttribute("value", value);

        form.appendChild(hiddenField);
    }


    /**
     * Parse query and return object or scalar value
     *
     * @param name
     * @param source
     * @returns {} | scalar
     */
    jsUtils.fn.queryTo = function(name, source) {
        var queryParamsString,
            result;

        source || (source = "");
        queryParamsString = (source.length) ? source : window.location.search;
        if (queryParamsString.indexOf("?") !== -1) {
            queryParamsString = queryParamsString.split("?")[1];
        }
        queryParamsString = decodeURIComponent(queryParamsString);

        // cache results
        if (undefined === this._queryDataCache) {
            this._queryDataCache = {};
        }

        if (undefined === this._queryDataCache[queryParamsString]) {
            this._queryDataCache[queryParamsString] = getAllParams(queryParamsString);
        }

        result = this._queryDataCache[queryParamsString];

        if (name) {
            result = result[name];
        }

        return clone(result);
    };

    /**
     * Shortcut for queryTo method
     *
     * @param source
     * @returns {*}
     */
    jsUtils.fn.queryToHash = function(source) {
        return this.queryTo(null, source);
    };

    /**
     * Get values from query string
     *
     * @param queryString
     * @returns {{}}
     */
    function getAllParams(queryString) {
        var queryParams = queryString.split("&"),
            result = {},
            queryParamsLength = queryParams.length,
            i,
            param;

        if (queryParamsLength === 1 && !queryParams[0]) {
            return result;
        }

        for (i = 0; i < queryParamsLength; i++) {
            param = queryParams[i].split("=");
            if (param.length < 2) {
                continue;
            }
            setValueToResult(result, param[0], param[1]);
        }

        return result;
    }

    /**
     * Set value with tree traveling
     *
     * @param result object
     * @param property string
     * @param value string
     */
    function setValueToResult(result, property, value) {
        var resultLevel = result,
            tree = property.split(/\[/),
            treelength = tree.length,
            i,
            currentPropertyName;

        for (i = 0; i < treelength; i++) {
            currentPropertyName = stripLastSquareBracket(tree[i]);

            if (i === (treelength - 1)) {
                if (!currentPropertyName.length) {
                    resultLevel.push(value);
                } else {
                    resultLevel[currentPropertyName] = value;
                }
            } else {
                //skip wrong item
                if (!currentPropertyName.length) {
                    continue;
                }
                // define next tree level
                if (undefined === resultLevel[currentPropertyName]) {
                    if (tree[i + 1].length === 1) {
                        resultLevel[currentPropertyName] = [];
                    } else {
                        resultLevel[currentPropertyName] = {};
                    }
                }
                resultLevel = resultLevel[currentPropertyName];
            }
        }
    }

    /**
     * Remove last "]" - character from string
     * @param string
     * @returns {*}
     */
    function stripLastSquareBracket(string) {
        return string.replace(/\]$/, "");
    }

    /**
     * Clone variable
     *
     * @param mixed o
     * @returns {*}
     */
    function clone(o) {
        if (!o || "object" !== typeof o) {
            return o;
        }
        var c,
            p,
            v;

        c = "function" === typeof o.pop ? [] : {};

        for (p in o) {
            if (o.hasOwnProperty(p)) {
                v = o[p];
                if (v && "object" === typeof v) {
                    c[p] = clone(v);
                } else {
                    c[p] = v;
                }
            }
        }
        return c;
    }


    /**
     * Create new instance of jsUtils
     */

    var jsUtilsInstance = new jsUtils();


    /**
     * Add supporting AMD (require.js)
     */

    if (typeof define === "function" && define.amd) {
        define("jsUtils", [], function() {
            return jsUtilsInstance;
        });
    }




    /**
     * Provide noConflict functionality
     */

    var previousUtils = window.jsUtils;

    jsUtils.noConflict = function noConflict() {
        window.jsUtils = previousUtils;

        return jsUtilsInstance;
    };




    /**
     * Add instance to global object (window)
     */

    window.jsUtils = jsUtilsInstance;


})
(window);
