(function (Module) {
    Module.module('util').service('appSession', function () {
        var PREFIX = 'session.';
        var LZString = window['LZString'];
        var isIE = /\bedge\/\d+\.\d+/i.test(navigator.appVersion);
        function compress(text){
            if(isIE){
                return text;
            }
            return LZString.compress(text);
        }
        function decompress(text){
            if(isIE){
                return text;
            }
            return LZString.decompress(text);
        }
        this.getStorage = function () {
            return localStorage;
        };
        this.remove = function (key) {
            var storage = this.getStorage();
            storage.removeItem(key);
        };
        this.clear = function () {
            var storage = this.getStorage();
            storage.clear();
        };
        this.key = function (key) {
            return PREFIX + key;
        };
        this.string = function (key,value) {
            key = PREFIX + key;
            var storage = this.getStorage();
            try{
                if(arguments.length === 1){
                    value = storage.getItem(key);
                    if(!value){
                        return null;
                    }
                    return decompress(value);
                }
                if(!value){
                    storage.removeItem(key);
                    return;
                }
                value = compress(value);
                storage.setItem(key,value);
            }catch(e){
                console.error(e);
            }
        };
        this.object = function (key,object) {
            var value;
            try{
                if(arguments.length === 1){
                    value = this.string(key);
                    if(!value){
                        return null;
                    }
                    object = JSON.parse(value);
                    return object;
                }
                value = JSON.stringify(object);
                return this.string(key,value);
            }catch(e){
                console.error(e);
            }
        };
    }).service('session', ['appSession',function (appSession) {
        var session = Object.create(appSession);
        session.getStorage = function () {
            return sessionStorage;
        };
        return session;
    }]);
})(HERE.FRAMEWORK.Module);