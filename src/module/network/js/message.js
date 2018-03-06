(function (Module) {
    Module.module('network').service('message', function () {
        var InfoDialog = HERE.UI.InfoDialog;
        function buildOption(content){
            var option = typeof content === 'object' ? content : {
                html:content,
                maxHeight:'200px',
                autoRemove:true
            };
            return option;
        }
        this.info = function (content) {
            InfoDialog.info(buildOption(content));
        };
        this.error = function (content) {
            InfoDialog.error(buildOption(content));
        };
        this.warn = function (content) {
            InfoDialog.warn(buildOption(content));
        };
    });
})(HERE.FRAMEWORK.Module);