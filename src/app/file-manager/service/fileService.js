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
        this.uploadFile = function (item,dir) {
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
                return httpService.uploadFile('/upload',formData);
            });
        };
    }]);
})(HERE.FRAMEWORK.Application);