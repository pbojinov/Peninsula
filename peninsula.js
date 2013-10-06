/**
 * Author: petar
 * Date: 9/11/13
 */

window.Peninsula = (function (window, undefined) {

    var version = '0.0.1',
        seed = '1234567890QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm',
        location = window.location,
        document = window.document,
        currentAbsolutePath = location.toString(),
        baseUrl = currentAbsolutePath.substring(0, currentAbsolutePath.lastIndexOf('/')) + '/',
        injectedScripts = [],
        injectedStyles = [];

    var Peninsula = {};

    /**
     * Polyfill some functionality in aka fix some IE bugs
     *
     * x in y checks to the item without triggering a call to it
     */

    // ES5 15.4.4.14 Array.prototype.indexOf ( searchElement [ , fromIndex ] )
    // From https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/indexOf
    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function (searchElement /*, fromIndex */) {
            "use strict";

            if (this === void 0 || this === null) { throw new TypeError(); }

            var t = Object(this);
            var len = t.length >>> 0;
            if (len === 0) { return -1; }

            var n = 0;
            if (arguments.length > 0) {
                n = Number(arguments[1]);
                if (isNaN(n)) {
                    n = 0;
                } else if (n !== 0 && n !== (1 / 0) && n !== -(1 / 0)) {
                    n = (n > 0 || -1) * Math.floor(Math.abs(n));
                }
            }

            if (n >= len) { return -1; }

            var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);

            for (; k < len; k++) {
                if (k in t && t[k] === searchElement) {
                    return k;
                }
            }
            return -1;
        };
    }

    // ES5 15.4.4.18 Array.prototype.forEach ( callbackfn [ , thisArg ] )
    // From https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/forEach
    if (!Array.prototype.forEach) {
        Array.prototype.forEach = function (fun /*, thisp */) {
            "use strict";

            if (this === void 0 || this === null) { throw new TypeError(); }

            var t = Object(this);
            var len = t.length >>> 0;
            if (typeof fun !== "function") { throw new TypeError(); }

            var thisp = arguments[1], i;
            for (i = 0; i < len; i++) {
                if (i in t) {
                    fun.call(thisp, t[i], i, t);
                }
            }
        };
    }

    // ES5 15.4.4.19 Array.prototype.map ( callbackfn [ , thisArg ] )
    // From https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/Map
    if (!Array.prototype.map) {
        Array.prototype.map = function (fun /*, thisp */) {
            "use strict";

            if (this === void 0 || this === null) { throw new TypeError(); }

            var t = Object(this);
            var len = t.length >>> 0;
            if (typeof fun !== "function") { throw new TypeError(); }

            var res = []; res.length = len;
            var thisp = arguments[1], i;
            for (i = 0; i < len; i++) {
                if (i in t) {
                    res[i] = fun.call(thisp, t[i], i, t);
                }
            }

            return res;
        };
    }

    // ES5 15.4.4.21 Array.prototype.reduce ( callbackfn [ , initialValue ] )
    // From https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/Reduce
    if (!Array.prototype.reduce) {
        Array.prototype.reduce = function (fun /*, initialValue */) {
            "use strict";

            if (this === void 0 || this === null) { throw new TypeError(); }

            var t = Object(this);
            var len = t.length >>> 0;
            if (typeof fun !== "function") { throw new TypeError(); }

            // no value to return if no initial value and an empty array
            if (len === 0 && arguments.length === 1) { throw new TypeError(); }

            var k = 0;
            var accumulator;
            if (arguments.length >= 2) {
                accumulator = arguments[1];
            } else {
                do {
                    if (k in t) {
                        accumulator = t[k++];
                        break;
                    }

                    // if array contains no values, no initial value to return
                    if (++k >= len) { throw new TypeError(); }
                }
                while (true);
            }

            while (k < len) {
                if (k in t) {
                    accumulator = fun.call(undefined, accumulator, t[k], k, t);
                }
                k++;
            }

            return accumulator;
        };
    }

    /**
     * For browsers like IE8 and below so we do not reek havok
     */
    if (!('console' in window)) {
        function nothing() {}
        window.console = {
            debug: nothing,
            dir: nothing,
            error: nothing,
            group: nothing,
            groupCollapsed: nothing,
            groupEnd: nothing,
            info: nothing,
            log: nothing,
            time: nothing,
            timeEnd: nothing,
            trace: nothing,
            warn: nothing
        };
    }

    /**
     * Main API Function
     */

    /**
     * Add css to a new style tag and append it to the head of the page
     *
     * @method injectCSS
     * @param styles {string} the css content as string
     * @param elementId {string} id of the new style tag
     */
    var injectCSS = function(styles, elementId) {
        var style = document.createElement('style');
        style.setAttribute('type', 'text/css');
        style.setAttribute('id', elementId ? elementId : uuid());

        //IE style.innerHTML bug - http://stackoverflow.com/a/5618889/907388
        if (style.styleSheet) {
            style.styleSheet.cssText = styles.css;
        }
        else {
            style.innerHTML = styles.css;
        }
        document.getElementsByTagName('head')[0].appendChild(style);
    };

    var injectHTML = function() {

    };

    /**
     * Add an event listener on an element or array of elements
     *
     * @method addEventListener
     * @param element {DOMNode}
     * @param eventName {String}
     * @param eventHandler {Function}
     */
    var addEventListener = function (element, eventName, eventHandler) {
        if (typeOf(eventName) === 'array') {
            for (var i = 0, l = eventName.length; i < l; ++i) {
                addEventListener(element, eventName[i], eventHandler);
            }
        }
        if ('addEventListener' in element) {
            element.addEventListener(eventName, handler, false);
        } else if ('attachEvent' in element) {
            element.attachEvent('on' + eventName, handler);
        }
    };

    /**
     * https://gist.github.com/pbojinov/4956018
     *
     * @method contains
     * @param {string} string
     * @param {string} substring
     * @returns {boolean}
     */

    var contains = function (string, substring) {
        return string.indexOf(substring) !== -1;
    };

    /**
     * Tests if the value is an integer
     *
     * @method isInteger
     * @param value {} the value to test
     * @return {boolean} whether it is an integer
     */
    var isInteger = function (value) {
        return (parseFloat(value) == parseInt(value)) && !isNaN(value);
    };

    /**
     * Tests whether a variable contains a false value,
     * or an empty object or array.
     * @param object
     *  The object to test.
     */
    var isEmpty = function (object) {
        if (!object) {
            return true;
        }
        var i, v, t;
        t = typeOf(object);
        if (t === 'object') {
            for (i in object) {
                v = object[i];
                if (v !== undefined) {
                    return false;
                }
            }
            return true;
        }
        else if (t === 'array') {
            return (object.length === 0);
        }
        return false;
    };

    /**
     * Checks to see if current string is a URL
     *
     * @method isUrl
     * @param url
     * @returns {*}
     */
    var isUrl = function (url) {
        if (typeof url === 'string') {
            return url.match(new RegExp('^[A-Za-z]*:\/\/'));
        }
        else {
            return false;
        }
    };

    /**
     * TODO - Injection Manager for 0.2.0
     *
     * Manage list of all injects css, html, js (by id or uuid)
     * Last injected css, html, js
     * First injected css, html, js
     */

    /**
     *  Tested with:
     *  - IE 5.5, 7.0, 8.0, 9.0 (preview)
     *  - Firefox 3.6.3, 3.6.8
     *  - Safari 5.0
     *  - Chrome 5.0
     *  - Opera 10.10, 10.60
     *
     * @method loadScript
     * @param url
     * @param [id] optional script id
     * @param callback
     */
    var loadScript = function (url, id, callback) {
        var script = document.createElement('script'),
            loaded;
        script.setAttribute('src', url);
        if (callback) {
            script.onreadystatechange = script.onload = function () {
                if (!loaded) {
                    callback();
                }
                loaded = true;
            };
        }
        document.getElementsByTagName('head')[0].appendChild(script);
    };

    /**
     * Get all scripts on the page
     * @returns [Array] array of script tags
     */
    var getScripts = function() {
        return document.getElementsByTagName('script');
    };

    /**
     * Return all injected scripts loaded on the page by Peninsula
     * @returns [Array] array of script tags
     */
    var getInjectedScripts = function() {
        return injectedScripts;
    };

    /**
     * Return all styles on the page
     * @returns [Array] array of style tags
     */
    var getStyles = function() {
        return document.getElementsByTagName('style');
    };

    /**
     * Return all styles loaded on the page by Peninsula
     * @returns [Array] array of style tags
     */
    var getInjectedStyles = function() {
        return injectedStyles;
    }

    /**
     *
     * @method cformat
     * @param string
     * @param arguments
     * @returns {*}
     */
    var cformat = function (string, arguments) {
        var pattern = /\{\d+\}/g;
        var args = arguments;
        return string.replace(pattern, function (capture) {
            return args[capture.match(/\d+/)];
        });
    };

    /**
     * Returns the first index in a container with a value that's not undefined
     * @method first
     * @param {array|Object|String} container
     * @return {Number|String} the index in the container, or null
     * @throws Exception if container is not array, object or string
     */
    var first = function (container) {
        if (!container) {
            return null;
        }
        switch (typeof container) {
            case 'array':
                for (var i = 0; i < container.length; ++i) {
                    if (container[i] !== undefined) {
                        return i;
                    }
                }
                break;
            case 'object':
                for (var k in container) {
                    if (!container.hasOwnProperty(k)) {
                        return k;
                    }
                }
                break;
            case 'string':
                return 0;
            default:
                throw 'container has to be an array, object or string';
        }
        return null;
    };

    /**
     * Returns whether an object contains a property directly
     * @param object Object
     * @param key String
     * @return Boolean
     */
    var has = function (object, key) {
        return Object.prototype.hasOwnProperty.call(object, key);
    };

    /**
     * Shuffle a string or array
     *
     * @method shuffle
     * @param input {string|array} the string or array to shuffle
     * @returns {string|array|boolean} the shuffled string
     */
    var shuffle = function (input) {
        if (!input.length) {
            return false;
        }
        else {
            var i, j, k, x;
            if (typeof input === 'string') {
                var arr = input.split('');
                for (j, x, i = arr.length; i; j = parseInt(Math.random() * i), x = arr[--i], arr[i] = arr[j], arr[j] = x) {
                }
                arr = arr.join('');
                return arr;
            }
            else if (typeOf(input) === 'array') {
                i = input.length;
                while (--i) {
                    j = Math.floor(Math.random() * ( i + 1 ));
                    var tempi = input[i];
                    var tempj = input[j];
                    input[i] = tempj;
                    input[j] = tempi;
                }
                return input;
            }
            else {
                throw 'invalid parameter. can only shuffle and array or string'
            }
        }
    };

    /**
     * https://gist.github.com/pbojinov/6531779
     *
     * @method trim
     * @param string
     * @param maxLength
     * @returns {*}
     */
    var trim = function (string, maxLength) {
        var trimmedString = string,
            trim,
            lastSpace;

        //string is too long, lets trim it and append ...
        if (trimmedString.length > maxLength) {
            lastSpace = trimmedString.lastIndexOf(' ');

            //there is no space in the word
            if (lastSpace === -1) {
                trimmedString = trimmedString.slice(0, maxLength - 3);
                trimmedString += '...';
            }
            else if (lastSpace > -1) {
                trimmedString = trimmedString.slice(0, maxLength - 3);
                trim = trimmedString.lastIndexOf(' ');
                trimmedString = trimmedString.slice(0, trim);
                trimmedString += '...';
            }
        }
        return trimmedString;
    };

    /**
     * Return current time in milliseconds
     *
     * @method now
     * @returns {number}
     */
    var now = function () {
        return new Date().getTime();
    };

    /**
     * Convert milliseconds to Hour:Minute:Seconds || Minute:Seconds
     *
     * @method convertMS
     * @param {int} milliseconds
     * @return {Object} h = hour, m = minute, s = seconds
     */
    var convertMS = function (milliseconds) {
        var h, m, s;
        s = Math.floor(milliseconds / 1000);
        m = Math.floor(s / 60);
        s = s % 60;
        h = Math.floor(m / 60);
        m = m % 60;
        h = h % 24;
        return {h: h, m: m, s: s, total: (h > 0) ? (h + ':' + m + ':' + s) : (m + ':' + s)};
    };

    /**
     * Return a random token of characters
     * Uses seed of 0-9, upper/lower case letters, and the current time in milliseconds
     *
     * @method token
     * @param length {int} length of token, defaults to 10
     * @returns {string} a random string of maximum length 74
     */

    var token = function (length) {
        length = length || 10;
        var today = new Date().getTime();
        return (shuffle((seed + today), length));
    };

    /**
     * Returns the type of a value
     * @param value
     *
     * return type
     */
    var typeOf = function (value) {
        var s = typeof value;
        if (s === 'object') {
            if (value === null) {
                return 'null';
            }
            if (value instanceof Array || (value.constructor && value.constructor.name === 'Array') || Object.prototype.toString.apply(value) === '[object Array]') {
                s = 'array';
            }
            else if (typeof(value) != 'undefined') {
                return value;
            }
            else if (typeof(value.constructor) != 'undefined' && typeof(value.constructor.name) != 'undefined') {
                if (value.constructor.name == 'Object') {
                    return 'object';
                }
                return value.constructor.name;
            }
            else {
                return 'object';
            }
        }
        return s;
    };

    /**
     * https://gist.github.com/pbojinov/6430601
     *
     * Generates an rfc4122 version 4 compliant uuid
     *
     * @method uuid
     * @returns {*|string}
     */
    var uuid = function () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };

    /**
     * Extend Object to allow rename of pre-existing property
     *
     * @mehod renamePropery
     * @return {Object}
     */
    var renameProperty = function (obj, oldName, newName) {
        // Check for the old property name to avoid a ReferenceError in strict mode.
        if (obj.hasOwnProperty(oldName)) {
            obj[newName] = obj[oldName];
            delete obj[oldName];
        }
        return obj;
    };

    /**
     * jQuery like selector
     * Use getElementById if selector contains #
     * Use querySelectorALl for everything else
     *
     * IE7 and below does not support querySeletorAll
     *
     * @method select
     * @param query
     * @returns {*}
     */
    var select = function (query) {

        var id = /#/g,
            match = query.match(id);

        //user is asking for an element by id
        if (!!match) {
            return document.getElementById(query.replace(/#/g, ''));
        }
        else if (('querySelectorAll' in document)) {
            var el = document.querySelectorAll(query);
            return el.length > 1 ? el : el[0];
        }
        else {
            throw 'select error, querySelectorAll not implemented';
        }
    };

    /**
     * Merge two arrays
     *
     * @method merge
     * @param mergeTo {array} array to merge with
     * @param mergeFrom {array} array to merge into first part
     * @returns {*}
     */
    var merge = function (mergeTo, mergeFrom) {
        if ((typeOf(mergeTo) === 'array') && (typeOf(mergeFrom) === 'array')) {
            Array.prototype.push.apply(mergeTo, mergeFrom);
            return mergeTo;
        }
        else {
            throw 'merge invalid parameters, must pass in two arrays';
        }
    };

    /**
     * Preload images, used to cache all undisplayed images
     * Useful to cache background images so they do not flicker on hover
     *
     * @method preloadImages
     * @param resources {array, string} an array of images, a single image, or multiple images
     */
    var preloadImages = function(resources) {
        var i;
        if (typeOf(resources) === 'array') {
            for (i = 0 ; i < resources.length ; i++) {
                createImage(resources[i]);
            }
        }
        else if (arguments.length > 1) {
            for (i = 0 ; i < arguments.length ; i++) {
                createImage(arguments[i]);
            }
        }
        else if (typeof resources === 'string') {
            createImage(resources);
        }
        else {
            throw 'preloadImages invalid parameters, must pass in an array or string of resources'
        }
        function createImage (src) {
            var img = new Image();
            img.src = src;
        }
    };

    /**
     * Create multiline strings. Useful for creating templates
     *
     * @method multiline
     * @param obj
     * @returns {*}
     */
    var multiLine = function (obj) {
        return obj.toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1];
    };

    /**
     * Expose public API
     * @type {Function}
     */
    Peninsula.contains = contains; //tested
    Peninsula.typeOf = typeOf; //tested
    Peninsula.isInteger = isInteger; ///tested
    Peninsula.isEmpty = isEmpty; //tested
    Peninsula.isUrl = isUrl; //
    Peninsula.loadScript = loadScript;
    Peninsula.getInjectedScripts = getInjectedScripts;
    Peninsula.getInjectedStyles = getInjectedStyles;
    Peninsula.getScripts = getScripts;
    Peninsula.getStyles = getStyles;
    Peninsula.cformat = cformat;
    Peninsula.first = first;
    Peninsula.merge = merge;
    Peninsula.shuffle = shuffle;
    Peninsula.select = select;
    Peninsula.renameProperty = renameProperty;
    Peninsula.token = token;
    Peninsula.trim = trim;
    Peninsula.uuid = uuid;
    Peninsula.now = now;
    Peninsula.convertMS = convertMS;
    Peninsula.preloadImages = preloadImages;
    Peninsula.multiLine = multiLine;
    Peninsula.injectCSS = injectCSS;

    /**
     * Public properties
     * @type {string}
     */
    Peninsula._version = version;
    Peninsula._baseUrl = baseUrl;

    return Peninsula;

})(window);