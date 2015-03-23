/**
 * Author: petar
 * Date: 03/23/15
 */

window.Peninsula = (function(window, undefined) {

    var version = '0.2.1',
        seed = '1234567890QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm',
        location = window.location,
        document = window.document,
        currentAbsolutePath = location.toString(),
        baseUrl = currentAbsolutePath.substring(0, currentAbsolutePath.lastIndexOf('/')) + '/',
        injectedScripts = {},
        injectedStyles = {},
        injectedStyleSheets = {};

    var Peninsula = {};

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
     *  Base64 encode / decode
     *  http://www.webtoolkit.info/
     **/

    var Base64 = {

        // private property
        _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

        // public method for encoding
        encode: function(input) {
            var output = "";
            var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
            var i = 0;

            input = Base64._utf8_encode(input);

            while (i < input.length) {

                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);

                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;

                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }

                output = output +
                    this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
                    this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

            }

            return output;
        },

        // public method for decoding
        decode: function(input) {
            var output = "";
            var chr1, chr2, chr3;
            var enc1, enc2, enc3, enc4;
            var i = 0;

            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

            while (i < input.length) {

                enc1 = this._keyStr.indexOf(input.charAt(i++));
                enc2 = this._keyStr.indexOf(input.charAt(i++));
                enc3 = this._keyStr.indexOf(input.charAt(i++));
                enc4 = this._keyStr.indexOf(input.charAt(i++));

                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;

                output = output + String.fromCharCode(chr1);

                if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3);
                }

            }

            output = Base64._utf8_decode(output);

            return output;

        },

        // private method for UTF-8 encoding
        _utf8_encode: function(string) {
            string = string.replace(/\r\n/g, "\n");
            var utftext = "";

            for (var n = 0; n < string.length; n++) {

                var c = string.charCodeAt(n);

                if (c < 128) {
                    utftext += String.fromCharCode(c);
                } else if ((c > 127) && (c < 2048)) {
                    utftext += String.fromCharCode((c >> 6) | 192);
                    utftext += String.fromCharCode((c & 63) | 128);
                } else {
                    utftext += String.fromCharCode((c >> 12) | 224);
                    utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                    utftext += String.fromCharCode((c & 63) | 128);
                }

            }

            return utftext;
        },

        // private method for UTF-8 decoding
        _utf8_decode: function(utftext) {
            var string = "";
            var i = 0;
            var c = c1 = c2 = 0;

            while (i < utftext.length) {

                c = utftext.charCodeAt(i);

                if (c < 128) {
                    string += String.fromCharCode(c);
                    i++;
                } else if ((c > 191) && (c < 224)) {
                    c2 = utftext.charCodeAt(i + 1);
                    string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                    i += 2;
                } else {
                    c2 = utftext.charCodeAt(i + 1);
                    c3 = utftext.charCodeAt(i + 2);
                    string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                    i += 3;
                }

            }
            return string;
        }
    };

    /**
     * Main API Function
     */

    var encode = function(input) {
        return Base64.encode(input);
    };

    var decode = function() {
        return Base64.decode(input);
    };

    /**
     * Add css to a new style tag and append it to the head of the page
     *
     * @method injectCSS
     * @param styles {string} the css content as string
     * @param elementId {string} id of the new style tag
     */
    var injectCSS = function(styles, elementId) {
        var style = document.createElement('style'),
            elementId = elementId || uuid();
        style.setAttribute('type', 'text/css');
        style.setAttribute('id', elementId);

        //IE style.innerHTML bug - http://stackoverflow.com/a/5618889/907388
        if (style.styleSheet) {
            style.styleSheet.cssText = styles.css;
        } else {
            style.innerHTML = styles.css;
        }
        injectedStyles.elementId = styles;
        document.getElementsByTagName('head')[0].appendChild(style);
    };

    /**
     * Append div with content to document body
     */
    var injectHTML = function(content, elementId) {
        var div = document.createElement('div'),
            elementId = elementId || uuid();
        div.setAttribute('id', elementId);
        div.innerHTML = content;
        document.body.appendChild(div);
    };

    /**
     * Add an event listener on an element or array of elements
     *
     * @method addEventListener
     * @param element {DOMNode}
     * @param eventName {String}
     * @param eventHandler {Function}
     */
    var addEventListener = function(element, eventName, eventHandler) {
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

    var contains = function(string, substring) {
        return string.indexOf(substring) !== -1;
    };

    /**
     * Tests if the value is an integer
     *
     * @method isInteger
     * @param value {} the value to test
     * @return {boolean} whether it is an integer
     */
    var isInteger = function(value) {
        return (parseFloat(value) == parseInt(value)) && !isNaN(value);
    };

    /**
     * Tests whether a variable contains a false value,
     * or an empty object or array.
     * @param object
     *  The object to test.
     */
    var isEmpty = function(object) {
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
        } else if (t === 'array') {
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
    var isUrl = function(url) {
        if (typeof url === 'string') {
            return url.match(new RegExp('^[A-Za-z]*:\/\/'));
        } else {
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
    var loadScript = function(url, id, callback) {
        var script = document.createElement('script'),
            id = id || uuid(),
            loaded;
        script.setAttribute('src', url);
        script.setAttribute('id', id);
        if (callback) {
            script.onreadystatechange = script.onload = function() {
                if (!loaded) {
                    callback();
                }
                loaded = true;
            };
        }
        injectedScripts.id = url;
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
     * Return all styles on the page
     * @returns [Array] array of style tags
     */
    var getStyles = function() {
        return document.getElementsByTagName('style');
    };

    /**
     * Return all injected scripts loaded on the page by Peninsula
     * @returns {Object} object of script tags
     */
    var getInjectedScripts = function() {
        return injectedScripts;
    };

    /**
     * Return all styles loaded on the page by Peninsula
     * @returns {Object} object of style tags
     */
    var getInjectedStyles = function() {
        return injectedStyles;
    };

    /**
     * Return all style sheets loaded on the page by Peninsula
     * @returns {Object} object of style sheets
     */
    var getInjectedStylesSheets = function() {
        return injectedStyleSheets;
    };

    /**
     *
     * @method cformat
     * @param string
     * @param arguments
     * @returns {*}
     */
    var cformat = function(string, arguments) {
        var pattern = /\{\d+\}/g;
        var args = arguments;
        return string.replace(pattern, function(capture) {
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
    var first = function(container) {
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
    var has = function(object, key) {
        return Object.prototype.hasOwnProperty.call(object, key);
    };

    /**
     * Shuffle a string or array
     *
     * @method shuffle
     * @param input {string|array} the string or array to shuffle
     * @returns {string|array|boolean} the shuffled string
     */
    var shuffle = function(input) {
        if (!input.length) {
            return false;
        } else {
            var i, j, k, x;
            if (typeof input === 'string') {
                var arr = input.split('');
                for (j, x, i = arr.length; i; j = parseInt(Math.random() * i), x = arr[--i], arr[i] = arr[j], arr[j] = x) {}
                arr = arr.join('');
                return arr;
            } else if (typeOf(input) === 'array') {
                i = input.length;
                while (--i) {
                    j = Math.floor(Math.random() * (i + 1));
                    var tempi = input[i];
                    var tempj = input[j];
                    input[i] = tempj;
                    input[j] = tempi;
                }
                return input;
            } else {
                throw 'invalid parameter: can only shuffle an array or string'
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
    var trim = function(string, maxLength) {
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
            } else if (lastSpace > -1) {
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
    var now = function() {
        return new Date().getTime();
    };

    /**
     * Convert milliseconds to Hour:Minute:Seconds || Minute:Seconds
     *
     * @method convertMS
     * @param {int} milliseconds
     * @return {Object} h = hour, m = minute, s = seconds
     */
    var convertMS = function(milliseconds) {
        var h, m, s;
        s = Math.floor(milliseconds / 1000);
        m = Math.floor(s / 60);
        s = s % 60;
        h = Math.floor(m / 60);
        m = m % 60;
        h = h % 24;
        return {
            h: h,
            m: m,
            s: s,
            total: (h > 0) ? (h + ':' + m + ':' + s) : (m + ':' + s)
        };
    };

    /**
     * Return a random token of characters
     * Uses seed of 0-9, upper/lower case letters, and the current time in milliseconds
     *
     * @method token
     * @param length {int} length of token, defaults to 10
     * @returns {string} a random string of maximum length 74
     */

    var token = function(length) {
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
    var typeOf = function(value) {
        var s = typeof value;
        if (s === 'object') {
            if (value === null) {
                return 'null';
            }
            if (value instanceof Array || (value.constructor && value.constructor.name === 'Array') || Object.prototype.toString.apply(value) === '[object Array]') {
                s = 'array';
            } else if (typeof(value) != 'undefined') {
                return value;
            } else if (typeof(value.constructor) != 'undefined' && typeof(value.constructor.name) != 'undefined') {
                if (value.constructor.name == 'Object') {
                    return 'object';
                }
                return value.constructor.name;
            } else {
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
    var uuid = function() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };

    /**
     * Extend Object to allow rename of pre-existing property
     *
     * @mehod renamePropery
     * @return {Object}
     */
    var renameProperty = function(obj, oldName, newName) {
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
    var select = function(query) {

        var id = /#/g,
            match = query.match(id);

        //user is asking for an element by id
        if ( !! match) {
            return document.getElementById(query.replace(/#/g, ''));
        } else if (('querySelectorAll' in document)) {
            var el = document.querySelectorAll(query);
            return el.length > 1 ? el : el[0];
        } else {
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
    var merge = function(mergeTo, mergeFrom) {
        if ((typeOf(mergeTo) === 'array') && (typeOf(mergeFrom) === 'array')) {
            Array.prototype.push.apply(mergeTo, mergeFrom);
            return mergeTo;
        } else {
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
            for (i = 0; i < resources.length; i++) {
                createImage(resources[i]);
            }
        } else if (arguments.length > 1) {
            for (i = 0; i < arguments.length; i++) {
                createImage(arguments[i]);
            }
        } else if (typeof resources === 'string') {
            createImage(resources);
        } else {
            throw 'preloadImages invalid parameters, must pass in an array or string of resources'
        }

        function createImage(src) {
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
    var multiLine = function(obj) {
        return obj.toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1];
    };

    /**
     * Light wrapper around addEventListener for IE8 support
     *
     * @method bindEvent
     * @param {DOMElement} element - the dom element on which to listen to
     * @param {DOMEvent} eventName - event to listen for
     * @param {function} eventHandler - function to call when event fires
     */
    var bindEvent = function(element, eventName, eventHandler) {
        if (element.addEventListener) {
            element.addEventListener(eventName, eventHandler, false);
        } else if (element.attachEvent) {
            element.attachEvent('on' + eventName, eventHandler);
        }
    };

    /**
     * Load a new theme style sheet in the head of the page
     *
     * @method injectStylesheet
     * @param url {string} the url style sheet
     * @param callback {function} optional callback function called when script loads
     */
    var injectStylesheet = function(url, callback) {
        var sheet = document.createElement('link'),
            id = uuid(),
            loaded;
        sheet.setAttribute('rel', 'stylesheet');
        sheet.setAttribute('type', 'text/css');
        sheet.setAttribute('href', url);
        if (callback) {
            sheet.onreadystatechange = sheet.onload = function() {
                if (!loaded) {
                    callback();
                }
                loaded = true;
            };
        }
        document.getElementsByTagName('head')[0].appendChild(sheet);
        injectedStyleSheets.id = url;
    };

    /**
     * Determine if the context of where this code is being executed is an iframe
     *
     * @method isIframe
     * @return {Boolean} true if executed in iframe, false otherwise
     */
    var inIframe = function() {
        try {
            return window.self !== window.top;
        } catch (e) {
            return true;
        }
    };

    /**
     * Determine if context where this code is running is a touch device
     * Test for Touch Events of Pointer Events running on touch-capable device
     * 
     * https://hacks.mozilla.org/2013/04/detecting-touch-its-the-why-not-the-how/
     * 
     * @return {Boolean} true if device is touch, false otherwise
     */
    var isTouchDevice = function() {
        return (('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0)) 
    };

    /**
     * Expose public API
     * @type {Function}
     */

    Peninsula.encode = encode;
    Peninsula.decode = decode;
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
    Peninsula.injectStylesheet = injectStylesheet;
    Peninsula.inIframe = inIframe;
    Peninsula.isTouchDevice = isTouchDevice;

    /**
     * Public properties
     * @type {string}
     */
    Peninsula._version = version;
    Peninsula._baseUrl = baseUrl;

    /**
     * Shorthand way to access Peninsula
     */

    window.Pen = Peninsula;

    return Peninsula;

})(window);
