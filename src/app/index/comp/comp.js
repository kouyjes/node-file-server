(function (Application) {
    var app = Application.app('index');
    var def = {
        templateUrl:'comp/comp.html',
        cssUrl:'comp/comp.css',
        data:function () {
            return {};
        }
    };
    app.component('page-comp',def);
})(HERE.FRAMEWORK.Application);