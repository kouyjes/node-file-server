(function (Module) {
    Module.module('util').service('stringUtil', function () {
        this.trim = function (text) {
            if(!text){
                return '';
            }
            return text.replace(/^[\u3000\s]+|[\u3000\s]+$/g,'');
        };
    });
})(HERE.FRAMEWORK.Module);