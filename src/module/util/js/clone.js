(function (Module) {
    Module.module('util').service('clone', function () {
        var toString = Object.prototype.toString;
        var dateType = new Date(),regExpType = /_/;
        var isArray = Array.isArray ? Array.isArray : function (arr) {
            return toString.call(arr) === toString.call([]);
        };
        this.apply = function (param) {
            if(param === null || ['string','number','boolean','undefined','function'].indexOf(typeof param) !== -1){
                return param;
            }
            if(isArray(param)){
                return this.applyArray(param);
            }
            if(toString.call(param) === toString.call(dateType)){
                return this.applyDate(param);
            }
            if(toString.call(param) === toString.call(regExpType)){
                return this.applyRegExp(param);
            }
            return this.applyObject(param);
        };
        this.applyArray = function (array) {
            return array.map(function (p) {
                return this.apply(p);
            }.bind(this));
        };
        this.applyDate = function (date) {
            return new Date(date.getTime());
        };
        this.applyRegExp = function (regExp) {
            return new RegExp(regExp.source);
        };
        this.applyObject = function (object) {
            var obj = {};
            Object.keys(object).forEach(function (key) {
                obj[key] = this.apply(object[key]);
            }.bind(this));
            return obj;
        };
    });
})(HERE.FRAMEWORK.Module);