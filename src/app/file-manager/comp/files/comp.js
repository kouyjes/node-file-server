(function (Application) {
    var app = Application.app('file-manager');
    var def = {
        templateUrl:'comp/files/comp.html',
        cssUrl:'comp/files/comp.css',
        data:function () {
            return {};
        }
    };
    app.component('files',def);
})(HERE.FRAMEWORK.Application);