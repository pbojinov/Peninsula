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
        baseUrl = currentAbsolutePath.substring(0, currentAbsolutePath.lastIndexOf('/')) + '/';

    var Peninsula = {};

    /**
     * Polyfill some functionality in aka fix some IE bugs
     *
     * x in y checks to the item without triggering a call to it
     */
    if (!('indexOf' in Array.prototype)) {
        Array.prototype.indexOf = function (item) {
            for (var i = 0; i < this.length; i++) {
                if (this[i] === item) {
                    return i;
                }
            }
            return -1;
        };
    }

    if (!('forEach' in Array.prototype)) {
        Array.prototype.forEach = function (action, that /*opt*/) {
            for (var i = 0, n = this.length; i < n; i++)
                if (i in this)
                    action.call(that, this[i], i, this);
        };
    }

    if (!('map' in Array.prototype)) {
        Array.prototype.map = function (mapper, that /*opt*/) {
            var other = new Array(this.length);
            for (var i = 0, n = this.length; i < n; i++)
                if (i in this)
                    other[i] = mapper.call(that, this[i], i, this);
            return other;
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
     * Extracted from jQuery source
     */
    var documentIsReady = false;

    var documentReadyHandler = function (fn) {
        if (!documentIsReady) {
            documentIsReady = true;
            if (document.addEventListener) {
                document.removeEventListener('DOMContentLoaded', function () {
                    documentReadyHandler(fn);
                }, false);
            }
            else if (document.attachEvent) {
                if (document.readyState == 'complete') {
                    document.detachEvent('onreadystatechange', function () {
                        documentReadyHandler(fn);
                    });
                }
            }
            fn();
        }
    };

    var documentReady = function (fn) {
        // Mozilla, Opera and webkit nightlies currently support this event
        if (document.addEventListener) {
            // Use the handy event callback
            document.addEventListener('DOMContentLoaded', function () {
                documentReadyHandler(fn);
            }, false);

            // A fallback to window.onload, that will always work
            window.addEventListener('load', function () {
                documentReadyHandler(fn);
            }, false);

            // If IE event model is used
        } else if (document.attachEvent) {
            // ensure firing before onload,
            // maybe late but safe also for iframes
            document.attachEvent('onreadystatechange', function () {
                documentReadyHandler(fn);
            });

            // A fallback to window.onload, that will always work
            window.attachEvent('onload', function () {
                documentReadyHandler(fn);
            });

            // If IE and not a frame
            // continually check to see if the document is ready
            var toplevel = false;

            try {
                toplevel = window.frameElement == null;
            } catch (e) {
            }

            if (document.documentElement.doScroll && toplevel) {
                doScrollCheck(function () {
                    documentReadyHandler(fn);
                });
            }
        }
    };

    var doScrollCheck = function (fn) {
        if (documentIsReady) {
            return;
        }
        try {
            // If IE is used, use the trick by Diego Perini
            // http://javascript.nwbox.com/IEContentLoaded/
            document.documentElement.doScroll('left');
        } catch (error) {
            window.setTimeout(function () {
                doScrollCheck(fn);
            }, 1);
            return;
        }

        fn();
    };

    /**
     * Add an event listener on an elemnent or array of elements
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
     * @param substring
     * @returns {boolean}
     */

    var contains = function (substring) {
        return this.indexOf(substring) !== -1;
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
            return (o.length === 0);
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
            throw 'invalid parameter. can only check a string'
        }
    };


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
     * @param callback
     */
    var loadScript = function (url, callback) {
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
    Peninsula.documentReady = documentReady;
    Peninsula.contains = contains;
    Peninsula.isInteger = isInteger;
    Peninsula.isEmpty = isEmpty;
    Peninsula.isUrl = isUrl;
    Peninsula.loadScript = loadScript;
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

    /**
     * Public properties
     * @type {string}
     */
    Peninsula._version = version;
    Peninsula._baseUrl = baseUrl;

    return Peninsula;

})(window);