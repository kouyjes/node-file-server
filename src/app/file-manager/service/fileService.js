(function (Application) {

    function getFile(entry) {
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
    Application.app('file-manager').service('fileService',['httpRequest','httpService',function (httpRequest,httpService) {

        this.files = function (path) {
            return httpRequest.post('/list',{
                path:path
            });
        };
        this.uploadFile = function (item) {
            return getFile(item).then(function (file) {
                var formData = new FormData();
                formData.append('file',file);
                return httpService.uploadFile('/upload',formData);
            });
        };
    }]);
})(HERE.FRAMEWORK.Application);