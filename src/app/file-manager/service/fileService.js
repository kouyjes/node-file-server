(function (Application) {

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