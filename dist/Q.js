/**
 * Q.js v0.0.0
 * Inspired from vue.js
 * (c) 2015 Daniel Yang
 * Released under the MIT License.
 * from: http://kangax.github.io/compat-table/es5
 * We can find almost all es5 features have been supported after IE9,
 * so we suggest under IE8 just use:
 * https://github.com/es-shims/es5-shim
 */

(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("jquery"));
	else if(typeof define === 'function' && define.amd)
		define(["jquery"], factory);
	else if(typeof exports === 'object')
		exports["Q"] = factory(require("jquery"));
	else
		root["Q"] = factory(root["jquery"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_6__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(1),
	    Data = __webpack_require__(2),
	    parse = __webpack_require__(3),
	    MARK = /\{\{(.+?)\}\}/,
	    mergeOptions = __webpack_require__(4).mergeOptions,
	    _doc = document;


	function _checkQ(el) {
	    var atts = el.attributes, i = 0 , l = atts.length;
	    for (; i < l; i++) {
	        if (atts[i].name.indexOf('q-') === 0) return true;
	    }
	    return false;
	}

	function _checkRepeat(el) {
	    return el.hasAttribute('q-repeat');
	}

	function _findQ(el) {
	    var atts = el.attributes, i = 0 , l = atts.length, res = [];
	    for (; i < l; i++) {
	        if (atts[i].name.indexOf('q-') === 0) {
	            res.push({
	                name: atts[i].name,
	                value: atts[i].value
	            });
	        }
	    }
	    return res;
	}

	function _walk($el, cb, ingoreRepeat) {
	    var arg;
	    for (var el, i = 0; el = $el[i++];) {
	        if (el.nodeType === 1 && _checkQ(el)) cb(el);
	        if (el.childNodes.length && ingoreRepeat ? !_checkRepeat(el) : true) _walk(el.childNodes, cb);
	    }
	}

	function _inDoc(ele) {
	    return _.contains(_doc.documentElement, ele);
	}

	function Q(options) {
	    this._init(options);
	}
	Q.options = {
	    directives: __webpack_require__(5)
	};
	Q.get = function (selector) {
	    var ele = _.find(selector)[0];
	    if (ele) {
	        return _.data(ele, 'QI');
	    } else {
	        return null;
	    }
	};
	Q.all = function (options) {
	    return _.find(options.el).map(function (ele) {
	        return new Q(_.extend(options, { el: ele }));
	    });
	};
	_.extend(Q.prototype, {
	    _init: function (options) {
	        options = options || {};
	        this.$el = options.el &&
	                typeof options.el === 'string' ?
	                    _.find(options.el)[0] :
	                    options.el;
	        // element references
	        this.$$ = {};
	        // merge options
	        options = this.$options = mergeOptions(
	            this.constructor.options,
	            options,
	            this
	        );
	        // lifecycle state
	        this._isCompiled = false;
	        this._isAttached = false;
	        this._isReady = false;
	        // events bookkeeping
	        this._events = {};
	        this._watchers = {};
	        Data.call(this, options);
	        // this._data = options.data;
	        // initialize data and scope inheritance.
	        this._initScope();
	        // call created hook
	        this._callHook('created')
	        // start compilation
	        if (this.$el) {
	            // cache the instance
	            _.data(this.$el, 'QI', this);
	            this.$mount(this.$el);
	        }
	    },

	    /**
	     * Set data and Element value
	     *
	     * @param {String} key
	     * @param {*} value
	     * @returns {Data}
	     */
	    data: function (key, value) {
	        var i = 0, l, data = this;
	        if (~key.indexOf('.')) {
	            var keys = key.split('.');
	            for (l = keys.length; i < l - 1; i++) {
	                key = keys[i];
	                // key is number
	                if (+key + '' === key) key = +key;
	                data = data[key];
	            }
	        }
	        l && (key = keys[i]);
	        if (value === undefined) return data[key];
	        data.$set(key, value);
	    },
	    /**
	     * Listen on the given `event` with `fn`.
	     *
	     * @param {String} event
	     * @param {Function} fn
	     */
	    $on: function (event, fn) {
	        (this._events[event] || (this._events[event] = []))
	            .push(fn);
	        return this;
	    },
	    /**
	     * Adds an `event` listener that will be invoked a single
	     * time then automatically removed.
	     *
	     * @param {String} event
	     * @param {Function} fn
	     */
	    $once: function (event, fn) {
	        var self = this;
	        function on() {
	            self.$off(event, on);
	            fn.apply(this, arguments);
	        }
	        on.fn = fn;
	        this.$on(event, on);
	        return this;
	    },

	    /**
	     * Remove the given callback for `event` or all
	     * registered callbacks.
	     *
	     * @param {String} event
	     * @param {Function} fn
	     */

	    $off: function (event, fn) {
	        var cbs, cb, i;
	        // all event
	        if (!arguments.length) {
	            this._events = {};
	            return this;
	        }
	        // specific event
	        cbs = this._events[event];
	        if (!cbs) {
	            return this;
	        }
	        if (arguments.length === 1) {
	            this._events[event] = null;
	            return this;
	        }
	        // specific handler
	        i = cbs.length;
	        while (i--) {
	            cb = cbs[i];
	            if (cb === fn || cb.fn === fn) {
	                cbs.splice(i, 1);
	                break;
	            }
	        }
	        return this;
	    },
	    /**
	     * Watch an expression, trigger callback when its
	     * value changes.
	     *
	     * @param {String} exp
	     * @param {Function} cb
	     * @param {Boolean} [deep]
	     * @param {Boolean} [immediate]
	     * @return {Function} - unwatchFn
	     */
	    $watch: function (exp, cb, deep, immediate) {
	        var key = deep ? exp + '**deep**' : exp;
	        (this._watchers[key] || (this._watchers[key] = []))
	            .push(cb);
	        immediate && cb(this.data(exp));
	        return this;
	    },
	    /**
	     * Trigger an event on self.
	     *
	     * @param {String} event
	     */
	    $emit: function (event) {
	        this._emit.apply(this, arguments);
	        // emit data change
	        if (event.indexOf('data:') === 0) {
	            var args = _.slice.call(arguments, 1);
	            args.unshift(event.substring(5));
	            this._callDataChange.apply(this, args);
	        }
	        return this;
	    },

	    _emit: function (key) {
	        var cbs = this._events[key];
	        if (cbs) {
	            var i = arguments.length - 1,
	                args = new Array(i);
	            while (i--) {
	                args[i] = arguments[i + 1];
	            }
	            i = 0
	            cbs = cbs.length > 1 ?
	                _.slice.call(cbs, 0) :
	                cbs;
	            for (var l = cbs.length; i < l; i++) {
	                cbs[i].apply(this, args);
	            }
	        }
	    },

	    _clearWatch: function (namespace) {
	        namespace = namespace + '.';
	        var key;
	        for (key in this._watchers) {
	            if (~key.indexOf(namespace)) {
	                this._watchers[key].length = 0;
	            }
	        }
	    },

	    _callDataChange: function (key) {
	        var keys = key.split('.'),
	            self = { _events: this._watchers },
	            args = _.slice.call(arguments, 1),
	            _emit = this._emit, key;
	        args.unshift(key);
	        // TODO It must use a better way
	        if (args[1] instanceof Data && 'length' in args[1]) this._clearWatch(key);
	        _emit.apply(self, args);
	        for (; keys.length > 0;) {
	            key = keys.join('.');
	            args[0] = key + '**deep**';
	            args[1] = this.data(key);
	            _emit.apply(self, args);
	            keys.pop();
	        }
	    },
	    /**
	     * Setup the scope of an instance, which contains:
	     * - observed data
	     * - computed properties
	     * - user methods
	     * - meta properties
	     */
	    _initScope: function () {
	        this._initMethods();
	    },

	    /**
	     * Setup instance methods. Methods must be bound to the
	     * instance since they might be called by children
	     * inheriting them.
	     */
	    _initMethods: function () {
	        var methods = this.$options.methods, key;
	        if (methods) {
	            for (key in methods) {
	                this[key] = methods[key].bind(this);
	            }
	        }
	    },

	    /**
	     * Set instance target element and kick off the compilation
	     * process. The passed in `el` can be a template string, an
	     * existing Element, or a DocumentFragment (for block
	     * instances).
	     *
	     * @param {String|Element|DocumentFragment} el
	     * @public
	     */
	    $mount: function (el) {
	        if (this._isCompiled) {
	            return _.warn('$mount() should be called only once');
	        }
	        if (typeof el === 'string') {
	            // TODO for template
	        }
	        this._compile(el);
	        this._isCompiled = true;
	        this._callHook('compiled');
	        if (_inDoc(this.$el)) {
	            this._callHook('attached');
	            this._ready();
	        } else {
	            this.$once('hook:attached', this._ready);
	        }
	    },

	    /**
	     * ready
	     */
	    _ready: function () {
	        this._isAttached = true;
	        this._isReady = true;
	        this._callHook('ready');
	    },
	    /**
	     * Transclude, compile and link element.
	     *
	     * If a pre-compiled linker is available, that means the
	     * passed in element will be pre-transcluded and compiled
	     * as well - all we need to do is to call the linker.
	     *
	     * Otherwise we need to call transclude/compile/link here.
	     *
	     * @param {Element} el
	     * @return {Element}
	     */
	    _compile: function (el) {
	        this.transclue(el, this.$options);
	    },
	    /**
	     * Process an element or a DocumentFragment based on a
	     * instance option object. This allows us to transclude
	     * a template node/fragment before the instance is created,
	     * so the processed fragment can then be cloned and reused
	     * in v-repeat.
	     *
	     * @param {Element} el
	     * @param {Object} options
	     * @return {Element|DocumentFragment}
	     */
	    transclue: function (el, options) {
	        // static template bind
	        if (_.find('.q-mark', el).length) {
	            this._renderedBind(el, options);
	        } else {
	            this._templateBind(el, options);
	        }
	    },

	    /**
	     * bind rendered template
	     */
	    _templateBind: function (el, options) {
	        var self = this, directives = self.$options.directives;
	        _walk([el], function (node, arg) {
	            _findQ(node).forEach(function (obj) {
	                var name = obj.name.substring(2),
	                    directive = directives[name],
	                    descriptors = parse(obj.value);
	                if (directive) {
	                    descriptors.forEach(function (descriptor) {
	                        var readFilters = self._makeReadFilters(descriptor.filters),
	                            key = descriptor.target,
	                            update = directive.update || directive;
	                        descriptor.el = node;
	                        descriptor.vm = self;
	                        descriptor.filters = readFilters;
	                        directive.unwatch || self.$watch(key, function (value) {
	                            value = self.applyFilters(value, readFilters);
	                            update.call(descriptor, value);
	                        }, typeof self[key] === 'object', self[key] !== undefined);
	                        if (isObject(directive) && directive.bind) directive.bind.call(descriptor);
	                    });
	                }
	                switch (name) {
	                    case 'repeat':
	                        descriptors.forEach(function (descriptor) {
	                            var key = descriptor.target,
	                                readFilters = self._makeReadFilters(descriptor.filters),
	                                repeats = [],
	                                tpl = node, ref = document.createComment('q-repeat');
	                            node.parentNode.replaceChild(ref, tpl);
	                            readFilters.push(function (arr) {
	                                if (repeats.length) {
	                                    repeats.forEach(function (node) {
	                                        node.parentNode.removeChild(node);
	                                    });
	                                    _.clearData(repeats);
	                                    repeats.length = 0;
	                                }
	                                var fragment = _doc.createDocumentFragment(),
	                                    itemNode;
	                                arr.forEach(function (obj, i) {
	                                    itemNode = _.clone(tpl);
	                                    self._buildNode(itemNode, obj, { key: key, namespace: obj.$namespace() });
	                                    repeats.push(itemNode);
	                                    fragment.appendChild(itemNode);
	                                });
	                                ref.parentNode.insertBefore(fragment, ref);
	                            });
	                            self.$watch(key, function (value) {
	                                setTimeout(function () {
	                                    self.applyFilters(value, readFilters);
	                                }, 0);
	                            }, false, true);
	                        });
	                        break;
	                }
	            });
	        });
	    },

	    _buildNode: function (node, data, options) {
	        var self = this,
	            key = options.key,
	            index = options.index,
	            namespace = options.namespace
	            directives = self.$options.directives;
	        _walk([node], function (node, arg) {
	            _findQ(node).forEach(function (obj) {
	                var name = obj.name.substring(2),
	                    directive = directives[name],
	                    descriptors = parse(obj.value);
	                if (directive) {
	                    descriptors.forEach(function (descriptor) {
	                        var readFilters = self._makeReadFilters(descriptor.filters),
	                            key = descriptor.target,
	                            update = directive.update || directive;
	                        descriptor.el = node;
	                        descriptor.vm = self;
	                        descriptor.filters = readFilters;
	                        descriptor.namespace = namespace;
	                        directive.unwatch || self.$watch(namespace + '.' + key, function (value) {
	                            value = self.applyFilters(value, readFilters);
	                            update.call(descriptor, value);
	                        }, typeof data[key] === 'object', data[key] !== undefined);
	                        if (isObject(directive) && directive.bind) directive.bind.call(descriptor);
	                    });
	                }
	            });
	        });
	    },

	    /**
	     * bind rendered template
	     */
	    _renderedBind: function (el, options) {
	        var self = this;
	    },

	    /**
	     * Trigger all handlers for a hook
	     *
	     * @param {String} hook
	     */
	    _callHook: function (hook) {
	        var handlers = this.$options[hook];
	        if (handlers) {
	            for (var i = 0, j = handlers.length; i < j; i++) {
	                handlers[i].call(this);
	            }
	        }
	        this.$emit('hook:' + hook);
	    },

	    _makeReadFilters: function (names) {
	        if (!names.length) return [];
	        var filters = this.$options.filters,
	            self = this;
	        return names.map(function (name) {
	            var args = name.split(' '),
	                reader;
	            name = args.shift();
	            reader = (filters[name] ? (filters[name].read || filters[name]) : _.through);
	            return function (value) {
	                return args ?
	                    reader.apply(self, [value].concat(args)) :
	                        reader.call(self, value);
	            };
	        });
	    },

	    /**
	     * Apply filters to a value
	     *
	     * @param {*} value
	     * @param {Array} filters
	     * @param {*} oldVal
	     * @return {*}
	     */
	    applyFilters: function (value, filters, oldVal) {
	        if (!filters || !filters.length) {
	            return value;
	        }
	        for (var i = 0, l = filters.length; i < l; i++) {
	            value = filters[i].call(this, value, oldVal);
	        }
	        return value;
	    }
	});

	_.extend(Q.prototype, Data.prototype);

	module.exports = Q;


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var $ = __webpack_require__(6),
	    noop = function () {};

	module.exports = {
	    find: $.find,
	    contains: $.contains,
	    data: $.data,
	    cleanData: $.cleanData,
	    add: $.event.add,
	    remove: $.event.remove,
	    clone: $.clone,
	    extend: $.extend,
	    slice: [].slice,
	    noop: noop,
	    /**
	     * Add class with compatibility for IE & SVG
	     *
	     * @param {Element} el
	     * @param {Strong} cls
	     */
	    addClass: function (el, cls) {
	        if (el.classList) {
	            el.classList.add(cls);
	        } else {
	            var cur = ' ' + (el.getAttribute('class') || '') + ' ';
	            if (cur.indexOf(' ' + cls + ' ') < 0) {
	                el.setAttribute('class', trim((cur + cls)));
	            }
	        }
	    },
	    /**
	     * Remove class with compatibility for IE & SVG
	     *
	     * @param {Element} el
	     * @param {Strong} cls
	     */
	    removeClass: function (el, cls) {
	        if (el.classList) {
	            el.classList.remove(cls);
	        } else {
	            var cur = ' ' + (el.getAttribute('class') || '') + ' ',
	                tar = ' ' + cls + ' ';
	            while (cur.indexOf(tar) >= 0) {
	                cur = cur.replace(tar, ' ');
	            }
	            el.setAttribute('class', trim(cur));
	        }
	    },
	    through: function (s) { return s; },
	    warn: function () {
	        return (window.console && console.error) ? function (msg) {
	                console.error(msg);
	            } : noop;
	    },
	    isObject: function (o) {
	        return typeof o === 'object';
	    }
	};


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(1);

	/**
	 * prefix data
	 */
	function _prefix(up, key, value) {
	    if (+key + '' === key) key = +key;
	    var options = {
	        data: value,
	        up: up,
	        top: up._top,
	        namespace: [up._namespace, key].join('.')
	    };
	    up[key] =
	        (typeof value === 'object' && value !== null) ?
	            _isArray(value) ?
	                new DataArray(options) :
	                    new Data(options) :
	            value;
	}

	function _isArray(obj) {
	    return Array.isArray(obj) || obj instanceof DataArray;
	}

	/**
	 * Data
	 * @class
	 * @param {Object} options
	 */
	function Data(options) {
	    var data = options.data,
	        keys = Object.keys(options.data)
	            .filter(function (key) { return key.indexOf('_') !== 0; }),
	        self = this;
	    _.extend(this, data);

	    // all key need to traverse
	    this._keys = keys;
	    // parent data container
	    this._up = options.up;
	    // the most top parent data container
	    this._top = options.top || this;
	    // the namespace of data
	    this._namespace = options.namespace || '';
	    keys.forEach(function (key) {
	        _prefix(self, key, data[key]);
	    });
	    // if it is a array
	    Array.isArray(data) ?
	        // fix the length
	        (this.length = keys.length) :
	        // if it is a DataArray Object
	        data instanceof DataArray &&
	            // the length should be keys.length - 1
	            (this.length = keys.length - 1);
	}
	_.extend(Data.prototype, {
	    /**
	     * get the namespace
	     */
	    $namespace: function (key) {
	        return (
	            key !== undefined ?
	                [this._namespace, key].join('.') :
	                this._namespace
	        ).substring(1);
	    },
	    /**
	     * set the value of the key
	     */
	    $set: function (key, value) {
	        _prefix(this, key, value);
	        this._top.$emit('data:' + this.$namespace(key), this[key]);
	        return this;
	    },
	    /**
	     * get the actual value
	     */
	    $get: function () {
	        var res, keys = this._keys, self = this;
	        if (this instanceof Data) {
	            res = {};
	        } else {
	            res = [];
	        }
	        keys.forEach(function (key) {
	            res[key] = self[key].$get ?
	                self[key].$get() :
	                self[key];
	        });
	        return res;
	    }
	});

	function DataArray(options) {
	    Data.call(this, options);
	}
	_.extend(DataArray.prototype, Data.prototype, {
	    /**
	     * push data
	     */
	    push: function (value) {
	        _prefix(this, this.length, value);
	        this._keys.push(this.length);
	        this.length++;
	        this._top.$emit('data:' + this.$namespace(), this);
	        return this;
	    },
	    /**
	     * pop data
	     */
	    pop: function () {
	        var res = this[--this.length];
	        this[this.length] = null;
	        delete this[this.length];
	        this._keys.pop();
	        this._top.$emit('data:' + this.$namespace(), this);
	        return res;
	    },
	    /**
	     * unshift
	     */
	    unshift: function (value) {
	        this._keys.push(this.length);
	        this.length++;
	        for (var l = this.length; l--;) {
	            this[l] = this[l - 1];
	        }
	        _prefix(this, 0, value);
	        this._top.$emit('data:' + this.$namespace(), this);
	        return this;
	    },
	    /**
	     * shift
	     */
	    shift: function () {
	        this.length--;
	        var res = this[0];
	        for (var i = 0, l = this.length; i < l; i++) {
	            this[i] = this[i + 1];
	        }
	        this._keys.pop();
	        this._top.$emit('data:' + this.$namespace(), this);
	        return res;
	    },
	    /**
	     * touch
	     */
	    touch: function (key) {
	        this._top.$emit('data:' + this.$namespace(key), this);
	    },
	    /**
	     * indexOf
	     */
	    indexOf: function (item) {
	        for (var i = 0, l = this.length; i < l; i++) {
	            if (this[i] === item) return i;
	        }
	        return -1;
	    },
	    /**
	     * splice
	     */
	    splice: function (i, l /**, items support later **/) {
	        for (var j = 0, k = l + i, z = this.length - l; i < z; i++, j++) {
	            this[i] = this[k + j];
	            this[i]._namespace = this[i]._namespace.replace(/\.(\d+?)$/, '.' + i);
	        }
	        for (;i < this.length; i++) {
	            this[i] = null;
	            delete this[i];
	        }
	        this.length -= l;
	        this._keys.splice(this.length, l);
	        this._top.$emit('data:' + this.$namespace(), this);
	    },
	    /**
	     * forEach
	     */
	    forEach: function (foo) {
	        for (var i = 0, l = this.length; i < l; i++) {
	            foo(this[i], i);
	        }
	    },
	    /**
	     * filter
	     */
	    filter: function (foo) {
	        var res = [];
	        this.forEach(function (item, i) {
	            if (foo(item)) res.push(item);
	        });
	        return res;
	    }
	});

	module.exports = Data;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * click: onclick | filter1 | filter2
	 * click: onclick , keydown: onkeydown
	 * value1 | filter1 | filter2
	 * value - 1 | filter1 | filter2   don't support
	 */
	function parse(str) {
	    var exps = str.trim().split(/ *\, */),
	        eventReg = /^([\w\-]+)\:/,
	        keyReg = /^[\w\-]+$/,
	        arr = [];
	    exps.forEach(function (exp) {
	        var res = {},
	            match = exp.match(eventReg),
	            filters, exp;
	        if (match) {
	            res.arg = match[1];
	            exp = exp.substring(match[0].length).trim();
	        }
	        filters = exp.split(/ *\| */);
	        exp = filters.shift();
	        if (keyReg.test(exp)) {
	            res.target = exp;
	        } else {
	            res.exp = exp;
	        }
	        res.filters = filters;
	        arr.push(res);
	    });
	    return arr;
	}

	module.exports = parse;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(1);

	var strats = {};
	strats.created =
	strats.ready =
	strats.attached =
	strats.detached =
	strats.compiled =
	strats.beforeDestroy =
	strats.destroyed =
	strats.paramAttributes = function (parentVal, childVal) {
	    return childVal ?
	        parentVal ?
	            parentVal.concat(childVal) :
	                Array.isArray(childVal) ?
	                    childVal :
	                        [childVal] :
	        parentVal;
	};
	strats.methods =
	strats.directives = function (parentVal, childVal) {
	  if (!childVal) return parentVal;
	  if (!parentVal) return childVal;
	  return _.extend({}, parentVal, childVal);
	}

	var defaultStrat = function (parentVal, childVal) {
	    return childVal === undefined ?
	        parentVal :
	        childVal;
	};

	/**
	 * Option overwriting strategies are functions that handle
	 * how to merge a parent option value and a child option
	 * value into the final value.
	 *
	 * All strategy functions follow the same signature:
	 *
	 * @param {*} parentVal
	 * @param {*} childVal
	 * @param {Vue} [vm]
	 */
	function mergeOptions(parent, child, vm) {
	    var options = {}, key;
	    for (key in parent) {
	        merge(key);
	    }
	    for (key in child) {
	        if (!(parent.hasOwnProperty(key))) {
	            merge(key);
	        }
	    }
	    function merge(key) {
	        var strat = strats[key] || defaultStrat;
	        options[key] = strat(parent[key], child[key], vm, key);
	    }
	    return options;
	}

	module.exports = {
	    strats: strats,
	    mergeOptions: mergeOptions
	}


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(1);

	module.exports = {
	    show: function (value) {
	        var el = this.el;
	        if (value) el.style.display = 'block';
	        else el.style.display = 'none';
	    },
	    'class': function (value) {
	        var el = this.el,
	            arg = options.arg;
	        value ?
	            _.addClass(el, arg) :
	            _.removeClass(el, arg);
	    },
	    value: function (value) {
	        var el = this.el;
	        if (el.type === 'checkbox') {
	            el.checked = value;
	        } else {
	            el.value = value;
	        }
	    },
	    text: function (value) {
	        this.el.innerText = value;
	    },
	    on: {
	        unwatch: true,
	        bind: function () {
	            var key = this.target || this.exp.match(/^[\w\-]+/)[0],
	                expression = this.exp,
	                filters = this.filters,
	                vm = this.vm,
	                handler = vm.applyFilters(this.vm[key], filters),
	                data = this.namespace ?
	                    vm.data(namespace) :
	                    vm;
	            _.add(this.el, this.arg, function (e) {
	                if (!handler || typeof handler !== 'function') {
	                    return _.warn('You need implement the ' + key + ' method.');
	                }
	                expression ?
	                    handler.call(vm, data) :
	                    handler.apply(vm, arguments);
	            });
	        }
	    },
	    model: {
	        bind: function () {
	            var key = this.target,
	                namespace = this.namespace || '',
	                el = this.el,
	                vm = this.vm;
	            _.add(node, 'input onpropertychange change', function (e) {
	                vm.data(namespace).$set(key, el.value);
	            });
	        },
	        update: function (value) {
	            el.value = value;
	        }
	    }
	};


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_6__;

/***/ }
/******/ ])
});
