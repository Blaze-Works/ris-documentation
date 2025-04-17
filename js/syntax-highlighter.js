// Syntax Highlighter
// by Sharon Abodunrin
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('global/window'), require('global/document')) : typeof define === 'function' && define.amd ? define(['global/window', 'global/document'], factory) : (global = global || self,
      global.Highlighter = factory(global.window, global.document));
    if (!global.document) { throw new Error('Highlighter need a window and a document'); }
  }(this, (function (window$1, document) {
  
    window$1 = window$1 && Object.prototype.hasOwnProperty.call(window$1, 'default') ? window$1['default'] : window$1;
    document = document && Object.prototype.hasOwnProperty.call(document, 'default') ? document['default'] : document;
  
    var userAgent = navigator.userAgent;
    var platform = navigator.platform;
  
    var gecko = /gecko\/\d/i.test(userAgent);
    var ie_upto10 = /MSIE \d/.test(userAgent);
    var ie_11up = /Trident\/(?:[7-9]|\d{2,});\..*rv:(\d+)/.exec(userAgent);
    var edge = /Edge\/(\d+)/.exec(userAgent);
    var ie = ie_upto10 || ie_11up || edge;
    var ie_version = ie && (ie_upto10 ? document.documentMode || 6 : +(edge || ie_11up)[1]);
    var webkit = !edge && /WebKit\//.test(userAgent);
    var qtwebkit = webkit && /Qt\/\d+\.\d+/.test(userAgent);
    var chrome = !edge && /Chrome\//.test(userAgent);
    var presto = /Opera\//.test(userAgent);
    var safari = /Apple Computer/.test(navigator.vendor);
    var mac_geMountainLion = /Mac OS X 1\d\D([8-9]|\d\d)\D/.test(userAgent);
    var phantom = /PhantomJS/.test(userAgent);
  
    var ios = !edge && /AppleWebKit/.test(userAgent) && /Mobile\/\w+/.test(userAgent);
    var android = /Android/.test(userAgent);
    // This is woefully incomplete. Suggestions for alternative methods welcome.
    var mobile = ios || android || /webOS|BlackBerry|Opera Mini|Opera Mobi|IEMobile/i.test(userAgent);
    var mac = ios || /Mac/.test(platform);
    var chromeOS = /\bCrOS\b/.test(userAgent);
    var windows = /win/i.test(platform);
  
    /**
     * @file create-logger.js
     * @module create-logger
     */
  
    var history = [];
    /**
     * Log messages to the console and history based on the type of message
     *
     * @private
     * @param  {string} type
     *         The name of the console method to use.
     *
     * @param  {Array} args
     *         The arguments to be passed to the matching console method.
     */
  
    var LogByTypeFactory = function LogByTypeFactory(name, log) {
      return function (type, level, args) {
        var lvl = log.levels[level];
        var lvlRegExp = new RegExp('^(' + lvl + ')$');
  
        if (type !== 'log') {
          // Add the type to the front of the message when it's not 'log'.
          args.unshift(type.toUpperCase() + ':');
        } // Add console prefix after adding to history.
  
  
        args.unshift(name + ':'); // Add a clone of the args at this point to history.
  
        if (history) {
          history.push([].concat(args)); // only store 1000 history entries
  
          var splice = history.length - 1000;
          history.splice(0, splice > 0 ? splice : 0);
        } // If there's no console then don't try to output messages, but they will
        // still be stored in history.
  
  
        if (!window$1.console) {
          return;
        } // Was setting these once outside of this function, but containing them
        // in the function makes it easier to test cases where console doesn't exist
        // when the module is executed.
  
  
        var fn = window$1.console[type];
  
        if (!fn && type === 'debug') {
          // Certain browsers don't have support for console.debug. For those, we
          // should default to the closest comparable log.
          fn = window$1.console.info || window$1.console.log;
        } // Bail out if there's no console or if this type is not allowed by the
        // current logging level.
  
  
        if (!fn || !lvl || !lvlRegExp.test(type)) {
          return;
        }
  
        fn[Array.isArray(args) ? 'apply' : 'call'](window$1.console, args);
      };
    };
  
    function createLogger(name) {
      // This is the private tracking variable for logging level.
      var level = 'info'; // the curried logByType bound to the specific log and history
  
      var logByType;
      /**
       * Logs plain debug messages. Similar to `console.log`.
       *
       * Due to [limitations](https://github.com/jsdoc3/jsdoc/issues/955#issuecomment-313829149)
       * of our JSDoc template, we cannot properly document this as both a function
       * and a namespace, so its function signature is documented here.
       *
       * #### Arguments
       https://xhamster.com/embed/13881479
       * ##### *args
       * Mixed[]
       *
       * Any combination of values that could be passed to `console.log()`.
       *
       * #### Return Value
       *
       * `undefined`
       *
       * @namespace
       * @param    {Mixed[]} args
       *           One or more messages or objects that should be logged.
       */
  
      var log = function log() {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }
  
        logByType('log', level, args);
      }; // This is the logByType helper that the logging methods below use
  
  
      logByType = LogByTypeFactory(name, log);
      /**
       * Create a new sublogger which chains the old name to the new name.
       *
       * For example, doing `Highlighter.log.createLogger('page')` and then using that logger will log the following:
       * ```js
       *  mylogger('foo');
       * ```
       *
       * @param {string} name
       *        The name to add call the new logger
       * @return {Object}
       */
  
      log.createLogger = function (subname) {
        return createLogger(name + ': ' + subname);
      };
  
  
      log.levels = {
        all: 'debug|log|warn|error',
        off: '',
        debug: 'debug|log|warn|error',
        info: 'log|warn|error',
        warn: 'warn|error',
        error: 'error',
        DEFAULT: level
      };
      /**
       * Get or set the current logging level.
       *
       * If a string matching a key from {@link module:log.levels} is provided, acts
       * as a setter.
       *
       * @param  {string} [lvl]
       *         Pass a valid level to set a new logging level.
       *
       * @return {string}
       *         The current logging level.
       */
  
      log.level = function (lvl) {
        if (typeof lvl === 'string') {
          if (!log.levels.hasOwnProperty(lvl)) {
            throw new Error('\'' + lvl + '\' in not a valid log level');
          }
  
          level = lvl;
        }
  
        return level;
      };
      /**
       * Returns an array containing everything that has been logged to the history.
       *
       * This array is a shallow clone of the internal history record. However, its
       * contents are _not_ cloned; so, mutating objects inside this array will
       * mutate them in history.
       *
       * @return {Array}
       */
  
  
      log.history = function () {
        return history ? [].concat(history) : [];
      };
      /**
       * Allows you to filter the history by the given logger name
       *
       * @param {string} fname
       *        The name to filter by
       *
       * @return {Array}
       *         The filtered list to return
       */
  
  
      log.history.filter = function (fname) {
        return (history || []).filter(function (historyItem) {
          // if the first item in each historyItem includes `fname`, then it's a match
          return new RegExp('.*' + fname + '.*').test(historyItem[0]);
        });
      };
      /**
       * Clears the internal history tracking, but does not prevent further history
       * tracking.
       */
  
  
      log.history.clear = function () {
        if (history) {
          history.length = 0;
        }
      };
      /**
       * Disable history tracking if it is currently enabled.
       */
  
  
      log.history.disable = function () {
        if (history !== null) {
          history.length = 0;
          history = null;
        }
      };
      /**
       * Enable history tracking if it is currently disabled.
       */
  
  
      log.history.enable = function () {
        if (history === null) {
          history = [];
        }
      };
      /**
       * Logs error messages. Similar to `console.error`.
       *
       * @param {Mixed[]} args
       *        One or more messages or objects that should be logged as an error
       */
  
  
      log.error = function () {
        for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }
  
        return logByType('error', level, args);
      };
      /**
       * Logs warning messages. Similar to `console.warn`.
       *
       * @param {Mixed[]} args
       *        One or more messages or objects that should be logged as a warning.
       */
  
  
      log.warn = function () {
        for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
          args[_key3] = arguments[_key3];
        }
  
        return logByType('warn', level, args);
      };
      /**
       * Logs debug messages. Similar to `console.debug`, but may also act as a comparable
       * log if `console.debug` is not available
       *
       * @param {Mixed[]} args
       *        One or more messages or objects that should be logged as debug.
       */
  
  
      log.debug = function () {
        for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
          args[_key4] = arguments[_key4];
        }
  
        return logByType('debug', level, args);
      };
  
      return log;
    }
  
    var log = createLogger('Highlighter');
    var createLogger$1 = log.createLogger;
  
    function throwIfWhitespace(str) {
      if (str.indexOf(' ') >= 0) {
        throw new Error('class has illegal whitespace characters');
      }
    }
  
    function elemt(tag, content, className, attributes, style) {
      var elt = document.createElement(tag);
      if (className) {
        elt.className = className;
      }
      if (style) {
        elt.style.cssText = style;
      }
      if (typeof content == 'string') {
        elt.appendChild(document.createTextNode(content));
      } else if (content) {
        for (var i = 0; i < content.length; ++i) {
          elt.appendChild(content[i]);
        }
      }
      if (attributes) {
        Object.getOwnPropertyNames(attributes).forEach(function (attrName) {
          elt.setAttribute(attrName, attributes[attrName]);
        });
      }
      return elt;
    }
  
    function remove(elt) {
      rmElements(getElements(elt));
    }
  
    function rmElements(elt) {
      for (var i = 0; i < elt.length; i++) {
        rmElement(elt[i])
      }
    }
  
    function rmElement(elt) {
      if (elt) { elt.remove() }
    }
  
    function hide(elt) {
      hideElements(getElements(elt));
    }
  
    function hideElements(elt) {
      for (var i = 0; i < elt.length; i++) {
        hideElemt(elt[i]);
      }
    }
  
    function hideElemt(elt) {
      styleElemt(elt, 'display: none');
    }
  
    function show(elt) {
      showElements(getElements(elt));
    }
  
    function showElements(elt) {
      for (var i = 0; i < elt.length; i++) {
        showElemt(elt[i]);
      }
    }
  
    function showElemt(elt) {
      styleElemt(elt, 'display: block');
    }
  
    function toggleShow(elt) {
      toogleShowElements(getElements(elt));
    }
  
    function toogleShowElements(elt) {
      for (var i = 0; i < elt.length; i++) {
        toogleShowElemt(elt[i]);
      }
    }
  
    function toogleShowElemt(elt) {
      if (elt.style.display == 'none') {
        showElemt(elt);
      } else {
        hideElemt(elt);
      }
    }
  
    function hasClass(elt, classToCheck) {
      throwIfWhitespace(classToCheck);
  
      if (elt.classList) {
        return element.classList.contains(classToCheck);
      }
  
      return classRegExp(classToCheck).test(elt.className);
    }
  
    function addClass(elt, classN) {
      if (elt.classList) {
        elt.classList.add(classN);
      } else if (!hasClass(elt, classN)) {
        elt.className = (elt.className + ' ' + classN).trim();
      }
  
      return elt;
    }
  
    function removeClass(elt, classN) {
      if (elt.classList) {
        elt.classList.remove(classN);
      } else {
        throwIfWhitespace(classN);
        elt.className = elt.className.split(/\s+/).filter(function (c) {
          return c !== classN;
        }).join(' ');
      }
  
      return elt;
    }
  
    function toggleClass(elt, classToToggle, predicate) {
      var has = hasClass(elt, classToToggle);
  
      if (typeof predicate === 'function') {
        predicate = predicate(elt, classToToggle);
      }
  
      if (typeof predicate !== 'boolean') {
        predicate = !has;
      }
  
  
      if (predicate === has) {
        return;
      }
  
      if (predicate) {
        addClass(elt, classToToggle);
      } else {
        removeClass(elt, classToToggle);
      }
  
      return elt;
    }
  
    function setAttributes(elt, attributes) {
      Object.getOwnPropertyNames(attributes).forEach(function (attrName) {
        var attrValue = attributes[attrName];
  
        if (attrValue === null || typeof attrValue === 'undefined' || attrValue === false) {
          elt.removeAttribute(attrName);
        } else {
          elt.setAttribute(attrName, attrValue === true ? '' : attrValue);
        }
      });
    }
  
    function getAttributes(elt) {
      var obj = {};
      if (elt && elt.attributes && elt.attributes.length > 0) {
        var attrs = elt.attributes;
  
        for (var i = attrs.length - 1; i >= 0; i--) {
          var attrName = attrs[i].name;
          var attrVal = attrs[i].value;
  
          if (typeof elt[attrName] === 'boolean') {
            attrVal = attrVal !== null ? true : false;
          }
  
          obj[attrName] = attrVal;
        }
      }
  
      return obj;
    }
  
    function pickRandom(items) {
      var min = 0;
      var max = items.length;
      return items[Math.floor(Math.random() * (max - min)) + min];
    };
  
    function getElemt(elt) {
      if (typeof elt == 'string') { return document.querySelector(elt) }
      else { return elt }
    }
  
    function getElements(elt) {
      if (typeof elt == 'object') { return [elt] }
      else {
        if (document.querySelectorAll(elt)) { return document.querySelectorAll(elt) }
        else { return elt; }
      }
    }
  
    function getAttr(elt, attribute) {
      return elt.getAttribute(attribute);
    }
  
    function addAttr(elt, attribute, value) {
      elt.setAttribute(attribute, value);
    }
  
    function removeAttr(elt, attribute) {
      elt.removeAttribute(attribute);
    }
  
    function css(elt, style, val) {
      styleElements(getElements(elt), style, val);
    }
  
    function styleElements(elt, style, val) {
      for (var i = 0; i < elt.length; i++) {
        styleElemt(elt[i], style, val);
      }
    }
  
    function styleElemt(elt, style, val) {
      if (style) { elt.style.cssText += style; }
      else if (style && val) { elt.style.setProperty(style, val) }
      else { return elt.style.cssText }
    }
  
    function addChild(parent, child) {
      if (typeof parent == 'string') {
        for (var i = 0; i < getElements(parent).length; i++) {
          var elt = getElements(parent)[i];
          for (var i = 0; i < child.length; i++) { elt.appendChild(child[i]); }
        }
      } else {
        for (var i = 0; i < child.length; i++) {
          parent.appendChild(child[i]);
        }
      }
    }
  
    function removeChild(parent, child) {
      if (typeof parent == 'string') {
        for (var i = 0; i < getElements(parent).length; i++) {
          var elt = getElements(parent)[i];
          for (var i = 0; i < child.length; i++) { elt.removeChild(child[i]); }
        }
      } else {
        for (var i = 0; i < child.length; i++) {
          parent.removeChild(child[i]);
        }
      }
    }
  
    function blockTextSelection() {
      document.body.focus();
  
      document.onselectstart = function () {
        return false;
      };
    }
  
    function unblockTextSelection() {
      document.onselectstart = function () {
        return true;
      };
    }
  
    function getBoundingClientRect(elt) {
      if (elt && elt.getBoundingClientRect && elt.parentNode) {
        var rect = elt.getBoundingClientRect();
        var result = {};
        ['bottom', 'height', 'left', 'right', 'top', 'width'].forEach(function (k) {
          if (rect[k] !== undefined) {
            result[k] = rect[k];
          }
        });
  
        if (!result.height) {
          result.height = parseFloat(computedStyle(elt, 'height'));
        }
  
        if (!result.width) {
          result.width = parseFloat(computedStyle(elt, 'width'));
        }
  
        return result;
      }
    }
  
    function findPosition(elt) {
      if (!elt || elt && !elt.offsetParent) {
        return {
          left: 0,
          top: 0,
          width: 0,
          height: 0
        };
      }
  
      var width = elt.offsetWidth;
      var height = elt.offsetHeight;
      var left = 0;
      var top = 0;
  
      do {
        left += elt.offsetLeft;
        top += elt.offsetTop;
        elt = elt.offsetParent;
      } while (elt);
  
      return {
        left: left,
        top: top,
        width: width,
        height: height
      };
    }
  
    function getPointerPosition(elt, event) {
      var position = {};
      var boxTarget = findPosition(event.target);
      var box = findPosition(elt);
      var boxW = box.width;
      var boxH = box.height;
      var offsetY = event.offsetY - (box.top - boxTarget.top);
      var offsetX = event.offsetX - (box.left - boxTarget.left);
  
      if (event.changedTouches) {
        offsetX = event.changedTouches[0].pageX - box.left;
        offsetY = event.changedTouches[0].pageY + box.top;
      }
  
      position.y = 1 - Math.max(0, Math.min(1, offsetY / boxH));
      position.x = Math.max(0, Math.min(1, offsetX / boxW));
      return position;
    }
  
    function isTextNode(value) {
      return isObject(value) && value.nodeType === 3;
    }
  
    function clearElemt(elt) {
      while (elt.firstChild) {
        elt.removeChild(elt.firstChild);
      }
  
      return elt;
    }
  
    function normalizeContent(content) {
      if (typeof content === 'function') {
        content = content();
      }
  
  
      return (Array.isArray(content) ? content : [content]).map(function (value) {
        if (typeof value === 'function') {
          value = value();
        }
  
        if (isEl(value) || isTextNode(value)) {
          return value;
        }
  
        if (typeof value === 'string' && /\S/.test(value)) {
          return document.createTextNode(value);
        }
      }).filter(function (value) {
        return value;
      });
    }
  
    function appendContent(elt, content) {
      normalizeContent(content).forEach(function (node) {
        return elt.appendChild(node);
      });
      return elt;
    }
  
    function insertContent(elt, content) {
      return appendContent(emptyEl(elt), content);
    }
  
    function getStyleValue(elemt, style) {
      elemt = typeof elemt == 'string' ? getElemt(elemt) : elemt;
      if (window.getComputedStyle) {
          return window.getComputedStyle(elemt, null).getPropertyValue(style);
      } else {
          return elemt.currentStyle[style];
      }
    }
  
  
    function toCssPx(pixels) {
        if (!window.isFinite(pixels)) {
            console.error('Pixel value is not a number: ' + pixels);
        }
        return Math.round(pixels) + 'px';
    };
  
    function isSingleLeftClick(event) {
      if (event.button === undefined && event.buttons === undefined) {
        return true;
      }
  
      if (event.button === 0 && event.buttons === undefined) {
        return true;
      }
  
  
      if (event.type === 'mouseup' && event.button === 0 && event.buttons === 0) {
        return true;
      }
  
      if (event.button !== 0 || event.buttons !== 1) {
        return false;
      }
  
      return true;
    }
  
    /**
     * @file guid.js
     * @module guid
     */
    // Default value for GUIDs. This allows us to reset the GUID counter in tests.
    //
    var _initialGuid = 3;
    /**
     * Unique ID for an element or function
     *
     * @type {Number}
     */
  
    var _guid = _initialGuid;
    /**
     * Get a unique auto-incrementing ID by number that has not been returned before.
     *
     * @return {number}
     *         A new unique ID.
     */
  
    function newGUID() {
      return _guid++;
    }
  
    /**
     * @file dom-data.js
     * @module dom-data
     */
    var FakeWeakMap;
  
    // if (!window.WeakMap) {
    FakeWeakMap = /*#__PURE__*/function () {
      function FakeWeakMap() {
        this.vdata = 'vdata' + Math.floor(window$1.performance && window$1.performance.now() || Date.now());
        this.data = {};
      }
  
      var _proto = FakeWeakMap.prototype;
  
      _proto.set = function set(key, value) {
        var access = key[this.vdata] || newGUID();
  
        if (!key[this.vdata]) {
          key[this.vdata] = access;
        }
  
        this.data[access] = value;
        return this;
      };
  
      _proto.get = function get(key) {
        var access = key[this.vdata]; // we have data, return it
  
        if (access) {
          return this.data[access];
        } // we don't have data, return nothing.
        // return undefined explicitly as that's the contract for this method
  
  
        log('We have no data for this element', key);
        return undefined;
      };
  
      _proto.has = function has(key) {
        var access = key[this.vdata];
        return access in this.data;
      };
  
      _proto['delete'] = function _delete(key) {
        var access = key[this.vdata];
  
        if (access) {
          delete this.data[access];
          delete key[this.vdata];
        }
      };
  
      return FakeWeakMap;
    }();
    // }
    /**
     * Element Data Store.
     *
     * Allows for binding data to an element without putting it directly on the
     * element. Ex. Event listeners are stored here.
     * (also from jsninja.com, slightly modified and updated for closure compiler)
     *
     * @type {Object}
     * @private
     */
  
  
    var DomData = new FakeWeakMap();
  
    /**
     * @file events.js. An Event System (John Resig - Secrets of a JS Ninja http://jsninja.com/)
     * (Original book version wasn't completely usable, so fixed some things and made Closure Compiler compatible)
     * This should work very similarly to jQuery's events, however it's based off the book version which isn't as
     * robust as jquery's, so there's probably some differences.
     *
     * @file events.js
     * @module events
     */
    /**
     * Clean up the listener cache and dispatchers
     *
     * @param {Element|Object} elemt
     *        Element to clean up
     *
     * @param {string} type
     *        Type of event to clean up
     */
  
    function _cleanUpEvents(elemt, type) {
      if (!DomData.has(elemt)) {
        return;
      }
  
      var data = DomData.get(elemt); // Remove the events of a particular type if there are none left
  
      if (data.handlers[type].length === 0) {
        delete data.handlers[type]; // data.handlers[type] = null;
        // Setting to null was causing an error with data.handlers
        // Remove the meta-handler from the element
  
        if (elemt.removeEventListener) {
          elemt.removeEventListener(type, data.dispatcher, false);
        } else if (elemt.detachEvent) {
          elemt.detachEvent('on' + type, data.dispatcher);
        }
      } // Remove the events object if there are no types left
  
  
      if (Object.getOwnPropertyNames(data.handlers).length <= 0) {
        delete data.handlers;
        delete data.dispatcher;
        delete data.disabled;
      } // Finally remove the element data if there is no data left
  
  
      if (Object.getOwnPropertyNames(data).length === 0) {
        DomData['delete'](elemt);
      }
    }
    /**
     * Loops through an array of event types and calls the requested method for each type.
     *
     * @param {Function} fn
     *        The event method we want to use.
     *
     * @param {Element|Object} elemt
     *        Element or object to bind listeners to
     *
     * @param {string} type
     *        Type of event to bind to.
     *
     * @param {EventTarget~EventListener} callback
     *        Event listener.
     */
  
  
    function _handleMultipleEvents(fn, elemt, types, callback) {
      types.forEach(function (type) {
        // Call the event method for each one of the types
        fn(elemt, type, callback);
      });
    }
    /**
     * Fix a native event to have standard property values
     *
     * @param {Object} event
     *        Event object to fix.
     *
     * @return {Object}
     *         Fixed event object.
     */
  
  
    function fixEvent(event) {
      if (event.fixed_) {
        return event;
      }
  
      function returnTrue() {
        return true;
      }
  
      function returnFalse() {
        return false;
      } // Test if fixing up is needed
      // Used to check if !event.stopPropagation instead of isPropagationStopped
      // But native events return true for stopPropagation, but don't have
      // other expected methods like isPropagationStopped. Seems to be a problem
      // with the Javascript Ninja code. So we're just overriding all events now.
  
  
      if (!event || !event.isPropagationStopped) {
        var old = event || window$1.event;
        event = {}; // Clone the old object so that we can modify the values event = {};
        // IE8 Doesn't like when you mess with native event properties
        // Firefox returns false for event.hasOwnProperty('type') and other props
        //  which makes copying more difficult.
        // TODO: Probably best to create a whitelist of event props
  
        for (var key in old) {
          // Safari 6.0.3 warns you if you try to copy deprecated layerX/Y
          // Chrome warns you if you try to copy deprecated keyboardEvent.keyLocation
          // and webkitMovementX/Y
          if (key !== 'layerX' && key !== 'layerY' && key !== 'keyLocation' && key !== 'webkitMovementX' && key !== 'webkitMovementY') {
            // Chrome 32+ warns if you try to copy deprecated returnValue, but
            // we still want to if preventDefault isn't supported (IE8).
            if (!(key === 'returnValue' && old.preventDefault)) {
              event[key] = old[key];
            }
          }
        } // The event occurred on this element
  
  
        if (!event.target) {
          event.target = event.srcElement || document;
        } // Handle which other element the event is related to
  
  
        if (!event.relatedTarget) {
          event.relatedTarget = event.fromElement === event.target ? event.toElement : event.fromElement;
        } // Stop the default browser action
  
  
        event.preventDefault = function () {
          if (old.preventDefault) {
            old.preventDefault();
          }
  
          event.returnValue = false;
          old.returnValue = false;
          event.defaultPrevented = true;
        };
  
        event.defaultPrevented = false; // Stop the event from bubbling
  
        event.stopPropagation = function () {
          if (old.stopPropagation) {
            old.stopPropagation();
          }
  
          event.cancelBubble = true;
          old.cancelBubble = true;
          event.isPropagationStopped = returnTrue;
        };
  
        event.isPropagationStopped = returnFalse; // Stop the event from bubbling and executing other handlers
  
        event.stopImmediatePropagation = function () {
          if (old.stopImmediatePropagation) {
            old.stopImmediatePropagation();
          }
  
          event.isImmediatePropagationStopped = returnTrue;
          event.stopPropagation();
        };
  
        event.isImmediatePropagationStopped = returnFalse; // Handle mouse position
  
        if (event.clientX !== null && event.clientX !== undefined) {
          var doc = document.documentElement;
          var body = document.body;
          event.pageX = event.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0);
          event.pageY = event.clientY + (doc && doc.scrollTop || body && body.scrollTop || 0) - (doc && doc.clientTop || body && body.clientTop || 0);
        } // Handle key presses
  
  
        event.which = event.charCode || event.keyCode; // Fix button for mouse clicks:
        // 0 == left; 1 == middle; 2 == right
  
        if (event.button !== null && event.button !== undefined) {
  
          /* eslint-disable */
          event.button = event.button & 1 ? 0 : event.button & 4 ? 1 : event.button & 2 ? 2 : 0;
          /* eslint-enable */
        }
      }
  
      event.fixed_ = true; // Returns fixed-up instance
  
      return event;
    }
    /**
     * Whether passive event listeners are supported
     */
  
    var _supportsPassive;
  
    var supportsPassive = function supportsPassive() {
      if (typeof _supportsPassive !== 'boolean') {
        _supportsPassive = false;
  
        try {
          var opts = Object.defineProperty({}, 'passive', {
            get: function get() {
              _supportsPassive = true;
            }
          });
          window$1.addEventListener('test', null, opts);
          window$1.removeEventListener('test', null, opts);
        } catch (e) {// disregard
        }
      }
  
      return _supportsPassive;
    };
    /**
     * Touch events Chrome expects to be passive
     */
  
  
    var passiveEvents = ['touchstart', 'touchmove'];
    /**
     * Add an event listener to element
     * It stores the handler function in a separate cache object
     * and adds a generic handler to the element's event,
     * along with a unique id (guid) to the element.
     *
     * @param {Element|Object} elemt
     *        Element or object to bind listeners to
     *
     * @param {string|string[]} type
     *        Type of event to bind to.
     *
     * @param {EventTarget~EventListener} fn
     *        Event listener.
     */
  
    function on(elemt, type, fn) {
      if (Array.isArray(type)) {
        return _handleMultipleEvents(on, elemt, type, fn);
      }
  
      if (!DomData.has(elemt)) {
        DomData.set(elemt, {});
      }
  
      var data = DomData.get(elemt); // We need a place to store all our handler data
  
      if (!data.handlers) {
        data.handlers = {};
      }
  
      if (!data.handlers[type]) {
        data.handlers[type] = [];
      }
  
      if (!fn.guid) {
        fn.guid = newGUID();
      }
  
      data.handlers[type].push(fn);
  
      if (!data.dispatcher) {
        data.disabled = false;
  
        data.dispatcher = function (event, hash) {
          if (data.disabled) {
            return;
          }
  
          event = fixEvent(event);
          var handlers = data.handlers[event.type];
  
          if (handlers) {
            // Copy handlers so if handlers are added/removed during the process it doesn't throw everything off.
            var handlersCopy = handlers.slice(0);
  
            for (var m = 0, n = handlersCopy.length; m < n; m++) {
              if (event.isImmediatePropagationStopped()) {
                break;
              } else {
                try {
                  handlersCopy[m].call(elemt, event, hash);
                } catch (e) {
                  log.error(e);
                }
              }
            }
          }
        };
      }
  
      if (data.handlers[type].length === 1) {
        if (elemt.addEventListener) {
          var options = false;
  
          if (supportsPassive() && passiveEvents.indexOf(type) > -1) {
            options = {
              passive: true
            };
          }
  
          elemt.addEventListener(type, data.dispatcher, options);
        } else if (elemt.attachEvent) {
          elemt.attachEvent('on' + type, data.dispatcher);
        }
      }
    }
    /**
     * Removes event listeners from an element
     *
     * @param {Element|Object} elemt
     *        Object to remove listeners from.
     *
     * @param {string|string[]} [type]
     *        Type of listener to remove. Don't include to remove all events from element.
     *
     * @param {EventTarget~EventListener} [fn]
     *        Specific listener to remove. Don't include to remove listeners for an event
     *        type.
     */
  
    function off(elemt, type, fn) {
      // Don't want to add a cache object through getElData if not needed
      if (!DomData.has(elemt)) {
        return;
      }
  
      var data = DomData.get(elemt); // If no events exist, nothing to unbind
  
      if (!data.handlers) {
        return;
      }
  
      if (Array.isArray(type)) {
        return _handleMultipleEvents(off, elemt, type, fn);
      } // Utility function
  
  
      var removeType = function removeType(el, t) {
        data.handlers[t] = [];
  
        _cleanUpEvents(el, t);
      }; // Are we removing all bound events?
  
  
      if (type === undefined) {
        for (var t in data.handlers) {
          if (Object.prototype.hasOwnProperty.call(data.handlers || {}, t)) {
            removeType(elemt, t);
          }
        }
  
        return;
      }
  
      var handlers = data.handlers[type]; // If no handlers exist, nothing to unbind
  
      if (!handlers) {
        return;
      } // If no listener was provided, remove all listeners for type
  
  
      if (!fn) {
        removeType(elemt, type);
        return;
      } // We're only removing a single handler
  
  
      if (fn.guid) {
        for (var n = 0; n < handlers.length; n++) {
          if (handlers[n].guid === fn.guid) {
            handlers.splice(n--, 1);
          }
        }
      }
  
      _cleanUpEvents(elemt, type);
    }
    /**
     * Trigger an event for an element
     *
     * @param {Element|Object} elemt
     *        Element to trigger an event on
     *
     * @param {EventTarget~Event|string} event
     *        A string (the type) or an event object with a type attribute
     *
     * @param {Object} [hash]
     *        data hash to pass along with the event
     *
     * @return {boolean|undefined}
     *         Returns the opposite of `defaultPrevented` if default was
     *         prevented. Otherwise, returns `undefined`
     */
  
    function trigger(elemt, event, hash) {
      // Fetches element data and a reference to the parent (for bubbling).
      // Don't want to add a data object to cache for every parent,
      // so checking hasElData first.
      var elemData = DomData.has(elemt) ? DomData.get(elemt) : {};
      var parent = elemt.parentNode || elemt.ownerDocument; // type = event.type || event,
      // handler;
      // If an event name was passed as a string, creates an event out of it
  
      if (typeof event === 'string') {
        event = {
          type: event,
          target: elemt
        };
      } else if (!event.target) {
        event.target = elemt;
      } // Normalizes the event properties.
  
  
      event = fixEvent(event); // If the passed element has a dispatcher, executes the established handlers.
  
      if (elemData.dispatcher) {
        elemData.dispatcher.call(elemt, event, hash);
      } // Unless explicitly stopped or the event does not bubble (g. media events)
      // recursively calls this function to bubble the event up the DOM.
  
  
      if (parent && !event.isPropagationStopped() && event.bubbles === true) {
        trigger.call(null, parent, event, hash); // If at the top of the DOM, triggers the default action unless disabled.
      } else if (!parent && !event.defaultPrevented && event.target && event.target[event.type]) {
        if (!DomData.has(event.target)) {
          DomData.set(event.target, {});
        }
  
        var targetData = DomData.get(event.target); // Checks if the target has a default action for this event.
  
        if (event.target[event.type]) {
          // Temporarily disables event dispatching on the target as we have already executed the handler.
          targetData.disabled = true; // Executes the default action.
  
          if (typeof event.target[event.type] === 'function') {
            event.target[event.type]();
          } // Re-enables event dispatching.
  
  
          targetData.disabled = false;
        }
      } // Inform the triggerer if the default was prevented by returning false
  
  
      return !event.defaultPrevented;
    }
    /**
     * Trigger a listener only once for an event.
     *
     * @param {Element|Object} elemt
     *        Element or object to bind to.
     *
     * @param {string|string[]} type
     *        Name/type of event
     *
     * @param {Event~EventListener} fn
     *        Event listener function
     */
  
    function one(elemt, type, fn) {
      if (Array.isArray(type)) {
        return _handleMultipleEvents(one, elemt, type, fn);
      }
  
      var func = function func() {
        off(elemt, type, func);
        fn.apply(this, arguments);
      }; // copy the guid to the new function so it can removed using the original function's ID
  
  
      func.guid = fn.guid = fn.guid || newGUID();
      on(elemt, type, func);
    }
    /**
     * Trigger a listener only once and then turn if off for all
     * configured events
     *
     * @param {Element|Object} elemt
     *        Element or object to bind to.
     *
     * @param {string|string[]} type
     *        Name/type of event
     *
     * @param {Event~EventListener} fn
     *        Event listener function
     */
  
    function any(elemt, type, fn) {
      var func = function func() {
        off(elemt, type, func);
        fn.apply(this, arguments);
      }; // copy the guid to the new function so it can removed using the original function's ID
  
  
      func.guid = fn.guid = fn.guid || newGUID(); // multiple ons, but one off for everything
  
      on(elemt, type, func);
    }
  
    var Events = /*#__PURE__*/Object.freeze({
      __proto__: null,
      fixEvent: fixEvent,
      on: on,
      off: off,
      trigger: trigger,
      one: one,
      any: any
    });
  
    /**
     * @file fn.js
     * @module fn
     */
    var UPDATE_REFRESH_INTERVAL = 30;
    /**
     * Bind (a.k.a proxy or context). A simple method for changing the context of
     * a function.
     *
     * It also stores a unique id on the function so it can be easily removed from
     * events.
     *
     * @function
     * @param    {Mixed} context
     *           The object to bind as scope.
     *
     * @param    {Function} fn
     *           The function to be bound to a scope.
     *
     * @param    {number} [uid]
     *           An optional unique ID for the function to be set
     *
     * @return   {Function}
     *           The new function that will be bound into the context given
     */
  
    var bind = function bind(context, fn, uid) {
      // Make sure the function has a unique ID
      if (!fn.guid) {
        fn.guid = newGUID();
      } // Create the new function that changes the context
  
  
      var bound = fn.bind(context); // Allow for the ability to individualize this function
      // Needed in the case where multiple objects might share the same prototype
      // IF both items add an event listener with the same function, then you try to remove just one
      // it will remove both because they both have the same guid.
      // when using this, you need to use the bind method when you remove the listener as well.
      // currently used in text tracks
  
      bound.guid = uid ? uid + '_' + fn.guid : fn.guid;
      return bound;
    };
    /**
     * Wraps the given function, `fn`, with a new function that only invokes `fn`
     * at most once per every `wait` milliseconds.
     *
     * @function
     * @param    {Function} fn
     *           The function to be throttled.
     *
     * @param    {number}   wait
     *           The number of milliseconds by which to throttle.
     *
     * @return   {Function}
     */
  
    var throttle = function throttle(fn, wait) {
      var last = window$1.performance.now();
  
      var throttled = function throttled() {
        var now = window$1.performance.now();
  
        if (now - last >= wait) {
          fn.apply(void 0, arguments);
          last = now;
        }
      };
  
      return throttled;
    };
    /**
     * Creates a debounced function that delays invoking `func` until after `wait`
     * milliseconds have elapsed since the last time the debounced function was
     * invoked.
     *
     * Inspired by lodash and underscore implementations.
     *
     * @function
     * @param    {Function} func
     *           The function to wrap with debounce behavior.
     *
     * @param    {number} wait
     *           The number of milliseconds to wait after the last invocation.
     *
     * @param    {boolean} [immediate]
     *           Whether or not to invoke the function immediately upon creation.
     *
     * @return   {Function}
     *           A debounced function.
     */
  
    var debounce = function debounce(func, wait, immediate, context) {
      if (context === void 0) {
        context = window$1;
      }
  
      var timeout;
  
      var cancel = function cancel() {
        context.clearTimeout(timeout);
        timeout = null;
      };
      /* eslint-disable consistent-this */
  
  
      var debounced = function debounced() {
        var self = this;
        var args = arguments;
  
        var _later = function later() {
          timeout = null;
          _later = null;
  
          if (!immediate) {
            func.apply(self, args);
          }
        };
  
        if (!timeout && immediate) {
          func.apply(self, args);
        }
  
        context.clearTimeout(timeout);
        timeout = context.setTimeout(_later, wait);
      };
      /* eslint-enable consistent-this */
  
  
      debounced.cancel = cancel;
      return debounced;
    };
  
    /**
     * @file src/js/event-target.js
     */
    /**
     * `EventTarget` is a class that can have the same API as the DOM `EventTarget`. It
     * adds shorthand functions that wrap around lengthy functions. For example:
     * the `on` function is a wrapper around `addEventListener`.
     *
     * @see [EventTarget Spec]{@link https://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-EventTarget}
     * @class EventTarget
     */
  
    var EventTarget = function EventTarget() { };
    /**
     * A Custom DOM event.
     *
     * @typedef {Object} EventTarget~Event
     * @see [Properties]{@link https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent}
     */
  
    /**
     * All event listeners should follow the following format.
     *
     * @callback EventTarget~EventListener
     * @this {EventTarget}
     *
     * @param {EventTarget~Event} event
     *        the event that triggered this function
     *
     * @param {Object} [hash]
     *        hash of data sent during the event
     */
  
    /**
     * An object containing event names as keys and booleans as values.
     *
     * > NOTE: If an event name is set to a true value here {@link EventTarget#trigger}
     *         will have extra functionality. See that function for more information.
     *
     * @property EventTarget.prototype.allowedEvents_
     * @private
     */
  
  
    EventTarget.prototype.allowedEvents_ = {};
    /**
     * Adds an `event listener` to an instance of an `EventTarget`. An `event listener` is a
     * function that will get called when an event with a certain name gets triggered.
     *
     * @param {string|string[]} type
     *        An event name or an array of event names.
     *
     * @param {EventTarget~EventListener} fn
     *        The function to call with `EventTarget`s
     */
  
    EventTarget.prototype.on = function (type, fn) {
      // Remove the addEventListener alias before calling Events.on
      // so we don't get into an infinite type loop
      var ael = this.addEventListener;
  
      this.addEventListener = function () { };
  
      on(this, type, fn);
      this.addEventListener = ael;
    };
    /**
     * An alias of {@link EventTarget#on}. Allows `EventTarget` to mimic
     * the standard DOM API.
     *
     * @function
     * @see {@link EventTarget#on}
     */
  
  
    EventTarget.prototype.addEventListener = EventTarget.prototype.on;
    /**
     * Removes an `event listener` for a specific event from an instance of `EventTarget`.
     * This makes it so that the `event listener` will no longer get called when the
     * named event happens.
     *
     * @param {string|string[]} type
     *        An event name or an array of event names.
     *
     * @param {EventTarget~EventListener} fn
     *        The function to remove.
     */
  
    EventTarget.prototype.off = function (type, fn) {
      off(this, type, fn);
    };
    /**
     * An alias of {@link EventTarget#off}. Allows `EventTarget` to mimic
     * the standard DOM API.
     *
     * @function
     * @see {@link EventTarget#off}
     */
  
  
    EventTarget.prototype.removeEventListener = EventTarget.prototype.off;
    /**
     * This function will add an `event listener` that gets triggered only once. After the
     * first trigger it will get removed. This is like adding an `event listener`
     * with {@link EventTarget#on} that calls {@link EventTarget#off} on itself.
     *
     * @param {string|string[]} type
     *        An event name or an array of event names.
     *
     * @param {EventTarget~EventListener} fn
     *        The function to be called once for each event name.
     */
  
    EventTarget.prototype.one = function (type, fn) {
      // Remove the addEventListener aliasing Events.on
      // so we don't get into an infinite type loop
      var ael = this.addEventListener;
  
      this.addEventListener = function () { };
  
      one(this, type, fn);
      this.addEventListener = ael;
    };
  
    EventTarget.prototype.any = function (type, fn) {
      // Remove the addEventListener aliasing Events.on
      // so we don't get into an infinite type loop
      var ael = this.addEventListener;
  
      this.addEventListener = function () { };
  
      any(this, type, fn);
      this.addEventListener = ael;
    };
    /**
     * This function causes an event to happen. This will then cause any `event listeners`
     * that are waiting for that event, to get called. If there are no `event listeners`
     * for an event then nothing will happen.
     *
     * If the name of the `Event` that is being triggered is in `EventTarget.allowedEvents_`.
     * Trigger will also call the `on` + `uppercaseEventName` function.
     *
     * Example:
     * 'click' is in `EventTarget.allowedEvents_`, so, trigger will attempt to call
     * `onClick` if it exists.
     *
     * @param {string|EventTarget~Event|Object} event
     *        The name of the event, an `Event`, or an object with a key of type set to
     *        an event name.
     */
  
  
    EventTarget.prototype.trigger = function (event) {
      var type = event.type || event; // deprecation
      // In a future version we should default target to `this`
      // similar to how we default the target to `elemt` in
      // `Events.trigger`. Right now the default `target` will be
      // `document` due to the `Event.fixEvent` call.
  
      if (typeof event === 'string') {
        event = {
          type: type
        };
      }
  
      event = fixEvent(event);
  
      if (this.allowedEvents_[type] && this['on' + type]) {
        this['on' + type](event);
      }
  
      trigger(this, event);
    };
    /**
     * An alias of {@link EventTarget#trigger}. Allows `EventTarget` to mimic
     * the standard DOM API.
     *
     * @function
     * @see {@link EventTarget#trigger}
     */
  
  
    EventTarget.prototype.dispatchEvent = EventTarget.prototype.trigger;
    var EVENT_MAP;
  
    EventTarget.prototype.queueTrigger = function (event) {
      var _this = this;
  
      // only set up EVENT_MAP if it'll be used
      if (!EVENT_MAP) {
        EVENT_MAP = new Map();
      }
  
      var type = event.type || event;
      var map = EVENT_MAP.get(this);
  
      if (!map) {
        map = new Map();
        EVENT_MAP.set(this, map);
      }
  
      var oldTimeout = map.get(type);
      map['delete'](type);
      window$1.clearTimeout(oldTimeout);
      var timeout = window$1.setTimeout(function () {
        // if we cleared out all timeouts for the current target, delete its map
        if (map.size === 0) {
          map = null;
          EVENT_MAP['delete'](_this);
        }
  
        _this.trigger(event);
      }, 0);
      map.set(type, timeout);
    };
  
    /**
     * @file mixins/evented.js
     * @module evented
     */
    /**
     * Returns whether or not an object has had the evented mixin applied.
     *
     * @param  {Object} object
     *         An object to test.
     *
     * @return {boolean}
     *         Whether or not the object appears to be evented.
     */
  
    var isEvented = function isEvented(object) {
      return object instanceof EventTarget || !!object.eventBusEl_ && ['on', 'one', 'off', 'trigger'].every(function (k) {
        return typeof object[k] === 'function';
      });
    };
    /**
     * Adds a callback to run after the evented mixin applied.
     *
     * @param  {Object} object
     *         An object to Add
     * @param  {Function} callback
     *         The callback to run.
     */
  
  
    var addEventedCallback = function addEventedCallback(target, callback) {
      if (isEvented(target)) {
        callback();
      } else {
        if (!target.eventedCallbacks) {
          target.eventedCallbacks = [];
        }
  
        target.eventedCallbacks.push(callback);
      }
    };
    /**
     * Whether a value is a valid event type - non-empty string or array.
     *
     * @private
     * @param  {string|Array} type
     *         The type value to test.
     *
     * @return {boolean}
     *         Whether or not the type is a valid event type.
     */
  
  
    var isValidEventType = function isValidEventType(type) {
      return (// The regex here verifies that the `type` contains at least one non-
        // whitespace character.
        typeof type === 'string' && /\S/.test(type) || Array.isArray(type) && !!type.length
      );
    };
    /**
     * Validates a value to determine if it is a valid event target. Throws if not.
     *
     * @private
     * @throws {Error}
     *         If the target does not appear to be a valid event target.
     *
     * @param  {Object} target
     *         The object to test.
     */
  
  
    var validateTarget = function validateTarget(target) {
      if (!target.nodeName && !isEvented(target)) {
        throw new Error('Invalid target; must be a DOM node or evented object.');
      }
    };
    /**
     * Validates a value to determine if it is a valid event target. Throws if not.
     *
     * @private
     * @throws {Error}
     *         If the type does not appear to be a valid event type.
     *
     * @param  {string|Array} type
     *         The type to test.
     */
  
  
    var validateEventType = function validateEventType(type) {
      if (!isValidEventType(type)) {
        throw new Error('Invalid event type; must be a non-empty string or array.');
      }
    };
    /**
     * Validates a value to determine if it is a valid listener. Throws if not.
     *
     * @private
     * @throws {Error}
     *         If the listener is not a function.
     *
     * @param  {Function} listener
     *         The listener to test.
     */
  
  
    var validateListener = function validateListener(listener) {
      if (typeof listener !== 'function') {
        throw new Error('Invalid listener; must be a function.');
      }
    };
    /**
     * Takes an array of arguments given to `on()` or `one()`, validates them, and
     * normalizes them into an object.
     *
     * @private
     * @param  {Object} self
     *         The evented object on which `on()` or `one()` was called. This
     *         object will be bound as the `this` value for the listener.
     *
     * @param  {Array} args
     *         An array of arguments passed to `on()` or `one()`.
     *
     * @return {Object}
     *         An object containing useful values for `on()` or `one()` calls.
     */
  
  
    var normalizeListenArgs = function normalizeListenArgs(self, args) {
      // If the number of arguments is less than 3, the target is always the
      // evented object itself.
      var isTargetingSelf = args.length < 3 || args[0] === self || args[0] === self.eventBusEl_;
      var target;
      var type;
      var listener;
  
      if (isTargetingSelf) {
        target = self.eventBusEl_; // Deal with cases where we got 3 arguments, but we are still listening to
        // the evented object itself.
  
        if (args.length >= 3) {
          args.shift();
        }
  
        type = args[0];
        listener = args[1];
      } else {
        target = args[0];
        type = args[1];
        listener = args[2];
      }
  
      validateTarget(target);
      validateEventType(type);
      validateListener(listener);
      listener = bind(self, listener);
      return {
        isTargetingSelf: isTargetingSelf,
        target: target,
        type: type,
        listener: listener
      };
    };
    /**
     * Adds the listener to the event type(s) on the target, normalizing for
     * the type of target.
     *
     * @private
     * @param  {Element|Object} target
     *         A DOM node or evented object.
     *
     * @param  {string} method
     *         The event binding method to use ('on' or 'one').
     *
     * @param  {string|Array} type
     *         One or more event type(s).
     *
     * @param  {Function} listener
     *         A listener function.
     */
  
  
    var listen = function listen(target, method, type, listener) {
      validateTarget(target);
  
      if (target.nodeName) {
        Events[method](target, type, listener);
      } else {
        target[method](type, listener);
      }
    };
    /**
     * Contains methods that provide event capabilities to an object which is passed
     * to {@link module:evented|evented}.
     *
     * @mixin EventedMixin
     */
  
  
    var EventedMixin = {
      /**
       * Add a listener to an event (or events) on this object or another evented
       * object.
       *
       * @param  {string|Array|Element|Object} targetOrType
       *         If this is a string or array, it represents the event type(s)
       *         that will trigger the listener.
       *
       *         Another evented object can be passed here instead, which will
       *         cause the listener to listen for events on _that_ object.
       *
       *         In either case, the listener's `this` value will be bound to
       *         this object.
       *
       * @param  {string|Array|Function} typeOrListener
       *         If the first argument was a string or array, this should be the
       *         listener function. Otherwise, this is a string or array of event
       *         type(s).
       *
       * @param  {Function} [listener]
       *         If the first argument was another evented object, this will be
       *         the listener function.
       */
      on: function on() {
        var _this = this;
  
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }
  
        var _normalizeListenArgs = normalizeListenArgs(this, args),
          isTargetingSelf = _normalizeListenArgs.isTargetingSelf,
          target = _normalizeListenArgs.target,
          type = _normalizeListenArgs.type,
          listener = _normalizeListenArgs.listener;
  
        listen(target, 'on', type, listener); // If this object is listening to another evented object.
  
        if (!isTargetingSelf) {
          // If this object is disposed, remove the listener.
          var removeListenerOnDispose = function removeListenerOnDispose() {
            return _this.off(target, type, listener);
          }; // Use the same function ID as the listener so we can remove it later it
          // using the ID of the original listener.
  
  
          removeListenerOnDispose.guid = listener.guid; // Add a listener to the target's dispose event as well. This ensures
          // that if the target is disposed BEFORE this object, we remove the
          // removal listener that was just added. Otherwise, we create a memory leak.
  
          var removeRemoverOnTargetDispose = function removeRemoverOnTargetDispose() {
            return _this.off('dispose', removeListenerOnDispose);
          }; // Use the same function ID as the listener so we can remove it later
          // it using the ID of the original listener.
  
  
          removeRemoverOnTargetDispose.guid = listener.guid;
          listen(this, 'on', 'dispose', removeListenerOnDispose);
          listen(target, 'on', 'dispose', removeRemoverOnTargetDispose);
        }
      },
  
      /**
       * Add a listener to an event (or events) on this object or another evented
       * object. The listener will be called once per event and then removed.
       *
       * @param  {string|Array|Element|Object} targetOrType
       *         If this is a string or array, it represents the event type(s)
       *         that will trigger the listener.
       *
       *         Another evented object can be passed here instead, which will
       *         cause the listener to listen for events on _that_ object.
       *
       *         In either case, the listener's `this` value will be bound to
       *         this object.
       *
       * @param  {string|Array|Function} typeOrListener
       *         If the first argument was a string or array, this should be the
       *         listener function. Otherwise, this is a string or array of event
       *         type(s).
       *
       * @param  {Function} [listener]
       *         If the first argument was another evented object, this will be
       *         the listener function.
       */
      one: function one() {
        var _this2 = this;
  
        for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }
  
        var _normalizeListenArgs2 = normalizeListenArgs(this, args),
          isTargetingSelf = _normalizeListenArgs2.isTargetingSelf,
          target = _normalizeListenArgs2.target,
          type = _normalizeListenArgs2.type,
          listener = _normalizeListenArgs2.listener; // Targeting this evented object.
  
  
        if (isTargetingSelf) {
          listen(target, 'one', type, listener); // Targeting another evented object.
        } else {
          var wrapper = function wrapper() {
            _this2.off(target, type, wrapper);
  
            for (var _len3 = arguments.length, largs = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
              largs[_key3] = arguments[_key3];
            }
  
            listener.apply(null, largs);
          }; // Use the same function ID as the listener so we can remove it later
          // it using the ID of the original listener.
  
  
          wrapper.guid = listener.guid;
          listen(target, 'one', type, wrapper);
        }
      },
  
      /**
       * Add a listener to an event (or events) on this object or another evented
       * object. The listener will only be called once for the first event that is triggered
       * then removed.
       *
       * @param  {string|Array|Element|Object} targetOrType
       *         If this is a string or array, it represents the event type(s)
       *         that will trigger the listener.
       *
       *         Another evented object can be passed here instead, which will
       *         cause the listener to listen for events on _that_ object.
       *
       *         In either case, the listener's `this` value will be bound to
       *         this object.
       *
       * @param  {string|Array|Function} typeOrListener
       *         If the first argument was a string or array, this should be the
       *         listener function. Otherwise, this is a string or array of event
       *         type(s).
       *
       * @param  {Function} [listener]
       *         If the first argument was another evented object, this will be
       *         the listener function.
       */
      any: function any() {
        var _this3 = this;
  
        for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
          args[_key4] = arguments[_key4];
        }
  
        var _normalizeListenArgs3 = normalizeListenArgs(this, args),
          isTargetingSelf = _normalizeListenArgs3.isTargetingSelf,
          target = _normalizeListenArgs3.target,
          type = _normalizeListenArgs3.type,
          listener = _normalizeListenArgs3.listener; // Targeting this evented object.
  
  
        if (isTargetingSelf) {
          listen(target, 'any', type, listener); // Targeting another evented object.
        } else {
          var wrapper = function wrapper() {
            _this3.off(target, type, wrapper);
  
            for (var _len5 = arguments.length, largs = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
              largs[_key5] = arguments[_key5];
            }
  
            listener.apply(null, largs);
          }; // Use the same function ID as the listener so we can remove it later
          // it using the ID of the original listener.
  
  
          wrapper.guid = listener.guid;
          listen(target, 'any', type, wrapper);
        }
      },
  
      /**
       * Removes listener(s) from event(s) on an evented object.
       *
       * @param  {string|Array|Element|Object} [targetOrType]
       *         If this is a string or array, it represents the event type(s).
       *
       *         Another evented object can be passed here instead, in which case
       *         ALL 3 arguments are _required_.
       *
       * @param  {string|Array|Function} [typeOrListener]
       *         If the first argument was a string or array, this may be the
       *         listener function. Otherwise, this is a string or array of event
       *         type(s).
       *
       * @param  {Function} [listener]
       *         If the first argument was another evented object, this will be
       *         the listener function; otherwise, _all_ listeners bound to the
       *         event type(s) will be removed.
       */
      off: function off$1(targetOrType, typeOrListener, listener) {
        // Targeting this evented object.
        if (!targetOrType || isValidEventType(targetOrType)) {
          off(this.eventBusEl_, targetOrType, typeOrListener); // Targeting another evented object.
        } else {
          var target = targetOrType;
          var type = typeOrListener; // Fail fast and in a meaningful way!
  
          validateTarget(target);
          validateEventType(type);
          validateListener(listener); // Ensure there's at least a guid, even if the function hasn't been used
  
          listener = bind(this, listener); // Remove the dispose listener on this evented object, which was given
          // the same guid as the event listener in on().
  
          this.off('dispose', listener);
  
          if (target.nodeName) {
            off(target, type, listener);
            off(target, 'dispose', listener);
          } else if (isEvented(target)) {
            target.off(type, listener);
            target.off('dispose', listener);
          }
        }
      },
  
      /**
       * Fire an event on this evented object, causing its listeners to be called.
       *
       * @param   {string|Object} event
       *          An event type or an object with a type property.
       *
       * @param   {Object} [hash]
       *          An additional object to pass along to listeners.
       *
       * @return {boolean}
       *          Whether or not the default behavior was prevented.
       */
      trigger: function trigger$1(event, hash) {
        return trigger(this.eventBusEl_, event, hash);
      }
    };
    /**
     * Applies {@link module:evented~EventedMixin|EventedMixin} to a target object.
     *
     * @param  {Object} target
     *         The object to which to add event methods.
     *
     * @param  {Object} [options={}]
     *         Options for customizing the mixin behavior.
     *
     * @param  {string} [options.eventBusKey]
     *         By default, adds a `eventBusEl_` DOM element to the target object,
     *         which is used as an event bus. If the target object already has a
     *         DOM element that should be used, pass its key here.
     *
     * @return {Object}
     *         The target object.
     */
  
    function evented(target, options) {
      if (options === void 0) {
        options = {};
      }
  
      var _options = options,
        eventBusKey = _options.eventBusKey; // Set or create the eventBusEl_.
  
      if (eventBusKey) {
        if (!target[eventBusKey].nodeName) {
          throw new Error('The eventBusKey \'' + eventBusKey + '\' does not refer to an element.');
        }
  
        target.eventBusEl_ = target[eventBusKey];
      } else {
        target.eventBusEl_ = createEl('span', {
          className: 'vjs-event-bus'
        });
      }
  
      assign(target, EventedMixin);
  
      if (target.eventedCallbacks) {
        target.eventedCallbacks.forEach(function (callback) {
          callback();
        });
      } // When any evented object is disposed, it removes all its listeners.
  
  
      target.on('dispose', function () {
        target.off();
        window$1.setTimeout(function () {
          target.eventBusEl_ = null;
        }, 0);
      });
      return target;
    }
  
    /**
     * @file mixins/stateful.js
     * @module stateful
     */
    /**
     * Contains methods that provide statefulness to an object which is passed
     * to {@link module:stateful}.
     *
     * @mixin StatefulMixin
     */
  
    var StatefulMixin = {
      /**
       * A hash containing arbitrary keys and values representing the state of
       * the object.
       *
       * @type {Object}
       */
      state: {},
  
      /**
       * Set the state of an object by mutating its
       * {@link module:stateful~StatefulMixin.state|state} object in place.
       *
       * @fires   module:stateful~StatefulMixin#statechanged
       * @param   {Object|Function} stateUpdates
       *          A new set of properties to shallow-merge into the plugin state.
       *          Can be a plain object or a function returning a plain object.
       *
       * @return {Object|undefined}
       *          An object containing changes that occurred. If no changes
       *          occurred, returns `undefined`.
       */
      setState: function setState(stateUpdates) {
        var _this = this;
  
        // Support providing the `stateUpdates` state as a function.
        if (typeof stateUpdates === 'function') {
          stateUpdates = stateUpdates();
        }
  
        var changes;
        each(stateUpdates, function (value, key) {
          // Record the change if the value is different from what's in the
          // current state.
          if (_this.state[key] !== value) {
            changes = changes || {};
            changes[key] = {
              from: _this.state[key],
              to: value
            };
          }
  
          _this.state[key] = value;
        }); // Only trigger 'statechange' if there were changes AND we have a trigger
        // function. This allows us to not require that the target object be an
        // evented object.
  
        if (changes && isEvented(this)) {
          /**
           * An event triggered on an object that is both
           * {@link module:stateful|stateful} and {@link module:evented|evented}
           * indicating that its state has changed.
           *
           * @event    module:stateful~StatefulMixin#statechanged
           * @type     {Object}
           * @property {Object} changes
           *           A hash containing the properties that were changed and
           *           the values they were changed `from` and `to`.
           */
          this.trigger({
            changes: changes,
            type: 'statechanged'
          });
        }
  
        return changes;
      }
    };
  
    var copyObj = function (obj, target, overwrite) {
      if (!target) { target = {}; }
      for (var prop in obj) {
        if (obj.hasOwnProperty(prop) && (overwrite !== false || !target.hasOwnProperty(prop))) { target[prop] = obj[prop]; }
      }
      return target;
    }
  
    function createObj(base, props) {
      var inst;
      if (Object.create) {
        inst = Object.create(base);
      } else {
        nothing.prototype = base;
        inst = new nothing();
      }
      if (props) { copyObj(props, inst); }
      return inst
    }
  
    var splitLinesAuto = "\n\nb".split(/\n/).length != 3 ? function (string) {
      var pos = 0, result = [], l = string.length;
      while (pos <= l) {
        var nl = string.indexOf("\n", pos);
        if (nl == -1) { nl = string.length; }
        var line = string.slice(pos, string.charAt(nl - 1) == "\r" ? nl - 1 : nl);
        var rt = line.indexOf("\r");
        if (rt != -1) {
          result.push(line.slice(0, rt));
          pos += rt + 1;
        } else {
          result.push(line);
          pos = nl + 1;
        }
      }
      return result
    } : function (string) { return string.split(/\r\n?|\n/); };
  
    function measure(display) {
      var lineMeasure = display.lineMeasure;
      var measure = display.measure;
    }
    var noHandlers = [];
    function getHandlers(emitter, type) {
      return emitter._handlers && emitter._handlers[type] || noHandlers
    }
  
    function e_defaultPrevented(e) {
      return e.defaultPrevented != null ? e.defaultPrevented : e.returnValue == false
    }
  
    function e_preventDefault(e) {
      if (e.preventDefault) { e.preventDefault(); }
      else { e.returnValue = false; }
    }
  
    function e_target(e) {return e.target || e.srcElement}
  
    function hasHandler(emitter, type) {
      return getHandlers(emitter, type).length > 0
    }
  
    function signal(emitter, type /*, values...*/) {
      var handlers = getHandlers(emitter, type);
      if (!handlers.length) { return }
      var args = Array.prototype.slice.call(arguments, 2);
      for (var i = 0; i < handlers.length; ++i) { handlers[i].apply(null, args); }
    }
  
    function signalDOMEvent(syn, e, override) {
      if (typeof e == "string") { e = { type: e, preventDefault: function () { this.defaultPrevented = true; } }; }
      signal(syn, override || e.type, syn, e);
      return e_defaultPrevented(e) || e.highlighterIgnore
    }
  
    function updateGutterSpace(display) {
      var width = display.gutters.offsetWidth;
      display.sizer.style.marginLeft = width + 'px';
    }
  
    function renderGutters(display) {
      var gutters = display.gutters, specs = display.gutterSpecs;
      clearElemt(gutters);
      display.lineGutter = null;
      for (var i = 0; i < specs.length; ++i) {
        var ref = specs[i];
        var className = ref.className;
        var style = ref.style;
        var gElt = gutters.appendChild(elemt('div', null, 'e-example-gutter ' + className));
        if (style) { gElt.style.cssText = style; }
        if (className == 'e-example-linenumbers') {
          display.lineGutter = gElt;
          gElt.style.width = (display.lineNumWidth || 1) + 'px';
        }
      }
      gutters.style.display = specs.length ? '' : 'none';
      updateGutterSpace(display);
    }
  
    function updateSelection(syn) {
      syn.display.input.showSelection(syn.display.input.prepareSelection());
    }
  
    function pageScrollX() {
      // Work around https://bugs.chromium.org/p/chromium/issues/detail?id=489206
      // which causes page_Offset and bounding client rects to use
      // different reference viewports and invalidate our calculations.
      if (chrome && android) { return -(document.body.getBoundingClientRect().left - parseInt(getComputedStyle(document.body).marginLeft)) }
      return window.pageXOffset || (document.documentElement || document.body).scrollLeft
    }
    function pageScrollY() {
      if (chrome && android) { return -(document.body.getBoundingClientRect().top - parseInt(getComputedStyle(document.body).marginTop)) }
      return window.pageYOffset || (document.documentElement || document.body).scrollTop
    }
  
    function fromCoordSystem(syn, coords, context) {
      if (context == "div") { return coords }
      var left = coords.left, top = coords.top;
      // First move into "page" coordinate system
      if (context == "page") {
        left -= pageScrollX();
        top -= pageScrollY();
      } else if (context == "local" || !context) {
        var localBox = syn.display.sizer.getBoundingClientRect();
        left += localBox.left;
        top += localBox.top;
      }
  
      var lineSpaceBox = syn.display.lineSpace.getBoundingClientRect();
      return {left: left - lineSpaceBox.left, top: top - lineSpaceBox.top}
    }
  
    function charCoords(syn, pos, context, lineObj, bias) {
      if (!lineObj) { lineObj = getLine(syn.doc, pos.line); }
      return intoCoordSystem(syn, lineObj, measureChar(syn, lineObj, pos.ch, bias), context)
    }
  
    var wheelSamples = 0, wheelPixelsPerUnit = null;
    // Fill in a browser-detected starting value on browsers where we
    // know one. These don't have to be accurate -- the result of them
    // being wrong would just be a slight flicker on the first wheel
    // scroll (if it is large enough).
    if (ie) { wheelPixelsPerUnit = -.53; }
    else if (gecko) { wheelPixelsPerUnit = 15; }
    else if (chrome) { wheelPixelsPerUnit = -.7; }
    else if (safari) { wheelPixelsPerUnit = -1 / 3; }
  
    function wheelEventDelta(e) {
      var dx = e.wheelDeltaX, dy = e.wheelDeltaY;
      if (dx == null && e.detail && e.axis == e.HORIZONTAL_AXIS) { dx = e.detail; }
      if (dy == null && e.detail && e.axis == e.VERTICAL_AXIS) { dy = e.detail; }
      else if (dy == null) { dy = e.wheelDelta; }
      return { x: dx, y: dy }
    }
  
    function wheelEventPixels(e) {
      var delta = wheelEventDelta(e);
      delta.x *= wheelPixelsPerUnit;
      delta.y *= wheelPixelsPerUnit;
      return delta
    }
  
    function onScrollWheel(syn, e) {
      var delta = wheelEventDelta(e), dx = delta.x, dy = delta.y;
  
      var display = syn.display, scroll = display.scroller;
      // Quit if there's nothing to scroll here
      var canScrollX = scroll.scrollWidth > scroll.clientWidth;
      var canScrollY = scroll.scrollHeight > scroll.clientHeight;
      if (!(dx && canScrollX || dy && canScrollY)) { return }
  
      // Webkit browsers on OS X abort momentum scrolls when the target
      // of the scroll event is removed from the scrollable element.
      // This hack (see related code in patchDisplay) makes sure the
      // element is kept around.
      if (dy && mac && webkit) {
        outer: for (var cur = e.target, view = display.view; cur != scroll; cur = cur.parentNode) {
          for (var i = 0; i < view.length; i++) {
            if (view[i].node == cur) {
              syn.display.currentWheelTarget = cur;
              break outer
            }
          }
        }
      }
  
      // On some browsers, horizontal scrolling will cause redraws to
      // happen before the gutter has been realigned, causing it to
      // wriggle around in a most unseemly way. When we have an
      // estimated pixels/delta value, we just handle horizontal
      // scrolling entirely here. It'll be slightly off from native, but
      // better than glitching out.
      if (dx && !gecko && !presto && wheelPixelsPerUnit != null) {
        if (dy && canScrollY) { updateScrollTop(syn, Math.max(0, scroll.scrollTop + dy * wheelPixelsPerUnit)); }
        setScrollLeft(syn, Math.max(0, scroll.scrollLeft + dx * wheelPixelsPerUnit));
        // Only prevent default scrolling if vertical scrolling is
        // actually possible. Otherwise, it causes vertical scroll
        // jitter on OSX trackpads when deltaX is small and deltaY
        // is large (issue #3579)
        if (!dy || (dy && canScrollY)) { e_preventDefault(e); }
        display.wheelStartX = null; // Abort measurement, if in progress
        return
      }
  
      // 'Project' the visible viewport to cover the area that is being
      // scrolled into view (if we know enough to estimate it).
      if (dy && wheelPixelsPerUnit != null) {
        var pixels = dy * wheelPixelsPerUnit;
        var top = syn.doc.scrollTop, bot = top + display.wrapper.clientHeight;
        if (pixels < 0) { top = Math.max(0, top + pixels - 50); }
        else { bot = Math.min(syn.doc.height, bot + pixels + 50); }
        updateDisplaySimple(syn, { top: top, bottom: bot });
      }
  
      if (wheelSamples < 20) {
        if (display.wheelStartX == null) {
          display.wheelStartX = scroll.scrollLeft; display.wheelStartY = scroll.scrollTop;
          display.wheelDX = dx; display.wheelDY = dy;
          setTimeout(function () {
            if (display.wheelStartX == null) { return }
            var movedX = scroll.scrollLeft - display.wheelStartX;
            var movedY = scroll.scrollTop - display.wheelStartY;
            var sample = (movedY && display.wheelDY && movedY / display.wheelDY) ||
              (movedX && display.wheelDX && movedX / display.wheelDX);
            display.wheelStartX = display.wheelStartY = null;
            if (!sample) { return }
            wheelPixelsPerUnit = (wheelPixelsPerUnit * wheelSamples + sample) / (wheelSamples + 1);
            ++wheelSamples;
          }, 200);
        } else {
          display.wheelDX += dx; display.wheelDY += dy;
        }
      }
    }
  
    function highlighterColorizer(d, doc, options) {
      var colorCode;
      doc = doc.replaceAll('<', '&lt;').replaceAll('>', '&gt;');
      colorCode = highlighterHelper(doc, options.mode);
      var lines = splitLinesAuto(colorCode);
      placeLines(lines, d);
      updateCode(d);
    }
  
    function highlighterHelper(x, lang) {
      var tagcolor = 'e-elemt';
      var tagnamecolor = 'e-tag';
      var meta = "e-meta";
      var attributecolor = "e-attr";
      var attributevaluecolor = "e-string";
      var txtcolor = "txt";
      var commentcolor = "htmlcomment";
      var commentcus = "e-comment-cus";
      var cssselectorcolor = "stylenae";
      var csspropertycolor = "txt";
      var csspropertyvaluecolor = "stylesele";
      var cssdelimitercolor = "txt";
      var cssimportantcolor = "stylesyn";
      var jscolor = "txt";
      var jskeywordcolor = "javakeyword";
      var jsstringcolor = "e-string";
      var jsnumbercolor = "e-num";
      var jspropertycolor = "txt";
      var phptagcolor = "e-meta";
      var phpcolor = "e-meta";
      var phpkeywordcolor = "javakeyword";
      var phpglobalcolor = "phpglobals";
      var phpstringcolor = "e-string";
      var phpnumbercolor = "e-num";
      var cppkeywordcolor = "e-keyword";
      var cppstringcolor = "e-string";
      var cppnumbercolor = "e-num";
      var pythoncolor = "txtpy";
      var pythonkeywordcolor = "javakeyword";
      var pythonstringcolor = "e-string";
      var pythonnumbercolor = "e-num";
      var angularstatementcolor = "e-meta";
      var sqlcolor = "txt";
      var sqlkeywordcolor = "javakeyword";
      var sqlstringcolor = "e-string";
      var sqlnumbercolor = "e-num";
  
      if (!lang) { lang = "text/html"; }
      if (lang == "text/html" || lang == "mixedmode") { return htmlMode(x); }
      if (lang == "text/css") { return cssMode(x); }
      if (lang == "text/js" || lang == "text/javascript") { return jsMode(x); }
      if (lang == "text/php" || lang == "text/x-php") { return phpMode(x); }
      if (lang == "text/cpp" || lang == "text/c++" || lang == "text/clike") { return cppMode(x); }
      if (lang == "text/sql") { return sqlMode(x); }
      if (lang == "text/python" || lang == "text/py" || lang == "text/x-python") { return pythonMode(x); }
      return x;
  
      function extract(str, start, end, func, repl) {
        var s, e, d = "", a = [];
        while (str.search(start) > -1) {
          s = str.search(start);
          e = str.indexOf(end, s);
          if (e == -1) { e = str.length; }
          if (repl) {
            a.push(func(str.substring(s, e + (end.length))));
            str = str.substring(0, s) + repl + str.substr(e + (end.length));
          } else {
            d += str.substring(0, s);
            d += func(str.substring(s, e + (end.length)));
            str = str.substr(e + (end.length));
          }
        }
        this.rest = d + str;
        this.arr = a;
      }
  
      function htmlMode(txt) {
        var rest = txt, done = "", php, comment, angular, startpos, endpos, note, i, meta;
        php = new extract(rest, "&lt;\\?php", "?&gt;", phpMode, "PHPPOS");
        rest = php.rest;
        comment = new extract(rest, "&lt;!--", "--&gt;", multicommentMode, "HTMLCOMMENTPOS");
        rest = comment.rest;
        meta = new extract(rest, "&lt;!", "html&gt;", metaMode, 'METAPOS');
        rest = meta.rest
        while (rest.indexOf("&lt;") > -1) {
          note = "";
          startpos = rest.indexOf("&lt;");
          if (rest.substr(startpos, 9).toUpperCase() == "&LT;STYLE") { note = "css"; }
          if (rest.substr(startpos, 10).toUpperCase() == "&LT;SCRIPT") { note = "javascript"; }
          endpos = rest.indexOf("&gt;", startpos);
          if (endpos == -1) { endpos = rest.length; }
          done += rest.substring(0, startpos);
          done += tagMode(rest.substring(startpos, endpos + 4));
          rest = rest.substr(endpos + 4);
          if (note == "css") {
            endpos = rest.indexOf("&lt;/style&gt;");
            if (endpos > -1) {
              done += cssMode(rest.substring(0, endpos));
              rest = rest.substr(endpos);
            }
          }
          if (note == "javascript") {
            endpos = rest.indexOf("&lt;/script&gt;");
            if (endpos > -1) {
              done += jsMode(rest.substring(0, endpos));
              rest = rest.substr(endpos);
            }
          }
        }
        rest = done + rest;
        angular = new extract(rest, "{{", "}}", angularMode);
        rest = angular.rest;
        for (i = 0; i < comment.arr.length; i++) {
          rest = rest.replace("HTMLCOMMENTPOS", comment.arr[i]);
        }
        for (i = 0; i < php.arr.length; i++) {
          rest = rest.replace("PHPPOS", php.arr[i]);
        }
        for (i = 0; i < meta.arr.length; i++) {
          rest = rest.replace("METAPOS", meta.arr[i]);
        }
        return rest;
      }
      
      function tagMode(txt) {
        var rest = txt, done = "", startpos, endpos, result;
        while (rest.search(/(\s|<br>)/) > -1) {
          startpos = rest.search(/(\s|<br>)/);
          endpos = rest.indexOf("&gt;");
          if (endpos == -1) { endpos = rest.length; }
          done += rest.substring(0, startpos);
          done += attributeMode(rest.substring(startpos, endpos));
          rest = rest.substr(endpos);
        }
        result = done + rest;
        result = "<span class=" + tagcolor + ">&lt;</span>" + result.substring(4);
        if (result.substr(result.length - 4, 4) == "&gt;") {
          result = result.substring(0, result.length - 4) + "<span class=" + tagcolor + ">&gt;</span>";
        }
        return "<span class=" + tagnamecolor + ">" + result + "</span>";
      }
  
      function attributeMode(txt) {
        var rest = txt, done = "", startpos, endpos, singlefnuttpos, doublefnuttpos, spacepos;
        while (rest.indexOf("=") > -1) {
          endpos = -1;
          startpos = rest.indexOf("=") + 1;
          singlefnuttpos = rest.indexOf("'", startpos);
          doublefnuttpos = rest.indexOf('"', startpos);
          spacepos = rest.indexOf(" ", startpos + 2);
          if (spacepos > -1 && (spacepos < singlefnuttpos || singlefnuttpos == -1) && (spacepos < doublefnuttpos || doublefnuttpos == -1)) {
            endpos = rest.indexOf(" ", startpos);
          } else if (doublefnuttpos > -1 && (doublefnuttpos < singlefnuttpos || singlefnuttpos == -1) && (doublefnuttpos < spacepos || spacepos == -1)) {
            endpos = rest.indexOf('"', rest.indexOf('"', startpos) + 1);
          } else if (singlefnuttpos > -1 && (singlefnuttpos < doublefnuttpos || doublefnuttpos == -1) && (singlefnuttpos < spacepos || spacepos == -1)) {
            endpos = rest.indexOf("'", rest.indexOf("'", startpos) + 1);
          }
          if (!endpos || endpos == -1 || endpos < startpos) { endpos = rest.length; }
          done += rest.substring(0, startpos - 1);
          done += attributeEQSign(rest.substring(rest.indexOf('='), rest.indexOf(rest.substring(startpos, endpos + 1))));
          done += attributeValueMode(rest.substring(startpos, endpos + 1));
          rest = rest.substr(endpos + 1);
        }
        return "<span class=" + attributecolor + ">" + done + rest + "</span>";
      }
  
      function attributeValueMode(txt) {
        return "<span class=" + attributevaluecolor + ">" + txt + "</span>";
      }
  
      function attributeEQSign(txt) {
        return "<span class=" + txtcolor + ">" + txt + "</span>";
      }
  
      function angularMode(txt) {
        return "<span class=" + angularstatementcolor + ">" + txt + "</span>";
      }
  
      function multicommentMode(txt) {
        var splitTxt = splitLinesAuto(txt), arr = [], newTxt;
        for (var i = 0; i < splitTxt.length; i++) {
          arr.push('<span class=' + commentcolor + '>' + splitTxt[i] + '</span>nwLine');
        }
        arr[arr.length - 1] = arr[arr.length - 1].replaceAll('nwLine', '');
        for (var i = 0; i < arr.length; i++) {
          newTxt += arr[i];
        }
  
        return (newTxt.replaceAll('undefined<span', '<span').replaceAll('nwLine', '\n'));
      }
  
      function multicommentModeCus(txt) {
        var splitTxt = splitLinesAuto(txt), arr = [], newTxt;
        for (var i = 0; i < splitTxt.length; i++) {
          arr.push('<span class=' + commentcus + '>' + splitTxt[i] + '</span>nwLine');
        }
        arr[arr.length - 1] = arr[arr.length - 1].replaceAll('nwLine', '');
        for (var i = 0; i < arr.length; i++) {
          newTxt += arr[i];
        }
  
        return (newTxt.replaceAll('undefined<span', '<span').replaceAll('nwLine', '\n'));
      }
  
      function commentMode(txt) {
        return "<span class=" + commentcolor + ">" + txt + "</span>";
      }
  
      function commentModeCus(txt) {
        return "<span class=" + commentcus + ">" + txt + "</span>";
      }
  
      function metaMode(txt) {
        return "<span class=" + meta + ">" + txt + "</span>";
      }
  
      function cssMode(txt) {
        var rest = txt, done = "", s, e, comment, i, midz, c, cc;
        comment = new extract(rest, /\/\*/, "*/", multicommentMode, "CSSCOMMENTPOS");
        rest = comment.rest;
        while (rest.search("{") > -1) {
          s = rest.search("{");
          midz = rest.substr(s + 1);
          cc = 1;
          c = 0;
          for (i = 0; i < midz.length; i++) {
            if (midz.substr(i, 1) == "{") { cc++; c++ }
            if (midz.substr(i, 1) == "}") { cc--; }
            if (cc == 0) { break; }
          }
          if (cc != 0) { c = 0; }
          e = s;
          for (i = 0; i <= c; i++) {
            e = rest.indexOf("}", e + 1);
          }
          if (e == -1) { e = rest.length; }
          done += rest.substring(0, s + 1);
          done += cssPropertyMode(rest.substring(s + 1, e));
          rest = rest.substr(e);
        }
        rest = done + rest;
        rest = rest.replace(/{/g, "<span class=" + cssdelimitercolor + ">{</span>");
        rest = rest.replace(/}/g, "<span class=" + cssdelimitercolor + ">}</span>");
        for (i = 0; i < comment.arr.length; i++) {
          rest = rest.replace("CSSCOMMENTPOS", comment.arr[i]);
        }
        return "<span class=" + cssselectorcolor + ">" + rest + "</span>";
      }
  
      function cssPropertyMode(txt) {
        var rest = txt, done = "", s, e, n, loop;
        if (rest.indexOf("{") > -1) { return cssMode(rest); }
        while (rest.search(":") > -1) {
          s = rest.search(":");
          loop = true;
          n = s;
          while (loop == true) {
            loop = false;
            e = rest.indexOf(";", n);
            if (rest.substring(e - 5, e + 1) == "&nbsp;") {
              loop = true;
              n = e + 1;
            }
          }
          if (e == -1) { e = rest.length; }
          done += rest.substring(0, s);
          done += cssPropertyValueMode(rest.substring(s, e + 1));
          rest = rest.substr(e + 1);
        }
        return "<span class=" + csspropertycolor + ">" + done + rest + "</span>";
      }
  
      function cssPropertyValueMode(txt) {
        var rest = txt, done = "", s;
        rest = "<span class=" + cssdelimitercolor + ">:</span>" + rest.substring(1);
        while (rest.search(/!important/i) > -1) {
          s = rest.search(/!important/i);
          done += rest.substring(0, s);
          done += cssImportantMode(rest.substring(s, s + 10));
          rest = rest.substr(s + 10);
        }
        result = done + rest;
        if (result.substr(result.length - 1, 1) == ";" && result.substr(result.length - 6, 6) != "&nbsp;" && result.substr(result.length - 4, 4) != "&lt;" && result.substr(result.length - 4, 4) != "&gt;" && result.substr(result.length - 5, 5) != "&amp;") {
          result = result.substring(0, result.length - 1) + "<span class=" + cssdelimitercolor + ">;</span>";
        }
        return "<span class=" + csspropertyvaluecolor + ">" + result + "</span>";
      }
  
      function cssImportantMode(txt) {
        return "<span class=" + cssimportantcolor + ";font-weight:bold;>" + txt + "</span>";
      }
  
      function jsMode(txt) {
        var rest = txt, done = "", esc = [], i, cc, tt = "", sfnuttpos, dfnuttpos, compos, comlinepos, keywordpos, numpos, mypos, dotpos, y;
        for (i = 0; i < rest.length; i++) {
          cc = rest.substr(i, 1);
          if (cc == "\\") {
            esc.push(rest.substr(i, 2));
            cc = "JSESCAPE";
            i++;
          }
          tt += cc;
        }
        rest = tt;
        y = 1;
        while (y == 1) {
          sfnuttpos = getPos(rest, "'", "'", jsStringMode);
          dfnuttpos = getPos(rest, '"', '"', jsStringMode);
          compos = getPos(rest, /\/\*/, "*/", multicommentModeCus);
          comlinepos = getPos(rest, /\/\//, "\n", commentModeCus);
          numpos = getNumPos(rest, jsNumberMode);
          keywordpos = getKeywordPos("js", rest, jsKeywordMode);
          dotpos = getDotPos(rest, jsPropertyMode);
          if (Math.max(numpos[0], sfnuttpos[0], dfnuttpos[0], compos[0], comlinepos[0], keywordpos[0], dotpos[0]) == -1) { break; }
          mypos = getMinPos(numpos, sfnuttpos, dfnuttpos, compos, comlinepos, keywordpos, dotpos);
          if (mypos[0] == -1) { break; }
          if (mypos[0] > -1) {
            done += rest.substring(0, mypos[0]);
            done += mypos[2](rest.substring(mypos[0], mypos[1]));
            rest = rest.substr(mypos[1]);
          }
        }
        rest = done + rest;
        for (i = 0; i < esc.length; i++) {
          rest = rest.replace("JSESCAPE", esc[i]);
        }
        return "<span class=" + jscolor + ">" + rest + "</span>";
      }
  
      function jsStringMode(txt) {
        return "<span class=" + jsstringcolor + ">" + txt + "</span>";
      }
  
      function jsKeywordMode(txt) {
        return "<span class=" + jskeywordcolor + ">" + txt + "</span>";
      }
  
      function jsNumberMode(txt) {
        return "<span class=" + jsnumbercolor + ">" + txt + "</span>";
      }
  
      function jsPropertyMode(txt) {
        return "<span class=" + jspropertycolor + ">" + txt + "</span>";
      }
  
      function getDotPos(txt, func) {
        var x, i, j, s, e, arr = [".", "<", " ", ";", "(", "+", ")", "[", "]", ",", "&", ":", "{", "}", "index.html", "-", "*", "|", "%"];
        s = txt.indexOf(".");
        if (s > -1) {
          x = txt.substr(s + 1);
          for (j = 0; j < x.length; j++) {
            cc = x[j];
            for (i = 0; i < arr.length; i++) {
              if (cc.indexOf(arr[i]) > -1) {
                e = j;
                return [s + 1, e + s + 1, func];
              }
            }
          }
        }
        return [-1, -1, func];
      }
  
      function getMinPos() {
        var i, arr = [];
        for (i = 0; i < arguments.length; i++) {
          if (arguments[i][0] > -1) {
            if (arr.length == 0 || arguments[i][0] < arr[0]) { arr = arguments[i]; }
          }
        }
        if (arr.length == 0) { arr = arguments[i]; }
        return arr;
      }
  
      function sqlMode(txt) {
        var rest = txt, y, done = "", sfnuttpos, dfnuttpos, compos, comlinepos, keywordpos, numpos, mypos;
        y = 1;
        while (y == 1) {
          sfnuttpos = getPos(rest, "'", "'", sqlStringMode);
          dfnuttpos = getPos(rest, '"', '"', sqlStringMode);
          compos = getPos(rest, /\/\*/, "*/", multicommentModeCus);
          comlinepos = getPos(rest, /--/, "\n", commentModeCus);
          numpos = getNumPos(rest, sqlNumberMode);
          keywordpos = getKeywordPos("sql", rest, sqlKeywordMode);
          if (Math.max(numpos[0], sfnuttpos[0], dfnuttpos[0], compos[0], comlinepos[0], keywordpos[0]) == -1) { break; }
          mypos = getMinPos(numpos, sfnuttpos, dfnuttpos, compos, comlinepos, keywordpos);
          if (mypos[0] == -1) { break; }
          if (mypos[0] > -1) {
            done += rest.substring(0, mypos[0]);
            done += mypos[2](rest.substring(mypos[0], mypos[1]));
            rest = rest.substr(mypos[1]);
          }
        }
        rest = done + rest;
        return "<span class=" + sqlcolor + ">" + rest + "</span>";
      }
  
      function sqlStringMode(txt) {
        return "<span class=" + sqlstringcolor + ">" + txt + "</span>";
      }
  
      function sqlKeywordMode(txt) {
        return "<span class=" + sqlkeywordcolor + ">" + txt + "</span>";
      }
  
      function sqlNumberMode(txt) {
        return "<span class=" + sqlnumbercolor + ">" + txt + "</span>";
      }
  
      function phpMode(txt) {
        var rest = txt, done = "", sfnuttpos, dfnuttpos, compos, comlinepos, comhashpos, keywordpos, mypos, y;
        y = 1;
        while (y == 1) {
          sfnuttpos = getPos(rest, "'", "'", phpStringMode);
          dfnuttpos = getPos(rest, '"', '"', phpStringMode);
          compos = getPos(rest, /\/\*/, "*/", multicommentModeCus);
          comhashpos = getPos(rest, "#", "\n", commentModeCus);
          numpos = getNumPos(rest, phpNumberMode);
          keywordpos = getKeywordPos("php", rest, phpKeywordMode);
          if (Math.max(numpos[0], sfnuttpos[0], dfnuttpos[0], compos[0], comhashpos[0], keywordpos[0]) == -1) { break; }
          mypos = getMinPos(numpos, sfnuttpos, dfnuttpos, compos, comhashpos, keywordpos);
          if (mypos[0] == -1) { break; }
          if (mypos[0] > -1) {
            done += rest.substring(0, mypos[0]);
            done += mypos[2](rest.substring(mypos[0], mypos[1]));
            rest = rest.substr(mypos[1]);
          }
        }
        rest = done + rest;
        rest = "<span class=" + phptagcolor + ">&lt;" + rest.substr(4, 4) + "</span>" + rest.substring(8);
        if (rest.substr(rest.length - 5, 5) == "?&gt;") {
          rest = rest.substring(0, rest.length - 5) + "<span class=" + phptagcolor + ">?&gt;</span>";
        }
        return "<span class=" + phpcolor + ">" + rest + "</span>";
      }
  
      function phpStringMode(txt) {
        return "<span class=" + phpstringcolor + ">" + txt + "</span>";
      }
      
      function phpNumberMode(txt) {
        return "<span class=" + phpnumbercolor + ">" + txt + "</span>";
      }
  
      function phpKeywordMode(txt) {
        var glb = ["$GLOBALS", "$_SERVER", "$_REQUEST", "$_POST", "$_GET", "$_FILES", "$_ENV", "$_COOKIE", "$_SESSION"];
        if (glb.indexOf(txt.toUpperCase()) > -1) {
          if (glb.indexOf(txt) > -1) {
            return "<span class=" + phpglobalcolor + ">" + txt + "</span>";
          } else {
            return txt;
          }
        } else {
          return "<span class=" + phpkeywordcolor + ">" + txt + "</span>";
        }
      }
  
      function cppMode(txt) {
        var rest = txt, i, done = "", sfnuttpos, dfnuttpos, compos, comlinepos, includepos, keywordpos, mypos, y;
        y = 1;
        while (y == 1) {
          sfnuttpos = getPos(rest, "'", "'", cppStringMode);
          dfnuttpos = getPos(rest, '"', '"', cppStringMode);
          compos = getPos(rest, /\/\*/, "*/", multicommentModeCus);
          comlinepos = getPos(rest, /\/\//, "\n", commentModeCus);
          includepos = getPos(rest, "#include", "&gt;", metaMode);
          numpos = getNumPos(rest, cppNumberMode);
          keywordpos = getKeywordPos("cpp", rest, cppKeywordMode);
          if (Math.max(numpos[0], sfnuttpos[0], dfnuttpos[0], compos[0], comlinepos[0], includepos[0], keywordpos[0]) == -1) { break; }
          mypos = getMinPos(numpos, sfnuttpos, dfnuttpos, compos, comlinepos, includepos, keywordpos);
          if (mypos[0] == -1) { break; }
          if (mypos[0] > -1) {
            done += rest.substring(0, mypos[0]);
            done += mypos[2](rest.substring(mypos[0], mypos[1]));
            rest = rest.substr(mypos[1]);
          }
        }
        rest = done + rest;
        return rest;
      }
  
      function cppStringMode(txt) {
        return "<span class=" + cppstringcolor + ">" + txt + "</span>";
      }
  
      function cppNumberMode(txt) {
        return "<span class=" + cppnumbercolor + ">" + txt + "</span>";
      }
  
      function cppKeywordMode(txt) {
        return "<span class=" + cppkeywordcolor + ">" + txt + "</span>";
      }
  
      function pythonMode(txt) {
        var rest = txt, done = "", sfnuttpos, dfnuttpos, compos, comlinepos, comhashpos, keywordpos, mypos, y;
        y = 1;
        while (y == 1) {
          sfnuttpos = getPos(rest, "'", "'", pythonStringMode);
          dfnuttpos = getPos(rest, '"', '"', pythonStringMode);
          compos = getPos(rest, /\/\*/, "*/", multicommentModeCus);
          comhashpos = getPos(rest, "#", "\n", commentModeCus);
          numpos = getNumPos(rest, pythonNumberMode);
          keywordpos = getKeywordPos("python", rest, pythonKeywordMode);
          if (Math.max(numpos[0], sfnuttpos[0], dfnuttpos[0], compos[0], comlinepos[0], comhashpos[0], keywordpos[0]) == -1) { break; }
          mypos = getMinPos(numpos, sfnuttpos, dfnuttpos, compos, comlinepos, comhashpos, keywordpos);
          if (mypos[0] == -1) { break; }
          if (mypos[0] > -1) {
            done += rest.substring(0, mypos[0]);
            done += mypos[2](rest.substring(mypos[0], mypos[1]));
            rest = rest.substr(mypos[1]);
          }
        }
        rest = done + rest;
        return "<span class=" + pythoncolor + ">" + rest + "</span>";
      }
  
      function pythonStringMode(txt) {
        return "<span class=" + pythonstringcolor + ">" + txt + "</span>";
      }
  
      function pythonNumberMode(txt) {
        return "<span class=" + pythonnumbercolor + ">" + txt + "</span>";
      }
  
      function pythonKeywordMode(txt) {
        return "<span class=" + pythonkeywordcolor + ">" + txt + "</span>";
      }
  
      function getKeywordPos(typ, txt, func) {
        var words, i, pos, rpos = -1, rpos2 = -1, patt;
        if (typ == "js") {
          words = ["abstract", "arguments", "boolean", "break", "byte", "case", "catch", "char", "class", "const", "continue", "debugger", "default", "delete",
            "do", "double", "else", "enum", "eval", "event", "export", "extends", "false", "final", "finally", "float", "for", "function", "goto", "if", "implements", "import",
            "in", "instanceof", "int", "interface", "let", "long", "NaN", "native", "new", "null", "package", "private", "protected", "public", "return", "short", "static",
            "super", "switch", "synchronized", "this", "throw", "throws", "transient", "true", "try", "typeof", "var", "void", "volatile", "while", "with", "yield"];
        } else if (typ == "php") {
          words = ["$GLOBALS", "$_SERVER", "$_REQUEST", "$_POST", "$_GET", "$_FILES", "$_ENV", "$_COOKIE", "$_SESSION",
            "__halt_compiler", "abstract", "and", "array", "as", "break", "callable", "case", "catch", "class", "clone", "const", "continue", "declare", "default",
            "die", "do", "echo", "else", "elseif", "empty", "enddeclare", "endfor", "endforeach", "endif", "endswitch", "endwhile", "eval", "exit", "extends", "final", "for",
            "foreach", "function", "global", "goto", "if", "implements", "include", "include_once", "instanceof", "insteadof", "interface", "isset", "list", "namespace", "new",
            "or", "print", "private", "protected", "public", "require", "require_once", "return", "static", "switch", "throw", "trait", "try", "unset", "use", "var", "while", "xor"];
        } else if (typ == "cpp") {
          words = ["bool", "boolen", "break", "byte", "catch", "char", "class", "const", "continue", "do", "double", "else", "eval", "event", "false", "final", "float",
            "for", "goto", "if", "in", "int", "interface", "long", "NaN", "new", "null", "return", "static", "super", "synchronized", "unsigned", "this", "throw", "throws",
            "true", "try", "void", "volatile", "while", "with", "yield", "HIGH", "INPUT", "INPUT_PULLUP", "LOW"];
        } else if (typ == "sql") {
          words = ["ADD", "EXTERNAL", "PROCEDURE", "ALL", "FETCH", "PUBLIC", "ALTER", "FILE", "RAISERROR", "AND", "FILLFACTOR", "READ", "ANY", "READTEXT", "AS", "FOREIGN",
            "RECONFIGURE", "ASC", "FREETEXT", "REFERENCES", "AUTHORIZATION", "FREETEXTTABLE", "REPLICATION", "BACKUP", "FROM", "RESTORE", "BEGIN", "FULL", "RESTRICT", "BETWEEN",
            "FUNCTION", "RETURN", "BREAK", "GOTO", "REVERT", "BROWSE", "GRANT", "REVOKE", "BULK", "GROUP", "RIGHT", "BY", "HAVING", "ROLLBACK", "CASCADE", "HOLDLOCK", "ROWCOUNT",
            "CASE", "IDENTITY", "ROWGUIDCOL", "CHECK", "IDENTITY_INSERT", "RULE", "CHECKPOINT", "IDENTITYCOL", "SAVE", "CLOSE", "IF", "SCHEMA", "CLUSTERED", "IN",
            "SECURITYAUDIT", "COALESCE", "INDEX", "SELECT", "COLLATE", "INNER", "SEMANTICKEYPHRASETABLE", "COLUMN", "INSERT", "SEMANTICSIMILARITYDETAILSTABLE", "COMMIT",
            "INTERSECT", "SEMANTICSIMILARITYTABLE", "COMPUTE", "INTO", "SESSION_USER", "CONSTRAINT", "IS", "SET", "CONTAINS", "JOIN", "SETUSER", "CONTAINSTABLE", "KEY",
            "SHUTDOWN", "CONTINUE", "KILL", "SOME", "CONVERT", "LEFT", "STATISTICS", "CREATE", "LIKE", "SYSTEM_USER", "CROSS", "LINENO", "TABLE", "CURRENT", "LOAD", "TABLESAMPLE",
            "CURRENT_DATE", "MERGE", "TEXTSIZE", "CURRENT_TIME", "NATIONAL", "THEN", "CURRENT_TIMESTAMP", "NOCHECK", "TO", "CURRENT_USER", "NONCLUSTERED", "TOP", "CURSOR",
            "NOT", "TRAN", "DATABASE", "NULL", "TRANSACTION", "DBCC", "NULLIF", "TRIGGER", "DEALLOCATE", "OF", "TRUNCATE", "DECLARE", "OFF", "TRY_CONVERT", "DEFAULT", "OFFSETS",
            "TSEQUAL", "DELETE", "ON", "UNION", "DENY", "OPEN", "UNIQUE", "DESC", "OPENDATASOURCE", "UNPIVOT", "DISK", "OPENQUERY", "UPDATE", "DISTINCT", "OPENROWSET",
            "UPDATETEXT", "DISTRIBUTED", "OPENXML", "USE", "DOUBLE", "OPTION", "USER", "DROP", "OR", "VALUES", "DUMP", "ORDER", "VARYING", "ELSE", "OUTER", "VIEW", "END",
            "OVER", "WAITFOR", "ERRLVL", "PERCENT", "WHEN", "ESCAPE", "PIVOT", "WHERE", "EXCEPT", "PLAN", "WHILE", "EXEC", "PRECISION", "WITH", "EXECUTE", "PRIMARY",
            "WITHIN GROUP", "EXISTS", "PRINT", "WRITETEXT", "EXIT", "PROC", "LIMIT", "MODIFY", "COUNT"];
        } else if (typ == "python") {
          words = ["as", "assert", "break", "class", "continue", "def", "del", "elif", "else", "except", "finally", "for", "from", "global", "if", "import",
            "lambda", "pass", "raise", "return", "try", "while", "with", "yield", "in", "abs", "all", "any", "bin", "bool", "bytearray", "callable", "chr",
            "classmethod", "compile", "complex", "delattr", "dict", "dir", "divmod", "enumerate", "eval", "filter", "float", "format", "frozenset", "getattr",
            "globals", "hasattr", "hash", "help", "hex", "id", "input", "int", "isinstance", "issubclass", "iter", "len", "list", "locals", "map", "max",
            "memoryview", "min", "next", "object", "oct", "open", "ord", "pow", "print", "property", "range", "repr", "reversed", "round", "set", "setattr", "slice",
            "sorted", "statisynethod", "str", "sum", "super", "tuple", "type", "vars", "zip", "__import__", "NotImplemented", "Ellipsis", "__debug__"];
        }
        for (i = 0; i < words.length; i++) {
          if (typ == "php" || typ == "sql") {
            pos = txt.toLowerCase().indexOf(words[i].toLowerCase());
          } else {
            pos = txt.indexOf(words[i]);
          }
          if (pos > -1) {
            patt = /\W/g;
            if (txt.substr(pos + words[i].length, 1).match(patt) && txt.substr(pos - 1, 1).match(patt)) {
              if (pos > -1 && (rpos == -1 || pos < rpos)) {
                rpos = pos;
                rpos2 = rpos + words[i].length;
              }
            }
          }
        }
        return [rpos, rpos2, func];
      }
  
      function getPos(txt, start, end, func) {
        var s, e;
        s = txt.search(start);
        e = txt.indexOf(end, s + (end.length));
        if (e == -1) { e = txt.length; }
        return [s, e + (end.length), func];
      }
  
      function getNumPos(txt, func) {
        var arr = ["<br>", " ", ";", "(", "+", ")", "[", "]", ",", "&", ":", "{", "}", "index.html", "-", "*", "|", "%", "="], i, j, c, startpos = 0, endpos, word;
        for (i = 0; i < txt.length; i++) {
          for (j = 0; j < arr.length; j++) {
            c = txt.substr(i, arr[j].length);
            if (c == arr[j]) {
              if (c == "-" && (txt.substr(i - 1, 1) == "e" || txt.substr(i - 1, 1) == "E")) {
                continue;
              }
              endpos = i;
              if (startpos < endpos) {
                word = txt.substring(startpos, endpos);
                if (!isNaN(word)) { return [startpos, endpos, func]; }
              }
              i += arr[j].length;
              startpos = i;
              i -= 1;
              break;
            }
          }
        }
        return [-1, -1, func];
      }
    }
  
    function placeLines(lines, display) {
      for (var i = 0; i < lines.length; i++) {
        var blank = elemt('span', null, 'blank');
        blank.innerHTML = lines[i];
        var span = elemt('span', [blank]);
        var line = elemt('pre', [span], 'e-example-line');
        addAttr(line, 'role', 'presentation');
        var gutterElt = elemt('div', String(i + 1), 'e-example-linenumber e-example-gutter-elt');
        var gutter = elemt('div', [gutterElt], 'e-example-gutter-wrapper', null, 'left: -30px;');
        var pos = elemt('div', [gutter, line], 'e-example-pos');
        display.lineDiv.appendChild(pos);
      updateGutterWidth(display, gutterElt);
      updateGutterHeight(display, gutterElt);
      }
    }
  
    function updateGutters(syn) {
      renderGutters(syn.display);
      regChange(syn);
      alignHorizontally(syn);
    }
  
    function Display(place, doc, options, type) {
      var d = this;
  
      d.scrollbarFiller = elemt('div', null, 'e-example-scrollbar-filler', { 'syn-not-content': 'true' });
  
      d.link = elemt('button', 'Tryit »', 'tryit-3', /*{ 'href': options.link, 'target': '_blank' }*/);
  
      d.gutters = elemt('div', null, 'e-example-gutters');
      d.lineNumbers = null;
  
      d.lineDiv = elemt('div', null, 'e-example-code');
      d.lineMeasure = elemt('div', null, 'e-example-measure');
      d.measure = elemt('div', null, 'e-example-measure');
  
      d.lineSpaces = elemt('div', [d.measure, d.lineMeasure, d.lineDiv], null, null, 'position: relative;outline: none;')
      d.lines = elemt('div', [d.lineSpaces], 'e-example-lines', { 'role': 'presentation' });
      d.mover = elemt('div', [d.lines], null, null, 'position: relative');
      d.sizer = elemt('div', [d.mover], 'e-example-sizer');
  
      d.scroller = elemt('div', [d.sizer, d.gutters], 'e-example-scroll', { 'tabIndex': '-1' });
  
      d.wrapper = elemt('div', [d.scrollbarFiller, d.scroller], 'e-example light e-shadow');
  
      d.header = elemt('h3', options.title);
  
      d.button = elemt('button', 'Copy', 'e-teal btn btn-padding-large, e-round-22', null, 'position: relative; top: -47px; left: calc(100% - 69px);');
  
      d.formInput = elemt('textarea', null, null, {'type': 'hidden', 'name': 'code', 'id': 'code'});
  
      d.form = elemt('form', [d.formInput], null, {'id': 'codeForm', 'autocomplete': 'off', 'method': 'post', 'action': options.link, 'target': '_blank'}, 'display: none');
  
      d.highlighter = elemt('div', [d.header, d.button, d.wrapper, d.link, d.form], 'e-example-col e-col 15 e-shadow');
  
      if (ie && ie_version < 8) { e.css(d.gutters, 'z-index: -1'); e.css(d.scroller, 'padding-right: 0px') }
      if (!webkit && !(gecko && mobile)) { d.scroller.draggable = true; }
  
      if (place) {
        if (place.appendChild) { place.appendChild(d.highlighter); }
        else { place(d.highlighter) }
      }
  
      d.viewFrom = d.viewTo = doc.first;
      d.reportedViewFrom = d.reportedViewTo = doc.first;
      d.view = [];
      d.renderedView = null;
      d.externalMeasured = null;
      d.viewOffset = 0;
      d.lastWrapHeight = d.lastWrapWidth = 0;
      d.updateLineNumbers = null;
  
      d.nativeBarWidth = d.barHeight = d.barWidth = 0;
      d.scrollbarsClipped = false;
      d.lineNumWidth = d.lineNumInnerWidth = d.lineNumChars = null;
      d.alignWidgets = false;
  
      d.cachedCharWidth = d.cachedTextHeight = d.cachedPaddingH = null;
      d.maxLine = null;
      d.maxLineLength = 0;
      d.maxLineChanged = false;
      d.wheelDX = d.wheelDY = d.wheelStartX = d.wheelStartY = null;
      d.shift = false;
      d.selForContextMenu = null;
  
      d.activeTouch = null;
  
      if (!options.link || options.link == false) { remove(d.link) }
      if (!options.copyBtn || options.copyBtn == false) { remove(d.button) }
      if (!options.title || options.title == false) { remove(d.header) }
      if (options.copyBtn) { css(d.wrapper, 'margin-top: -41px;') }
  
      if (options.type == 'syntax' && options.type !== 'viewer') {
        d.gutterSpecs = getGutters(options.gutters, options.lineNumbers);
        d.result = measure(d);
        renderGutters(d);
        d.codeBtn = elemt('button', 'Copy', 'e-example-copy-btn e-teal btn e-round-22');
      } else {
  
      }
  
      on(d.button, 'click', function () {
        d.pre.select();
        document.execCommand('copy');
      }, true);
    }
  
    function updateIframe(viewer) {
      var height = Number(getStyleValue(viewer.ifrw.documentElement.querySelector('body'), 'height').replaceAll('px', ''));
      var width = Number(getStyleValue(viewer.display.lineDiv, 'width').replaceAll('px', ''));
      css(viewer.iframe, 'height: ' + toCssPx(height) + ';width: ' + toCssPx(width));
      setAttributes(viewer.iframe, {'height': height, 'width': width});
    }
  
    function Viewer(display, doc, options) {
      var v = this;
      this.iframe = elemt('iframe', null, 'e-example-iframe', { 'id': 'iframe', 'frameborder': '0', 'name': 'iframeResult' });
      this.doc = doc;
      this.display = display;
      this.options = options;
  
      addClass(display.wrapper, 'viewer');
      addChild(display.lineDiv, [this.iframe]);
  
      this.ifrw = this.iframe.contentDocument;
      this.ifrw.open();
      this.ifrw.write(doc);
      this.ifrw.close();
  
      if (this.ifrw.body && !this.ifrw.body.isContentEditable) {
        this.ifrw.body.contentEditable = true;
        this.ifrw.body.contentEditable = false;
      }
  
      addHead(this);
      on(window$1, 'resize', function () {
        updateIframe(v)
      });
      on(window$1, 'load', function () {
        updateIframe(v)
      });
    }
  
    function addHead(viewer) {
      var metaCharset = elemt('meta', null, null, { 'charset': 'utf-8' });
      var metaHttp = elemt('meta', null, null, { 'http-equiv': 'X-UA-Compatible', 'content': 'IE-edge' });
      var metaViewport = elemt('meta', null, null, { 'name': 'viewport', 'content': 'width=device-width, initial-scale=1.0' });
      var title = elemt('title', viewer.options.title);
      var style = elemt('style', `*, *:before, *:after {-moz-box-sizing: border-box;-webkit-box-sizing: border-box;box-sizing: border-box;}.h1, .h2, .h3, .h4, .h5, .h6, #nav-bar #main-menu ul li > a, .author-posts-count, .author-title, .author-position, .serch .s, .review-box .bar, .review-box .score-box {font-family: 'Roboto',sans-serif;}h1 {font-size: 2em;}hr {border: 0;border-top: 1px solid #d1d1d1;margin: 20px 0;height: 0px;box-sizing: content-box;overflow: visible;}html {-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;}html {overflow-x: hidden;}html, body {font-family: open sans,lucida grande,Lucida,Verdana,sans-serif;font-size: 15px;line-height: 1.5;}html {overflow-x: hidden;scroll-behavior: smooth;}html {-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;}html {box-sizing: border-box;}body {margin: 0;padding: 8px 12px}body {font-family: Verdana,sans-serif;font-size: 16px;height: auto;line-height: 1.7;}body {margin: 0 auto;width: 100%;transition: all 0.3s;}article, aside, details, figcaption, figure, footer, header, main, menu, nav, section, summary {display: block}audio, canvas, progress, video {display: inline-block}center {display: block;text-align: center;}progress {vertical-align: baseline}p {hyphens: auto;margin: 1em 0;}pre {white-space: break-spaces;}p, pre {width: 100%;}audio:not([controls]) {display: none;height: 0}[hidden], template {display: none}a {background-color: transparent;color: inherit;text-decoration: double;-webkit-text-decoration-skip: objects;}a:active, a:hover {outline-width: 0}abbr[title] {border-bottom: none;text-decoration: underline;text-decoration: underline dotted}b {font-weight: bold;}dfn {font-style: italic}mark {background: #ff0;color: #000}small {font-size: 80%}sub, sup {font-size: 75%;line-height: 0;position: relative;vertical-align: baseline}sub {bottom: -0.25em}sup {top: -0.5em}figure {margin: 1em 40px}form {border: 3px solid rgb(241, 241, 241);}img {border-style: none}img {border-style: none;object-fit: contain;background-color: transparent;}input[type="comment"] {width: 100%;padding: 12px 20px;margin: 8px 0px;display: inline-block;border: 1px solid rgb(204, 204, 204);box-sizing: border-box;}input, button, textarea {outline: none;}input.invalid {background-color: #ffdddd;border: 1px solid #aaaaaa;}input[type="text"], input[type="password"], input[type="number"] {padding: 12px 20px;border: 1px #767676 solid;margin: 8px 0px;display: inline-block;box-sizing: border-box;width: 100%;}svg:not(:root) {overflow: hidden;}code, kbd, pre, samp {font-family: monospace, monospace;font-size: 1em}button:hover {opacity: 0.8;}ul {display: block;list-style-type: disc;margin-block-start: 1em;margin-block-end: 1em;margin-inline-start: 0px;margin-inline-end: 0px;padding-inline-start: 40px;}ol {display: block;list-style-type: decimal;margin-block-start: 1em;margin-block-end: 1em;margin-inline-start: 0px;margin-inline-end: 0px;padding-inline-start: 40px;}li {display: list-item;text-align: -webkit-match-parent;}h1 {font-size: 36px}h2 {font-size: 30px}h3 {font-size: 24px}h4 {font-size: 20px}h5 {font-size: 18px}h6 {font-size: 16px}h1,h2,h3,h4,h5,h6 {font-family: "Segoe UI",Arial,sans-serif;font-weight: 400;margin: 10px 0;}hr {box-sizing: content-box;height: 0;overflow: visible}hr {border: 0;border-top: 1px solid #eee;margin: 20px 0}button, input, select, textarea {font: inherit;margin: 0}input, textarea {font-family: monospace;}optgroup {font-weight: bold}button, input {overflow: visible}button, select {text-transform: none}button, html [type=button], [type=reset], [type=submit] {-webkit-appearance: button}button::-moz-focus-inner, [type=button]::-moz-focus-inner, [type=reset]::-moz-focus-inner, [type=submit]::-moz-focus-inner {border-style: none;padding: 0}button::-moz-focusring, [type=button]::-moz-focusring, [type=reset]:-moz-focusring, [type=submit]::-moz-focusring {outline: 1px dotted ButtonText}fieldset {border: 1px solid #c0c0c0;margin: 0 2px;padding: .35em .625em .75em}legend {color: inherit;display: table;max-width: 100%;padding: 0;white-space: normal}textarea {overflow: auto;resize: none;}[type=checkbox], [type=radio] {padding: 0}[type=number]::-webkit-inner-spin-button, [type=number]::-webkit-outer-spin-button {height: auto}[type=search] {-webkit-appearance: textfield;outline-offset: -2px}[type=search]::-webkit-search-cancel-button, [type=search]::-webkit-search-decoration {-webkit-appearance: none}::-webkit-input-placeholder {color: inherit;opacity: 0.54}::-webkit-file-upload-button {-webkit-appearance: button;font: inherit}::-webkit-scrollbar {width: 10px;height: 10px;background-color: rgb(255, 255, 255);box-shadow: rgba(0, 0, 0, 0.1) 1px 1px 0px inset, rgba(0, 0, 0, 0.07) -1px -1px 0px inset;}::-webkit-scrollbar-thumb {min-height: 0.8em;min-width: 0.8em;background-color: #9b9b9b99;box-shadow: rgba(0, 0, 0, 0.1) 1px 1px 0px inset, rgba(0, 0, 0, 0.07) -1px -1px 0px inset;cursor: default;}::-webkit-scrollbar-thumb:hover {background-color: #75757599}::selection {background-color: #4caf50;color: rgb(179, 142, 142);}`);
      addChild(viewer.ifrw.head, [metaCharset, metaHttp, metaViewport, title, style]);
    }
  
    function getGutters(gutters, lineNumbers) {
      var result = [], sawLineNumbers = false;
      for (var i = 0; i < gutters.length; i++) {
        var name = gutters[i], style = null;
        if (typeof name != 'string') { style = name.style; name = name.className; }
        if (name == 'e-example-linenumbers') {
          if (!lineNumbers) { continue }
          else { sawLineNumbers = true; }
        }
        result.push({ className: name, style: style });
      }
      if (lineNumbers && !sawLineNumbers) { result.push({ className: 'e-example-linenumbers', style: null }); }
      return result
    }
  
    function updateGutterWidth(display, gutter) {
      var width = gutter.clientWidth + 2;
      display.sizer.style.marginLeft = width + 'px';
      display.gutters.style.width = width + 'px';
    }
  
    function updateGutterHeight(display, gutter) {
      var height = display.sizer.offsetHeight + 2;
      display.gutters.style.height = height + 'px';
    }
  
    function eventInWidget(display, e) {
      for (var n = e_target(e); n != display.wrapper; n = n.parentNode) {
        if (!n || (n.nodeType == 1 && n.getAttribute("syn-ignore-events") == "true") ||
            (n.parentNode == display.sizer && n != display.mover))
          { return true }
      }
    }
  
    var DisplayUpdate = function(syn, viewport, force) {
      var display = syn.display;
  
      this.viewport = viewport;
      // Store some values that we'll need later (but don't want to force a relayout for)
      this.visible = visibleLines(display, syn.doc, viewport);
      this.editorIsHidden = !display.wrapper.offsetWidth;
      this.wrapperHeight = display.wrapper.clientHeight;
      this.wrapperWidth = display.wrapper.clientWidth;
      this.oldDisplayWidth = displayWidth(syn);
      this.force = force;
      this.dims = getDimensions(syn);
      this.events = [];
    };
  
    DisplayUpdate.prototype.signal = function (emitter, type) {
      if (hasHandler(emitter, type))
        { this.events.push(arguments); }
    };
    DisplayUpdate.prototype.finish = function () {
      for (var i = 0; i < this.events.length; i++)
        { signal.apply(null, this.events[i]); }
    };
  
    function visibleLines(display, doc, viewport) {
      var top = viewport && viewport.top != null ? Math.max(0, viewport.top) : display.scroller.scrollTop;
      top = Math.floor(top - paddingTop(display));
      var bottom = viewport && viewport.bottom != null ? viewport.bottom : top + display.wrapper.clientHeight;
  
      var from = lineAtHeight(doc, top), to = lineAtHeight(doc, bottom);
      // Ensure is a {from: {line, ch}, to: {line, ch}} object, and
      // forces those lines into the viewport (if possible).
      if (viewport && viewport.ensure) {
        var ensureFrom = viewport.ensure.from.line, ensureTo = viewport.ensure.to.line;
        if (ensureFrom < from) {
          from = ensureFrom;
          to = lineAtHeight(doc, heightAtLine(getLine(doc, ensureFrom)) + display.wrapper.clientHeight);
        } else if (Math.min(ensureTo, doc.lastLine()) >= to) {
          from = lineAtHeight(doc, heightAtLine(getLine(doc, ensureTo)) - display.wrapper.clientHeight);
          to = ensureTo;
        }
      }
      return {from: from, to: Math.max(to, from + 1)}
    }
  
  
    function updateDisplaySimple(syn, viewport) {
      var update = new DisplayUpdate(syn, viewport);
      if (updateDisplayIfNeeded(syn, update)) {
        updateHeightsInViewport(syn);
        postUpdateDisplay(syn, update);
        var barMeasure = measureForScrollbars(syn);
        updateSelection(syn);
        updateScrollbars(syn, barMeasure);
        setDocumentHeight(syn, barMeasure);
        update.finish();
      }
    }
  
    function paddingTop(display) {return display.lineSpace.offsetTop}
    function paddingVert(display) {return display.mover.offsetHeight - display.lineSpace.offsetHeight}
    function paddingH(display) {
      if (display.cachedPaddingH) { return display.cachedPaddingH }
      var e = removeChildrenAndAdd(display.measure, elt("pre", "x", "e-example-line-like"));
      var style = window.getComputedStyle ? window.getComputedStyle(e) : e.currentStyle;
      var data = {left: parseInt(style.paddingLeft), right: parseInt(style.paddingRight)};
      if (!isNaN(data.left) && !isNaN(data.right)) { display.cachedPaddingH = data; }
      return data
    }
  
    function scrollToCoords(syn, x, y) {
      if (x != null || y != null) { resolveScrollToPos(syn); }
      if (x != null) { syn.curOp.scrollLeft = x; }
      if (y != null) { syn.curOp.scrollTop = y; }
    }
  
    function scrollToRange(syn, range) {
      resolveScrollToPos(syn);
      syn.curOp.scrollToPos = range;
    }
  
    // When an operation has its scrollToPos property set, and another
    // scroll action is applied before the end of the operation, this
    // 'simulates' scrolling that position into view in a cheap way, so
    // that the effect of intermediate scroll commands is not ignored.
    function resolveScrollToPos(syn) {
      var range = syn.curOp.scrollToPos;
      if (range) {
        syn.curOp.scrollToPos = null;
        var from = estimateCoords(syn, range.from), to = estimateCoords(syn, range.to);
        scrollToCoordsRange(syn, from, to, range.margin);
      }
    }
  
    function scrollToCoordsRange(syn, from, to, margin) {
      var sPos = calculateScrollPos(syn, {
        left: Math.min(from.left, to.left),
        top: Math.min(from.top, to.top) - margin,
        right: Math.max(from.right, to.right),
        bottom: Math.max(from.bottom, to.bottom) + margin
      });
      scrollToCoords(syn, sPos.scrollLeft, sPos.scrollTop);
    }
  
    // Sync the scrollable area and scrollbars, ensure the viewport
    // covers the visible area.
    function updateScrollTop(syn, val) {
      // if (Math.abs(syn.doc.scrollTop - val) < 2) { return }
      if (!gecko) { updateDisplaySimple(syn, { top: val }); }
      setScrollTop(syn, val, true);
      if (gecko) { updateDisplaySimple(syn); }
      startWorker(syn, 100);
    }
  
    function setScrollTop(syn, val, forceScroll) {
      val = Math.max(0, Math.min(syn.display.scroller.scrollHeight - syn.display.scroller.clientHeight, val));
      if (syn.display.scroller.scrollTop == val && !forceScroll) { return }
      syn.doc.scrollTop = val;
      syn.display.scrollbars.setScrollTop(val);
      if (syn.display.scroller.scrollTop != val) { syn.display.scroller.scrollTop = val; }
    }
  
    // Sync scroller and scrollbar, ensure the gutter elements are
    // aligned.
    function setScrollLeft(syn, val, isScroller, forceScroll) {
      val = Math.max(0, Math.min(val, syn.display.scroller.scrollWidth - syn.display.scroller.clientWidth));
      if ((isScroller ? val == syn.doc.scrollLeft : Math.abs(syn.doc.scrollLeft - val) < 2) && !forceScroll) { return }
      syn.doc.scrollLeft = val;
      alignHorizontally(syn);
      if (syn.display.scroller.scrollLeft != val) { syn.display.scroller.scrollLeft = val; }
      syn.display.scrollbars.setScrollLeft(val);
    }
  
    // SCROLLBARS
  
    // Prepare DOM reads needed to update the scrollbars. Done in one
    // shot to minimize update/measure roundtrips.
    function measureForScrollbars(syn) {
      var d = syn.display, gutterW = d.gutters.offsetWidth;
      var docH = Math.round(syn.doc.height + paddingVert(syn.display));
      return {
        clientHeight: d.scroller.clientHeight,
        viewHeight: d.wrapper.clientHeight,
        scrollWidth: d.scroller.scrollWidth, clientWidth: d.scroller.clientWidth,
        viewWidth: d.wrapper.clientWidth,
        barLeft: syn.options.fixedGutter ? gutterW : 0,
        docHeight: docH,
        scrollHeight: docH + scrollGap(syn) + d.barHeight,
        nativeBarWidth: d.nativeBarWidth,
        gutterWidth: gutterW
      }
    }
  
    var NativeScrollbars = function (place, scroll, syn) {
      this.syn = syn;
      var vert = this.vert = elemt("div", [elemt("div", null, null, null, "min-width: 1px")], "e-example-vscrollbar");
      var horiz = this.horiz = elemt("div", [elemt("div", null, null, null, "height: 100%; min-height: 1px")], "e-example-hscrollbar");
      vert.tabIndex = horiz.tabIndex = -1;
      place(vert); place(horiz);
  
      on(vert, "scroll", function () {
        if (vert.clientHeight) { scroll(vert.scrollTop, "vertical"); }
      });
      on(horiz, "scroll", function () {
        if (horiz.clientWidth) { scroll(horiz.scrollLeft, "horizontal"); }
      });
  
      this.checkedZeroWidth = false;
      // Need to set a minimum width to see the scrollbar on IE7 (but must not set it on IE8).
      if (ie && ie_version < 8) { this.horiz.style.minHeight = this.vert.style.minWidth = "18px"; }
    };
  
    NativeScrollbars.prototype.update = function (measure) {
      var needsH = measure.scrollWidth > measure.clientWidth + 1;
      var needsV = measure.scrollHeight > measure.clientHeight + 1;
      var sWidth = measure.nativeBarWidth;
  
      if (needsV) {
        this.vert.style.display = "block";
        this.vert.style.bottom = needsH ? sWidth + "px" : "0";
        var totalHeight = measure.viewHeight - (needsH ? sWidth : 0);
        // A bug in IE8 can cause this value to be negative, so guard it.
        this.vert.firstChild.style.height =
          Math.max(0, measure.scrollHeight - measure.clientHeight + totalHeight) + "px";
      } else {
        this.vert.style.display = "";
        this.vert.firstChild.style.height = "0";
      }
  
      if (needsH) {
        this.horiz.style.display = "block";
        this.horiz.style.right = needsV ? sWidth + "px" : "0";
        this.horiz.style.left = measure.barLeft + "px";
        var totalWidth = measure.viewWidth - measure.barLeft - (needsV ? sWidth : 0);
        this.horiz.firstChild.style.width =
          Math.max(0, measure.scrollWidth - measure.clientWidth + totalWidth) + "px";
      } else {
        this.horiz.style.display = "";
        this.horiz.firstChild.style.width = "0";
      }
  
      if (!this.checkedZeroWidth && measure.clientHeight > 0) {
        if (sWidth == 0) { this.zeroWidthHack(); }
        this.checkedZeroWidth = true;
      }
  
      return { right: needsV ? sWidth : 0, bottom: needsH ? sWidth : 0 }
    };
  
    NativeScrollbars.prototype.setScrollLeft = function (pos) {
      if (this.horiz.scrollLeft != pos) { this.horiz.scrollLeft = pos; }
      if (this.disableHoriz) { this.enableZeroWidthBar(this.horiz, this.disableHoriz, "horiz"); }
    };
  
    NativeScrollbars.prototype.setScrollTop = function (pos) {
      if (this.vert.scrollTop != pos) { this.vert.scrollTop = pos; }
      if (this.disableVert) { this.enableZeroWidthBar(this.vert, this.disableVert, "vert"); }
    };
  
    NativeScrollbars.prototype.zeroWidthHack = function () {
      var w = mac && !mac_geMountainLion ? "12px" : "18px";
      this.horiz.style.height = this.vert.style.width = w;
      this.horiz.style.pointerEvents = this.vert.style.pointerEvents = "none";
      this.disableHoriz = new Delayed;
      this.disableVert = new Delayed;
    };
  
    NativeScrollbars.prototype.enableZeroWidthBar = function (bar, delay, type) {
      bar.style.pointerEvents = "auto";
      function maybeDisable() {
        // To find out whether the scrollbar is still visible, we
        // check whether the element under the pixel in the bottom
        // right corner of the scrollbar box is the scrollbar box
        // itself (when the bar is still visible) or its filler child
        // (when the bar is hidden). If it is still visible, we keep
        // it enabled, if it's hidden, we disable pointer events.
        var box = bar.getBoundingClientRect();
        var elt = type == "vert" ? document.elementFromPoint(box.right - 1, (box.top + box.bottom) / 2)
          : document.elementFromPoint((box.right + box.left) / 2, box.bottom - 1);
        if (elt != bar) { bar.style.pointerEvents = "none"; }
        else { delay.set(1000, maybeDisable); }
      }
      delay.set(1000, maybeDisable);
    };
  
    NativeScrollbars.prototype.clear = function () {
      var parent = this.horiz.parentNode;
      parent.removeChild(this.horiz);
      parent.removeChild(this.vert);
    };
  
    var NullScrollbars = function () { };
  
    NullScrollbars.prototype.update = function () { return { bottom: 0, right: 0 } };
    NullScrollbars.prototype.setScrollLeft = function () { };
    NullScrollbars.prototype.setScrollTop = function () { };
    NullScrollbars.prototype.clear = function () { };
  
    function updateScrollbars(syn, measure) {
      if (!measure) { measure = measureForScrollbars(syn); }
      var startWidth = syn.display.barWidth, startHeight = syn.display.barHeight;
      updateScrollbarsInner(syn, measure);
      for (var i = 0; i < 4 && startWidth != syn.display.barWidth || startHeight != syn.display.barHeight; i++) {
        if (startWidth != syn.display.barWidth && syn.options.lineWrapping) { updateHeightsInViewport(syn); }
        updateScrollbarsInner(syn, measureForScrollbars(syn));
        startWidth = syn.display.barWidth; startHeight = syn.display.barHeight;
      }
    }
  
    function updateCode(display) {
      var maxWidth = 0, width = 0;
      for (var i = 0;i < display.lineDiv.querySelectorAll('.e-example-line span.blank').length;i++) {
        width = display.lineDiv.querySelectorAll('.e-example-line span.blank')[i].getBoundingClientRect().width;
        if (maxWidth < width) {
          maxWidth = width;
        }
      }
      css(display.sizer, 'min-width: ' + toCssPx(maxWidth));
    }
  
    // Re-synchronize the fake scrollbars with the actual size of the
    // content.
    function updateScrollbarsInner(syn, measure) {
      var d = syn.display;
      var sizes = d.scrollbars.update(measure);
  
      d.sizer.style.paddingRight = (d.barWidth = sizes.right) + "px";
      d.sizer.style.paddingBottom = (d.barHeight = sizes.bottom) + "px";
      d.heightForcer.style.borderBottom = sizes.bottom + "px solid transparent";
  
      if (sizes.right && sizes.bottom) {
        d.scrollbarFiller.style.display = "block";
        d.scrollbarFiller.style.height = sizes.bottom + "px";
        d.scrollbarFiller.style.width = sizes.right + "px";
      } else { d.scrollbarFiller.style.display = ""; }
      if (sizes.bottom && syn.options.coverGutterNextToScrollbar && syn.options.fixedGutter) {
        d.gutterFiller.style.display = "block";
        d.gutterFiller.style.height = sizes.bottom + "px";
        d.gutterFiller.style.width = measure.gutterWidth + "px";
      } else { d.gutterFiller.style.display = ""; }
    }
  
    var scrollbarModel = { "native": NativeScrollbars, "null": NullScrollbars };
  
    function initScrollbars(syn) {
      if (syn.display.scrollbars) {
        syn.display.scrollbars.clear();
        if (syn.display.scrollbars.addClass) { rmClass(syn.display.wrapper, syn.display.scrollbars.addClass); }
      }
  
      syn.display.scrollbars = scrollbarModel[syn.options.scrollbarStyle](function (node) {
        syn.display.wrapper.insertBefore(node, syn.display.scrollbarFiller);
        // Prevent clicks in the scrollbars from killing focus
        on(node, "mousedown", function () {
          if (syn.state.focused) { setTimeout(function () { return syn.display.input.focus(); }, 0); }
        });
        node.setAttribute("syn-not-content", "true");
      }, function (pos, axis) {
        if (axis == "horizontal") { setScrollLeft(syn, pos); }
        else { updateScrollTop(syn, pos); }
      }, syn);
      //if (syn.display.scrollbars.addClass)
      //  { addClass(syn.display.wrapper, [syn.display.scrollbars.addClass]); }
    }
  
    // Operations are used to wrap a series of changes to the editor
    // state in such a way that each change won't have to update the
    // cursor and display (which would be awkward, slow, and
    // error-prone). Instead, display updates are batched and then all
    // combined and executed at once.
  
    var nextOpId = 0;
    // Start a new operation.
    function startOperation(syn) {
      syn.curOp = {
        syn: syn,
        viewChanged: false,      // Flag that indicates that lines might need to be redrawn
        startHeight: syn.doc.height, // Used to detect need to update scrollbar
        forceUpdate: false,      // Used to force a redraw
        updateInput: 0,       // Whether to reset the input textarea
        typing: false,           // Whether this reset should be careful to leave existing text (for compositing)
        changeObjs: null,        // Accumulated changes, for firing change events
        cursorActivityHandlers: null, // Set of handlers to fire cursorActivity on
        cursorActivityCalled: 0, // Tracks which cursorActivity handlers have been called already
        selectionChanged: false, // Whether the selection needs to be redrawn
        updateMaxLine: false,    // Set when the widest line needs to be determined anew
        scrollLeft: null, scrollTop: null, // Intermediate scroll position, not pushed to DOM yet
        scrollToPos: null,       // Used to scroll to a specific position
        focus: false,
        id: ++nextOpId           // Unique ID
      };
      pushOperation(syn.curOp);
    }
  
    // Finish an operation, updating the display and signalling delayed events
    function endOperation(syn) {
      var op = syn.curOp;
      if (op) {
        finishOperation(op, function (group) {
          for (var i = 0; i < group.ops.length; i++) { group.ops[i].syn.curOp = null; }
          endOperations(group);
        });
      }
    }
  
    // The DOM updates done when an operation finishes are batched so
    // that the minimum number of relayouts are required.
    function endOperations(group) {
      var ops = group.ops;
      for (var i = 0; i < ops.length; i++) // Read DOM
      { endOperation_R1(ops[i]); }
      for (var i$1 = 0; i$1 < ops.length; i$1++) // Write DOM (maybe)
      { endOperation_W1(ops[i$1]); }
      for (var i$2 = 0; i$2 < ops.length; i$2++) // Read DOM
      { endOperation_R2(ops[i$2]); }
      for (var i$3 = 0; i$3 < ops.length; i$3++) // Write DOM (maybe)
      { endOperation_W2(ops[i$3]); }
      for (var i$4 = 0; i$4 < ops.length; i$4++) // Read DOM
      { endOperation_finish(ops[i$4]); }
    }
  
    function endOperation_R1(op) {
      var syn = op.syn, display = syn.display;
      maybeClipScrollbars(syn);
      if (op.updateMaxLine) { findMaxLine(syn); }
  
      op.mustUpdate = op.viewChanged || op.forceUpdate || op.scrollTop != null ||
        op.scrollToPos && (op.scrollToPos.from.line < display.viewFrom ||
          op.scrollToPos.to.line >= display.viewTo) ||
        display.maxLineChanged && syn.options.lineWrapping;
      op.update = op.mustUpdate &&
        new DisplayUpdate(syn, op.mustUpdate && { top: op.scrollTop, ensure: op.scrollToPos }, op.forceUpdate);
    }
  
    function endOperation_W1(op) {
      op.updatedDisplay = op.mustUpdate && updateDisplayIfNeeded(op.syn, op.update);
    }
  
    function endOperation_R2(op) {
      var syn = op.syn, display = syn.display;
      if (op.updatedDisplay) { updateHeightsInViewport(syn); }
  
      op.barMeasure = measureForScrollbars(syn);
  
      // If the max line changed since it was last measured, measure it,
      // and ensure the document's width matches it.
      // updateDisplay_W2 will use these properties to do the actual resizing
      if (display.maxLineChanged && !syn.options.lineWrapping) {
        op.adjustWidthTo = measureChar(syn, display.maxLine, display.maxLine.text.length).left + 3;
        syn.display.sizerWidth = op.adjustWidthTo;
        op.barMeasure.scrollWidth =
          Math.max(display.scroller.clientWidth, display.sizer.offsetLeft + op.adjustWidthTo + scrollGap(syn) + syn.display.barWidth);
        op.maxScrollLeft = Math.max(0, display.sizer.offsetLeft + op.adjustWidthTo - displayWidth(syn));
      }
  
      if (op.updatedDisplay || op.selectionChanged) { op.preparedSelection = display.input.prepareSelection(); }
    }
  
    function endOperation_W2(op) {
      var syn = op.syn;
  
      if (op.adjustWidthTo != null) {
        syn.display.sizer.style.minWidth = op.adjustWidthTo + "px";
        if (op.maxScrollLeft < syn.doc.scrollLeft) { setScrollLeft(syn, Math.min(syn.display.scroller.scrollLeft, op.maxScrollLeft), true); }
        syn.display.maxLineChanged = false;
      }
  
      var takeFocus = op.focus && op.focus == activeElt();
      if (op.preparedSelection) { syn.display.input.showSelection(op.preparedSelection, takeFocus); }
      if (op.updatedDisplay || op.startHeight != syn.doc.height) { updateScrollbars(syn, op.barMeasure); }
      if (op.updatedDisplay) { setDocumentHeight(syn, op.barMeasure); }
  
      if (op.selectionChanged) { restartBlink(syn); }
  
      if (syn.state.focused && op.updateInput) { syn.display.input.reset(op.typing); }
      if (takeFocus) { ensureFocus(op.syn); }
    }
  
    function endOperation_finish(op) {
      var syn = op.syn, display = syn.display, doc = syn.doc;
  
      if (op.updatedDisplay) { postUpdateDisplay(syn, op.update); }
  
      // Abort mouse wheel delta measurement, when scrolling explicitly
      if (display.wheelStartX != null && (op.scrollTop != null || op.scrollLeft != null || op.scrollToPos)) { display.wheelStartX = display.wheelStartY = null; }
  
      // Propagate the scroll position to the actual DOM scroller
      if (op.scrollTop != null) { setScrollTop(syn, op.scrollTop, op.forceScroll); }
  
      if (op.scrollLeft != null) { setScrollLeft(syn, op.scrollLeft, true, true); }
      // If we need to scroll a specific position into view, do so.
      if (op.scrollToPos) {
        var rect = scrollPosIntoView(syn, clipPos(doc, op.scrollToPos.from),
          clipPos(doc, op.scrollToPos.to), op.scrollToPos.margin);
        maybeScrollWindow(syn, rect);
      }
  
      // Fire events for markers that are hidden/unidden by editing or
      // undoing
      var hidden = op.maybeHiddenMarkers, unhidden = op.maybeUnhiddenMarkers;
      if (hidden) {
        for (var i = 0; i < hidden.length; ++i) { if (!hidden[i].lines.length) { signal(hidden[i], "hide"); } }
      }
      if (unhidden) {
        for (var i$1 = 0; i$1 < unhidden.length; ++i$1) { if (unhidden[i$1].lines.length) { signal(unhidden[i$1], "unhide"); } }
      }
  
      if (display.wrapper.offsetHeight) { doc.scrollTop = syn.display.scroller.scrollTop; }
  
      // Fire change events, and delayed event handlers
      if (op.changeObjs) { signal(syn, "changes", syn, op.changeObjs); }
      if (op.update) { op.update.finish(); }
    }
  
    // Run the given function in an operation
    function runInOp(syn, f) {
      if (syn.curOp) { return f() }
      startOperation(syn);
      try { return f() }
      finally { endOperation(syn); }
    }
  
    // Wraps a function in an operation. Returns the wrapped function.
    function operation(syn, f) {
      return function () {
        if (syn.curOp) { return f.apply(syn, arguments) }
        startOperation(syn);
        try { return f.apply(syn, arguments) }
        finally { endOperation(syn); }
      }
    }
    
    // Used to add methods to editor and doc instances, wrapping them in
    // operations.
    function methodOp(f) {
      return function () {
        if (this.curOp) { return f.apply(this, arguments) }
        startOperation(this);
        try { return f.apply(this, arguments) }
        finally { endOperation(this); }
      }
    }
  
    function dosynethodOp(f) {
      return function () {
        var syn = this.syn;
        if (!syn || syn.curOp) { return f.apply(this, arguments) }
        startOperation(syn);
        try { return f.apply(this, arguments) }
        finally { endOperation(syn); }
      }
    }
  
    function Highlighter(place, options) {
      var this$1 = this;
      if (!(this instanceof Highlighter)) { return new Highlighter(place, options); }
      options = this$1.options = options ? copyObj(options) : {};
      copyObj(defaults, options, false);
      var doc = options.doc;
      /*if (typeof doc == "string") { doc = new Doc(doc, options.mode, null, options.lineSeparator, options.direction); }
      else if (options.mode) { doc.modeOption = options.mode; }
      this.doc = doc;*/
      var display = this$1.display = new Display(place, doc, options);
      display.wrapper.Highlighter = this$1;
      if (options.type == 'syntax') {
        initScrollbars(this$1);
        highlighterColorizer(display, doc, options);
      } else if (options.type == 'viewer') {
        this$1.iframeViewer = new Viewer(display, doc, options);
      }
  
      if (webkit && options.lineWrapping && getComputedStyle(display.lineDiv).textRendering == "optimizelegibility") { display.lineDiv.style.textRendering = "auto"; }
      registerEventHandlers(this$1);
      // ensureGlobalHandlers();
    }
  
    function registerEventHandlers(syn) {
      var d = syn.display;
      // on(d.scroller, "mousedown", operation(syn, onMouseDown));
      // Older IE's will not fire a second mousedown for a double click
      if (ie && ie_version < 11) {
        on(d.scroller, "dblclick", operation(syn, function (e) {
          if (signalDOMEvent(syn, e)) { return }
          var pos = posFromMouse(syn, e);
          if (!pos || clickInGutter(syn, e) || eventInWidget(syn.display, e)) { return }
          e_preventDefault(e);
          var word = syn.findWordAt(pos);
          extendSelection(syn.doc, word.anchor, word.head);
        }))
      }
      else { on(d.scroller, "dblclick", function (e) { return signalDOMEvent(syn, e) || e_preventDefault(e); }); }
      // Some browsers fire contextmenu *after* opening the menu, at
      // which point we can't mess with it anymore. Context menu is
      // handled in onMouseDown for these browsers.
      on(d.scroller, "contextmenu", function (e) { return onContextMenu(syn, e); });
      /*on(d.input.getField(), "contextmenu", function (e) {
        if (!d.scroller.contains(e.target)) { onContextMenu(syn, e); }
      });*/
  
      // Used to suppress mouse event handling when a touch happens
      var touchFinished, prevTouch = { end: 0 };
      function finishTouch() {
        if (d.activeTouch) {
          touchFinished = setTimeout(function () { return d.activeTouch = null; }, 1000);
          prevTouch = d.activeTouch;
          prevTouch.end = +new Date;
        }
      }
      function isMouseLikeTouchEvent(e) {
        if (e.touches.length != 1) { return false }
        var touch = e.touches[0];
        return touch.radiusX <= 1 && touch.radiusY <= 1
      }
      function farAway(touch, other) {
        if (other.left == null) { return true }
        var dx = other.left - touch.left, dy = other.top - touch.top;
        return dx * dx + dy * dy > 20 * 20
      }
      on(d.scroller, "touchstart", function (e) {
        if (!signalDOMEvent(syn, e) && !isMouseLikeTouchEvent(e) && !clickInGutter(syn, e)) {
          clearTimeout(touchFinished);
          var now = +new Date;
          d.activeTouch = {
            start: now, moved: false,
            prev: now - prevTouch.end <= 300 ? prevTouch : null
          };
          if (e.touches.length == 1) {
            d.activeTouch.left = e.touches[0].pageX;
            d.activeTouch.top = e.touches[0].pageY;
          }
        }
      });
      on(d.scroller, "touchmove", function () {
        if (d.activeTouch) { d.activeTouch.moved = true; }
      });
      on(d.scroller, "touchend", function (e) {
        var touch = d.activeTouch;
        if (touch && !eventInWidget(d, e) && touch.left != null &&
          !touch.moved && new Date - touch.start < 300) {
          var pos = syn.coordsChar(d.activeTouch, "page"), range;
          if (!touch.prev || farAway(touch, touch.prev)) // Single tap
          { range = new Range(pos, pos); }
          else if (!touch.prev.prev || farAway(touch, touch.prev.prev)) // Double tap
          { range = syn.findWordAt(pos); }
          else // Triple tap
          { range = new Range(Pos(pos.line, 0), clipPos(syn.doc, Pos(pos.line + 1, 0))); }
          syn.setSelection(range.anchor, range.head);
          syn.focus();
          e_preventDefault(e);
        }
        finishTouch();
      });
      on(d.scroller, "touchcancel", finishTouch);
  
      // Sync scrolling between fake scrollbars and real scrollable
      // area, ensure viewport is updated when scrolling.
      on(d.scroller, "scroll", function () {
        if (d.scroller.clientHeight) {
          updateScrollTop(syn, d.scroller.scrollTop);
          setScrollLeft(syn, d.scroller.scrollLeft, true);
          signal(syn, "scroll", syn);
        }
      });
  
      // Listen to wheel events in order to try and update the viewport on time.
      on(d.scroller, "mousewheel", function (e) { return onScrollWheel(syn, e); });
      on(d.scroller, "DOMMouseScroll", function (e) { return onScrollWheel(syn, e); });
  
      // Prevent wrapper from ever scrolling
      on(d.wrapper, "scroll", function () { return d.wrapper.scrollTop = d.wrapper.scrollLeft = 0; });
  
      on(d.link, 'click', function () {
        var ts = syn.options.result !== undefined ? syn.options.result : syn.options.doc;
        var pos = ts.search(/script/i);
        while (pos > 0) {
          ts = ts.substring(0,pos) + 'e' + ts.substr(pos,3) + 'e' + ts.substr(pos+3,3) + 'tag' + ts.substr(pos+6);
          pos = ts.search(/script/i);
        }
        d.formInput.value = ts.replaceAll(`
  `, 'ENEWLINE');
        d.form.action = syn.options.link;
        d.form.method = 'POST';
        d.form.acceptCharset = 'utf-8';
        d.form.submit();
      });
    }
  
    function gutterEvent(syn, e, type, prevent) {
      var mX, mY;
      if (e.touches) {
        mX = e.touches[0].clientX;
        mY = e.touches[0].clientY;
      } else {
        try { mX = e.clientX; mY = e.clientY; }
        catch(e$1) { return false }
      }
      if (mX >= Math.floor(syn.display.gutters.getBoundingClientRect().right)) { return false }
      if (prevent) { e_preventDefault(e); }
  
      var display = syn.display;
      var lineBox = display.lineDiv.getBoundingClientRect();
  
      if (mY > lineBox.bottom || !hasHandler(syn, type)) { return e_defaultPrevented(e) }
      mY -= lineBox.top - display.viewOffset;
  
      for (var i = 0; i < syn.display.gutterSpecs.length; ++i) {
        var g = display.gutters.childNodes[i];
        if (g && g.getBoundingClientRect().right >= mX) {
          var line = lineAtHeight(syn.doc, mY);
          var gutter = syn.display.gutterSpecs[i];
          signal(syn, type, syn, line, gutter.className, e);
          return e_defaultPrevented(e)
        }
      }
    }
  
    function clickInGutter(syn, e) {
      return gutterEvent(syn, e, "gutterClick", true)
    }
  
    var Init = { toString: function () { return "Highlighter.Init" } };
    var defaults = {};
    var optionHandlers = {};
    Highlighter.defaults = defaults;
    Highlighter.optionHandlers = optionHandlers;
  
    function defineOptions(Highlighter) {
      var optionHandlers = Highlighter.optionHandlers;
  
      function option(name, deflt, handle, notOnInit) {
        Highlighter.defaults[name] = deflt;
        if (handle) {
          optionHandlers[name] =
          notOnInit ? function (syn, val, old) { if (old != Init) { handle(syn, val, old); } } : handle;
        }
      }
  
      Highlighter.defineOption = option;
  
      // Passed to option handlers when there is no old value.
      Highlighter.Init = Init;
  
      option("scrollbarStyle", "native", function (syn) {
        initScrollbars(syn);
        updateScrollbars(syn);
        syn.display.scrollbars.setScrollTop(syn.doc.scrollTop);
        syn.display.scrollbars.setScrollLeft(syn.doc.scrollLeft);
      }, true);
      option("lineNumbers", false, function (syn, val) {
        syn.display.gutterSpecs = getGutters(syn.options.gutters, val);
        updateGutters(syn);
      }, true);
      option("firstLineNumber", 1, updateGutters, true);
      option("lineNumberFormatter", function (integer) { return integer; }, updateGutters, true);
      option("showCursorWhenSelecting", false, updateSelection, true);
  
      option("resetSelectionOnContextMenu", true);
      option("lineWiseCopyCut", true);
      option("pasteLinesPerSelection", true);
      option("selectionsMayTouch", false);
    }
  
    function syntax(element, options) {
      options.type = "syntax";
      options = options ? copyObj(options) : {};
  
      options.title = options.title || options.header;
      if (!element) { console.error('Highlighter.syntax: cannot get property of value of null element'); options.doc = 'Cannot get Element'; }
      else { options.doc = element.value || String(element.innerHTML) || String(element.innerText) || 'Empty Element'; }
      options.doc.replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot');
      if (options.doc == 'Empty Element') { console.warn('Highlighter.highlighterHelper: cannot be executed due to empty element'); }
      if (!options.tabindex && element.tabIndex) { options.tabindex = element.tabIndex; }
      if (!options.placeholder && element.placeholder) { options.placeholder = element.placeholder; }
      hide(element);
      var syn = Highlighter(function (node) { element.parentElement.insertBefore(node, element.nextSibling) }, options);
      return syn;
    }
  
    function view(element, options) {
      options.type = "viewer";
      options = options ? copyObj(options) : {};
  
      options.title = options.title || options.header;
      if (!element) { console.error('Highlighter.view: cannot get property of value of null element'); options.doc = 'Cannot get Element'; }
      else { options.doc = element.value || String(element.innerText) || String(element.innerHTML) || 'Empty Element'; }
      options.doc.replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot');
      if (options.doc == 'Empty Element') { console.warn('Highlighter.iframeViewer: cannot be executed due to empty element'); }
      if (!options.tabindex && element.tabIndex) { options.tabindex = element.tabIndex; }
      if (!options.placeholder && element.placeholder) { options.placeholder = element.placeholder; }
      hide(element);
      var syn = Highlighter(function (node) { element.parentElement.insertBefore(node, element.nextSibling) }, options);
      return syn;
    }
  
    function addLegacy(Highlighter) {
      Highlighter.scrollbarModel = scrollbarModel;
      Highlighter.highlighterHelper = highlighterHelper;
    }
  
    function addHighlighterMethods(Highlighter) {
      var optionHandlers = Highlighter.optionHandlers;
  
      var helpers = Highlighter.helpers = {};
  
      Highlighter.prototype = {
        constructor: Highlighter,
  
        coordsChar: function(coords, mode) {
          coords = fromCoordSystem(this, coords, mode || "page");
          return coordsChar(this, coords.left, coords.top)
        },
      };
    }
  
    Highlighter.version = '2.8';
  
    addLegacy(Highlighter);
    defineOptions(Highlighter);
    addHighlighterMethods(Highlighter);
  
    Highlighter.syntax = syntax;
    Highlighter.view = view;
    Highlighter.log = log;
    Highlighter.colocCode = highlighterHelper;
    // Highlighter.comply = comply;
  
    return Highlighter;
  
  })));
