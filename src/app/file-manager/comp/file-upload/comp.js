(function (Application) {
    var app = Application.app('file-manager');
    var eventNames = ['drag','dragstart','dragend','dragover','dragenter','dragleave','drop'];
    app.ready(function () {
        var fileService = app.getService('fileService');
        var def = {
            templateUrl: 'comp/file-upload/comp.html',
            cssUrl: 'comp/file-upload/comp.css',
            props:{
                maxTaskCount:{
                    type:Number,
                    default:3
                },
                currentDir:{
                    type:String,
                    required:true
                },
                pageSize:{
                    type:Number,
                    default:50
                }
            },
            data:function () {
                return {
                    tasks:[],
                    taskQueue:[],
                    eventTimeout:null,
                    runningQueue:[],
                    page:1,
                    events:{
                        dragStart:null,
                        dragEnter:null,
                        dragEnd:null
                    }
                };
            },
            computed:{
                pageCount:function () {
                    var tasks = this.tasks;
                    return Math.ceil(tasks.length / this.pageSize);
                },
                pageTasks:function () {
                    var page = this.page - 1;
                    var start = page * this.pageSize,
                        end = start + this.pageSize;
                    return this.tasks.slice(start,end);
                }
            },
            methods:{
                dropItem:function (dataTransfer) {
                    var currentDir = this.currentDir;
                    fileService.getUploadItems(dataTransfer).then(function (items) {
                        var tasks = items.map(function (item) {
                            return {
                                dir:currentDir,
                                progress:0,
                                status:0,
                                item:item
                            };
                        });
                        this.tasks = this.tasks.concat(tasks);
                        this.taskQueue = [].concat(tasks);

                        this.executeTasks();
                    }.bind(this));

                },
                taskStatusChanged:function (task) {
                    if(this.eventTimeout){
                        clearTimeout(this.eventTimeout);
                    }
                    setTimeout(function () {
                        this.$emit('upload-changed',{
                            dir:task.dir
                        });
                    }.bind(this),1000);

                },
                taskPageChanged:function (page) {
                    this.page = page;
                },
                checkRunningQueue:function () {
                    var runningQueue = this.runningQueue,
                        taskQueue = this.taskQueue;
                    if(taskQueue.length === 0 || runningQueue.length > this.maxTaskCount){
                        return;
                    }
                    var task = taskQueue.shift();
                    runningQueue.push(task);

                    if(runningQueue.length < this.maxTaskCount){
                        this.checkRunningQueue();
                    }
                },
                executeTasks:function () {
                    this.checkRunningQueue();
                    this.runningQueue.forEach(function (task) {
                        if(task.status === 0){
                            task.status = 1;
                            fileService.executeUploadTask(task).then(function () {
                                task.status = 2;
                                var runningQueue = this.runningQueue;
                                var index = runningQueue.indexOf(task);
                                if(index >= 0){
                                    runningQueue.splice(index,1);
                                }
                                this.taskStatusChanged(task);
                                this.executeTasks();
                            }.bind(this));
                        }
                    }.bind(this));
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
                this.bindDragEvents();
            },
            beforeDestroy:function () {
                this.unBindDragEvents();
            }
        };
        app.component('file-upload',def);
    });
})(HERE.FRAMEWORK.Application);