(function (Application) {
    var app = Application.app('file-manager');
    var def = {
        templateUrl:'comp/paging/comp.html',
        cssUrl:'comp/paging/comp.css',
        data:function () {
            return {};
        },
        methods:{

        }
    };
    app.component('task-paging',def);
})(HERE.FRAMEWORK.Application);