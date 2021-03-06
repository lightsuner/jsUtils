define([
    "./../core"
], function(jsUtils) {

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
        queryParamsString = decodeURIComponent(queryParamsString.replace(/\+/g, "%20"));

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

    return jsUtils;

});
