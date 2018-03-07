(function (Application) {
    var app = Application.app('file-manager');
    var slice = Array.prototype.slice;
    function scanEntry(entry,items) {
        if(!items){
            items = [];
        }
        if(entry.isDirectory){
            var reader = entry.createReader();
            return new Promise(function (resolve,reject){
                try{
                    reader.readEntries(function (entries) {
                        var promises = slice.call(entries).map(function (_entry) {
                            items.push(_entry)
                            return scanEntry(_entry,items);
                        });
                        Promise.all(promises).then(function () {
                            resolve(items);
                        },function (e) {
                            reject(e);
                        });
                    });
                }catch(e){
                    reject(e);
                }
            });
        }else if(entry.isFile){
            items.push(entry);
            return Promise.resolve([entry]);
        }
    }
    function getUploadItems(dataTransfer) {
        var items = dataTransfer.items;
        var promises = [];
        slice.call(items).some(function (item) {
            var entry = item['getAsEntry'] || item['webkitGetAsEntry'];
            if(!entry){
                throw new Error('not supported !');
            }
            entry = entry.call(item);
            promises.push(scanEntry(entry));
        });
        return Promise.all(promises).then(function (itemsArray) {
            var entries = [];
            itemsArray.forEach(function (items) {
                entries = entries.concat(items);
            });
            return entries;
        });
    }
    app.ready(function () {
        var pathStorageKey = 'LAST_DIR_PATH';
        var fileService = app.getService('fileService');
        var session = app.getService('session');
        var eventNames = ['drag','dragstart','dragend','dragover','dragenter','dragleave','drop'];;
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
                    files:[],
                    tasks:[],
                    events:{
                        dragStart:null,
                        dragEnter:null,
                        dragEnd:null
                    }
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
                dropItem:function (dataTransfer) {
                    getUploadItems(dataTransfer).then(function (items) {
                        this.tasks = items.map(function (item) {
                            return {
                                progress:0,
                                item:item
                            };
                        });
                        fileService.uploadFile(items[0],this.currentDir).then(function () {
                            this.loadFiles();
                        }.bind(this));
                    }.bind(this));

                },
                executeTasks:function () {

                },
                bindDragEvents:function () {
                    var events = this.events;
                    events.prevent = function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                    };
                    events.onDrop = function (e) {
                        this.dropItem(e.dataTransfer);
                    }.bind(this);
                    eventNames.forEach(function (name) {
                        document.addEventListener(name,events.prevent);
                    });
                    document.addEventListener('drop',events.onDrop);
                },
                unBindDragEvents:function () {
                    var events = this.events;
                    eventNames.forEach(function (name) {
                        document.removeEventListener(name,events.prevent);
                    });
                    document.addEventListener('drop',events.onDrop);
                }
            },
            mounted:function () {
                this.loadFiles().then(function () {
                    this.bindDragEvents();
                }.bind(this));
            },
            beforeDestroy:function () {
                this.unBindDragEvents();
            }
        };
        app.component('files',def);
    });

})(HERE.FRAMEWORK.Application);