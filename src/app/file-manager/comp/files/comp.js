(function (Application) {
    var app = Application.app('file-manager');
    app.ready(function () {
        var pathStorageKey = 'LAST_DIR_PATH';
        var fileService = app.getService('fileService');
        var session = app.getService('session');
        var def = {
            templateUrl:'comp/files/comp.html',
            cssUrl:'comp/files/comp.css',
            data:function () {
                var pathRoute = session.object(pathStorageKey);
                return {
                    layoutType:'grid',
                    pathRoute:pathRoute || [{
                        path:'',
                        name:'全部文件'
                    }],
                    files:[]
                };
            },
            computed:{
                currentDir:function () {
                    return this.pathRoute.map(function (route) {
                        return route.path;
                    }).join('/');
                }
            },
            methods:{
                switchLayout:function () {
                    if(this.layoutType === 'grid'){
                        this.layoutType = 'list';
                    }else{
                        this.layoutType = 'grid';
                    }
                },
                clickDir:function (file) {
                    this.pathRoute.push({
                        path:file.name,
                        name:file.name
                    });
                    this.loadFiles();
                },
                redirectPathRoute:function (routeIndex) {
                    var endIndex = routeIndex + 1;
                    if(endIndex >= this.pathRoute.length){
                        return;
                    }
                    this.pathRoute = this.pathRoute.slice(0,endIndex);
                    this.loadFiles();
                },
                lastPathRoute:function () {
                    if(this.pathRoute.length > 1){
                        this.pathRoute.pop();
                        this.loadFiles();
                    }
                },
                resetPathRoute:function () {
                    this.pathRoute = this.pathRoute.slice(0,1);
                    this.loadFiles();
                },
                loadFiles:function () {
                    session.object(pathStorageKey,this.pathRoute);
                    var path = this.currentDir;
                    return fileService.files(path).then(function (files) {
                        this.files = files;
                    }.bind(this));
                },
                uploadChanged:function (evt) {
                    if(this.currentDir === evt.dir){
                        this.loadFiles();
                    }
                }
            },
            mounted:function () {
                this.loadFiles();
            }
        };
        app.component('files',def);
    });

})(HERE.FRAMEWORK.Application);