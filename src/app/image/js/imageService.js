(function (Application) {
    var app = Application.app('image');
    app.service('imageService', ['environment',function (environment) {
        var apiPrefix = environment.attr('apiPrefix');
        this.getMugshotUrl = function (id) {
            if(id === null || id === undefined || id === ''){
                return null;
            }
            var url =  apiPrefix + '/eyes-tw/mugshot/' + id;
            url = url.replace(/\/+/g,'/');
            return url;
        };
        this.getCard = function (id) {
            if(id === null || id === undefined || id === ''){
                return null;
            }
            var url =  apiPrefix + '/eyes-tw/card/' + id;
            url = url.replace(/\/+/g,'/');
            return url;
        };
    }]);
})(HERE.FRAMEWORK.Application);