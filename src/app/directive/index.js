(function (Application) {
    Application.app('directive', function () {
        this.resource = {
            js:['js/highlight.js','js/input-focus.js'],
            css:[]
        };
        this.name('公共指令');
    },[]);
})(HERE.FRAMEWORK.Application);