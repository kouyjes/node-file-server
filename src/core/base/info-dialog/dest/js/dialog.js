/* dialog */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (factory((global.HERE = global.HERE || {}, global.HERE.UI = global.HERE.UI || {})));
}(this, (function (exports) { 'use strict';

function __extends(d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var nextFrame = window.requestAnimationFrame || window['webkitRequestAnimationFrame'] || window['mozRequestAnimationFram'] || function (executor) {
    return setTimeout(executor, 1000 / 60);
};
var cancelFrame = window.cancelAnimationFrame || window['webkitCancelAnimationFrame'] || window['mozCancelAnimationFrame'] || clearTimeout;
var util;
(function (util) {
    util.namespaces = {
        svg: 'http://www.w3.org/2000/svg',
        xhtml: 'http://www.w3.org/1999/xhtml',
        xlink: 'http://www.w3.org/1999/xlink',
        xml: 'http://www.w3.org/XML/1998/namespace',
        xmlns: 'http://www.w3.org/2000/xmlns/'
    };
    function isDefined(value) {
        return value !== undefined;
    }
    util.isDefined = isDefined;
    function isNumber(value) {
        return typeof value === 'number';
    }
    util.isNumber = isNumber;
    function valueOf(value, defaultValue) {
        if (defaultValue === void 0) { defaultValue = value; }
        return isDefined(value) ? value : defaultValue;
    }
    util.valueOf = valueOf;
    function isFunction(fn) {
        return typeof fn === 'function';
    }
    util.isFunction = isFunction;
    function createSvgElement(qualifiedName) {
        var namespaceURI = util.namespaces.svg;
        return document.createElementNS(namespaceURI, qualifiedName);
    }
    util.createSvgElement = createSvgElement;
    function createElement(qualifiedName) {
        var el = document.createElement(qualifiedName);
        return el;
    }
    util.createElement = createElement;
    function preAppend(parent, element) {
        var children = parent.children;
        if (children && children.length > 0) {
            parent.insertBefore(element, children[0]);
        }
        else if (parent.firstChild) {
            parent.insertBefore(element, parent.firstChild);
        }
        else {
            parent.appendChild(element);
        }
    }
    util.preAppend = preAppend;
    function toggleVisible(el, visible) {
        var className = 'active';
        toggleClass(el, className, visible);
    }
    util.toggleVisible = toggleVisible;
    function toggleSelect(el, select) {
        var className = 'selected';
        toggleClass(el, className, select);
    }
    util.toggleSelect = toggleSelect;
    function getClassNames(el) {
        var clazz = el.getAttribute('class') || '';
        var classNames = clazz.split(/\s+/);
        return classNames;
    }
    function addClass(el, className) {
        className = className.trim();
        var classNames = getClassNames(el);
        if (classNames.indexOf(className) >= 0) {
            return;
        }
        classNames.push(className);
        el.setAttribute('class', classNames.join(' '));
    }
    util.addClass = addClass;
    function removeClass(el, className) {
        className = className.trim();
        var classNames = getClassNames(el);
        var index = classNames.indexOf(className);
        if (index >= 0) {
            classNames.splice(index, 1);
        }
        el.setAttribute('class', classNames.join(' '));
    }
    util.removeClass = removeClass;
    function hasClass(el, className) {
        className = className.trim();
        var classNames = getClassNames(el);
        return classNames.indexOf(className) >= 0;
    }
    util.hasClass = hasClass;
    function toggleClass(el, className, addOrRemove) {
        if (addOrRemove === void 0) {
            addOrRemove = !hasClass(el, className);
        }
        if (addOrRemove) {
            addClass(el, className);
        }
        else {
            removeClass(el, className);
        }
    }
    util.toggleClass = toggleClass;
    function style(el, name, value) {
        var style = el.style;
        if (isObject(name)) {
            Object.keys(name).forEach(function (key) {
                if (key in style) {
                    style[key] = name[key];
                }
            });
        }
        else if (isString(name)) {
            if (value === undefined) {
                return style[name];
            }
            style[name] = value;
        }
    }
    util.style = style;
    
    function parent(target) {
        return target.parentElement || target.parentNode;
    }
    util.parent = parent;
    function removeElement(target) {
        if (isFunction(target.remove)) {
            return target.remove();
        }
        var p = parent(target);
        if (p) {
            p.removeChild(target);
        }
    }
    util.removeElement = removeElement;
    function isObject(value) {
        return typeof value === 'object' && null != value;
    }
    util.isObject = isObject;
    function isString(value) {
        return typeof value === 'string';
    }
    util.isString = isString;
    function isEventSupport(eventType) {
        return 'on' + eventType in document;
    }
    util.isEventSupport = isEventSupport;
    
    var timeoutCache = {};
    function delayExecute(identifyName, fn) {
        if (timeoutCache[identifyName]) {
            cancelFrame(timeoutCache[identifyName]);
        }
        var timeout = nextFrame(fn);
        timeoutCache[identifyName] = timeout;
    }
    util.delayExecute = delayExecute;
})(util || (util = {}));

var windowId = 1;
var Window = (function () {
    function Window(option) {
        this.contentElements = [];
        this.assignOption(option, ['contentElements']);
        this.id = windowId++;
    }
    Window.prototype.elementSize = function (el) {
        var size = {
            width: el.offsetWidth,
            height: el.offsetHeight
        };
        return size;
    };
    Window.prototype.assignOption = function (option, keys, matchType) {
        var _this = this;
        if (keys === void 0) { keys = []; }
        if (matchType === void 0) { matchType = true; }
        keys.forEach(function (key) {
            if (!matchType || typeof _this[key] === typeof option[key]) {
                _this[key] = option[key];
            }
        });
    };
    Window.prototype.createWindow = function () {
        var el = util.createElement('div');
        util.addClass(el, 'h-window');
        util.addClass(el, 'h-visible');
        var panel = util.createElement('div');
        util.addClass(panel, 'h-panel');
        el.appendChild(panel);
        el.panel = panel;
        this.el = el;
    };
    Window.prototype.onceExecute = function (fn) {
        var executed = false;
        var _fn = function () {
            if (executed) {
                return;
            }
            executed = true;
            fn();
        };
        return _fn;
    };
    Window.prototype.parseNode = function (text) {
        if (typeof text === 'object' && this.isDomNode(text)) {
            return [text];
        }
        else if (typeof text === 'string') {
            var div = util.createElement('div');
            div.innerHTML = text;
            return Array.prototype.slice.call(div.childNodes);
        }
        throw new Error('invalid data !');
    };
    Window.prototype.isDomNode = function (object) {
        if (typeof object !== 'object') {
            return false;
        }
        return typeof object.nodeType !== void 0;
    };
    return Window;
}());

var Align;
(function (Align) {
    Align[Align["LEFT"] = 'left'] = "LEFT";
    Align[Align["RIGHT"] = 'right'] = "RIGHT";
    Align[Align["CENTER"] = 'center'] = "CENTER";
})(Align || (Align = {}));
var InfoDialogType;
(function (InfoDialogType) {
    InfoDialogType[InfoDialogType["INFO"] = 'info'] = "INFO";
    InfoDialogType[InfoDialogType["WARN"] = 'warn'] = "WARN";
    InfoDialogType[InfoDialogType["ERROR"] = 'error'] = "ERROR";
})(InfoDialogType || (InfoDialogType = {}));

var prefixes = ["webkit", "moz", "MS", "o"];
var alignClass = (_a = {},
    _a[Align.LEFT] = 'h-align-left',
    _a[Align.RIGHT] = 'h-align-right',
    _a[Align.CENTER] = 'h-align-center',
    _a
);
var InfoWindow = (function (_super) {
    __extends(InfoWindow, _super);
    function InfoWindow(option) {
        _super.call(this, option);
        this.autoRemove = true;
        this.autoRemoveTime = 2000;
        this.css = {};
        this._bottom = 0;
        this.align = Align.RIGHT;
        if (option.align in alignClass) {
            this.align = option.align;
        }
        this.assignOption(option, ['css', 'autoRemove', 'autoRemoveTime']);
    }
    InfoWindow.show = function (option) {
        var panel = new InfoWindow(option);
        panel.render();
        return panel;
    };
    InfoWindow.triggerRemoveEvent = function (align) {
        if (align === void 0) { align = Align.RIGHT; }
        util.delayExecute('triggerRemoveInfoPanelEvent_' + align, function () {
            var bottom = InfoWindow.startBottom, size;
            InfoWindow.instances[align].forEach(function (instance) {
                instance.updateBottom(bottom);
                size = instance.elementSize(instance.el);
                bottom += size.height;
            });
        });
    };
    InfoWindow.prototype.createWindow = function () {
        _super.prototype.createWindow.call(this);
        var panel = this.el;
        util.addClass(panel, 'h-window-info');
        util.addClass(panel.panel, alignClass[this.align]);
    };
    InfoWindow.prototype.render = function () {
        var instances = InfoWindow.instances[this.align];
        if (instances.indexOf(this) >= 0) {
            return;
        }
        this.createWindow();
        this.initContentElements();
        if (this.autoRemove) {
            this.triggerAutoRemove();
        }
        instances.push(this);
        this.updatePosition();
        this.initStyle();
        document.body.appendChild(this.el);
    };
    InfoWindow.prototype.initStyle = function () {
        var _this = this;
        var panel = this.el.panel;
        var style = panel.style;
        Object.keys(this.css).forEach(function (key) {
            if (key in style) {
                style[key] = _this.css[key];
            }
        });
    };
    InfoWindow.prototype.initContentElements = function () {
        var _this = this;
        var panel = this.el.panel;
        this.contentElements.forEach(function (element) {
            var nodes = _this.parseNode(element);
            nodes.forEach(function (node) {
                panel.appendChild(node);
            });
        });
    };
    InfoWindow.prototype.updatePosition = function () {
        var _this = this;
        var instances = InfoWindow.instances[this.align];
        var index = instances.length - 1;
        var bottom = InfoWindow.startBottom, size;
        for (var i = 0; i < index; i++) {
            size = this.elementSize(instances[i].el);
            bottom += size.height;
        }
        this.updateBottom(bottom);
        util.delayExecute('checkInfoPanelOverflow_' + this.id, function () {
            _this.checkOverflow();
        });
    };
    InfoWindow.prototype.checkOverflow = function () {
        var instances = InfoWindow.instances[this.align];
        if (instances.length === 0) {
            return;
        }
        var clientHeight = window['innerHeight'], size = this.elementSize(this.el);
        var removedInstances = [];
        var leftHeight = clientHeight - this._bottom;
        var i, _height = leftHeight;
        if (this._bottom + size.height >= clientHeight) {
            for (i = 0; i < instances.length; i++) {
                _height += this.elementSize(instances[i].el).height;
                removedInstances.push(instances[i]);
                if (_height >= size.height) {
                    break;
                }
            }
            instances.splice(0, i + 1);
            InfoWindow.overflowRemove(removedInstances, this.align);
        }
    };
    InfoWindow.prototype.updateBottom = function (bottom) {
        if (bottom === void 0) { bottom = 0; }
        this.el.style.bottom = bottom + 'px';
        this._bottom = bottom;
    };
    InfoWindow.prototype.triggerAutoRemove = function () {
        var _this = this;
        var onceExecuteFn = this.onceExecute(function () {
            _this.remove();
        });
        setTimeout(function () {
            util.removeClass(_this.el, 'h-visible');
            setTimeout(onceExecuteFn, 1300);
            var eventType = 'AnimationEnd';
            prefixes.forEach(function (prefix) {
                _this.el.addEventListener(prefix + eventType, onceExecuteFn);
            });
        }, this.autoRemoveTime);
    };
    InfoWindow.overflowRemove = function (removeInstances, align) {
        if (align === void 0) { align = Align.RIGHT; }
        var instances = InfoWindow.instances[align];
        InfoWindow.instances[align] = instances.filter(function (_instance) {
            return removeInstances.indexOf(_instance) === -1;
        });
        removeInstances.forEach(function (instance) {
            util.removeClass(instance.el, 'h-visible');
            setTimeout(function () {
                util.removeElement(instance.el);
            }, 800);
        });
        InfoWindow.triggerRemoveEvent(align);
    };
    InfoWindow.prototype.remove = function () {
        var instances = InfoWindow.instances[this.align];
        var index = instances.indexOf(this);
        if (index >= 0) {
            instances.splice(index, 1);
        }
        util.removeElement(this.el);
        InfoWindow.triggerRemoveEvent(this.align);
    };
    InfoWindow.startBottom = 5;
    InfoWindow.instances = {
        left: [],
        right: [],
        center: []
    };
    return InfoWindow;
}(Window));
var _a;

var infoDialogClass = {
    'info': 'h-info',
    'warn': 'h-warn',
    'error': 'h-error'
};
var InfoDialog = (function (_super) {
    __extends(InfoDialog, _super);
    function InfoDialog(option) {
        _super.call(this, option);
        this.type = InfoDialogType.INFO;
        this.content = '';
        this.maxHeight = '';
        this.html = null;
        this.assignOption(option, ['maxHeight', 'type', 'content']);
        this.assignOption(option, ['html'], false);
    }
    InfoDialog.show = function (option, type) {
        if (type === void 0) { type = InfoDialogType.INFO; }
        option.type = type;
        var dialog = new InfoDialog(option);
        dialog.render();
        return dialog;
    };
    InfoDialog.info = function (option) {
        return InfoDialog.show(option);
    };
    InfoDialog.warn = function (option) {
        return InfoDialog.show(option, InfoDialogType.WARN);
    };
    InfoDialog.error = function (option) {
        return InfoDialog.show(option, InfoDialogType.ERROR);
    };
    InfoDialog.prototype.createWindow = function () {
        _super.prototype.createWindow.call(this);
        var panel = this.el;
        util.addClass(panel, 'h-dialog-info');
        util.addClass(panel.panel, infoDialogClass[this.type]);
        return panel;
    };
    InfoDialog.prototype.initContentElements = function () {
        var panel = this.el.panel;
        var iconPanel = util.createElement('div');
        util.addClass(iconPanel, 'h-dialog-icon');
        var image = util.createElement('div');
        util.addClass(image, 'h-dialog-image');
        iconPanel.appendChild(image);
        var closeIcon = util.createElement('div');
        util.addClass(closeIcon, 'h-dialog-close');
        iconPanel.appendChild(closeIcon);
        this.bindCloseEvent(closeIcon);
        var contentPanel = util.createElement('div');
        util.addClass(contentPanel, 'h-dialog-content');
        if (this.html) {
            this.parseNode(this.html).forEach(function (node) {
                contentPanel.appendChild(node);
            });
        }
        else {
            var textNode = document.createTextNode(this.content);
            contentPanel.appendChild(textNode);
        }
        if (this.maxHeight) {
            contentPanel.style.maxHeight = this.maxHeight;
        }
        panel.appendChild(iconPanel);
        panel.appendChild(contentPanel);
    };
    InfoDialog.prototype.bindCloseEvent = function (el) {
        var _this = this;
        el.addEventListener('click', function () {
            _this.remove();
        });
    };
    return InfoDialog;
}(InfoWindow));

exports.InfoWindow = InfoWindow;
exports.InfoDialog = InfoDialog;

Object.defineProperty(exports, '__esModule', { value: true });

})));
