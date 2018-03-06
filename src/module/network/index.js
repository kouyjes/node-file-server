(function (Module) {
    Module.module('network', function () {
        this.resource = {
            js:['js/network.js','js/message.js','/node_modules/h-dialog/dest/js/dialog.js'],
            css:['/node_modules/h-dialog/dest/css/dialog.css']
        };
        this.name('网络管理');
    },['http']);
})(HERE.FRAMEWORK.Module);