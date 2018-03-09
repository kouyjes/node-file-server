(function (Application) {
    var slice = Array.prototype.slice;
    function readEntries(reader) {
        var _entries = [];
        var resolve,reject;
        var promise = new Promise(function (_resolve,_reject) {
            resolve = _resolve;
            reject = _reject;
        });
        var readFn = reader.readEntries.bind(reader,function (entries) {
            if(!entries || entries.length === 0){
                resolve(_entries);
                return;
            }
            _entries = _entries.concat(slice.call(entries));
            readFn();
        },function (err) {
            reject(err);
        });
        readFn();
        return promise;
    }
    function scanEntry(entry,items) {
        if(!items){
            items = [];
        }
        items.push(entry);
        if(entry.isDirectory){
            var reader = entry.createReader();

            return readEntries(reader).then(function (entries) {
                var promises = entries.map(function (_entry) {
                    return scanEntry(_entry,items);
                });
                return Promise.all(promises).then(function () {
                    return items;
                });
            });
        }else if(entry.isFile){
            return Promise.resolve(items);
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
    function getFile(entry) {
        if(entry.isFile){
            return new Promise(function (resolve,reject) {
                try{
                    entry.file(function (file) {
                        resolve(file);
                    });
                }catch (e){
                    reject(e);
                }
            });
        }
        return Promise.resolve();
    }
    Application.app('file-manager').service('fileService',['httpRequest','httpService',function (httpRequest,httpService) {

        this.files = function (path) {
            return httpRequest.post('/list',{
                path:path
            });
        };
        this.getUploadItems = getUploadItems;
        this.executeUploadTask = function (task) {
            var item = task.item,
                dir = task.dir;
            var fullPath = item.fullPath;
            fullPath = fullPath.replace(/^\/+/,'');
            return getFile(item).then(function (file) {
                var formData = new FormData();
                if(file){
                    formData.append('file',file);
                }
                formData.append('dir',dir);
                formData.append('isFile',item.isFile);
                formData.append('filename',fullPath)

                var url = httpService.getRequestUrl('/upload');
                return httpService.ajax({
                    method:'post',
                    url:url,
                    cache:false,
                    async:true,
                    processData:false,
                    dataType:'json',
                    contentType:false,
                    data:formData,
                    xhr: function () {
                        var xhr = new XMLHttpRequest();
                        xhr.upload.addEventListener("progress", function (evt) {
                            if (evt.lengthComputable) {
                                var percent = evt.loaded / evt.total;
                                task.progress = percent;
                            }
                        }, false);
                        return xhr;
                    }
                });
            });
        };
    }]);
})(HERE.FRAMEWORK.Application);