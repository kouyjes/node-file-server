const fs = require('fs');
const path = require('path');
const config = require('../filters/config');
const multer  = require('multer')
const upload = multer();
const Promise = require('Promise');
function outputFiles(response,dir) {
    fs.exists(dir,function (exist) {
        if(!exist){
            response.writeJson({
                errNo:1,
                error:'目录不存在'
            });
            return;
        }
        fs.readdir(dir,function (err,files) {
            if(err){
                response.writeJson({
                    errNo:2,
                    error:'目录读取失败'
                });
                return;
            }
            var items = [];
            files.forEach(function (file) {
                var absPath = path.resolve(dir,file);
                var stat;
                try{
                    stat = fs.statSync(absPath);
                }catch(e){
                    return;
                }
                var isFile = stat.isFile(),isDir = stat.isDirectory();
                if(isFile || isDir){
                    items.push({
                        isDir:isDir,
                        name:file,
                        mTime:stat.mtime,
                        size:stat.size
                    });
                }
            });

            response.writeJson({
                errNo:200,
                data:items
            });
        });
    });
};
function normalizePath(pathname) {
    var pathname = path.normalize(pathname || '');
    pathname = pathname.replace(/\\/g,'/');
    return pathname;
}
exports.list = function (request,response) {

    var data = '';
    request.on('data',function (d) {
        data += d;
    });

    request.on('end',function () {
        if(data){
            data = JSON.parse(data);
        }
        var pathname = normalizePath(data.path || '');
        var dir = path.resolve(config.workspace,pathname);
        outputFiles(response,dir);
    });
};
function mkdir(dir) {
    return new Promise(function (resolve,reject) {
        fs.exists(dir,function (exist) {
            if(exist){
                resolve();
                return;
            }
            fs.mkdir(dir,function (err) {
                if(err){
                    reject(err);
                }else{
                    resolve();
                }
            })
        });
    });
    
}
function mkdirRecursive(dir) {
    var pathOption = path.parse(dir);
    var root = pathOption.root;
    dir = path.relative(root,dir).replace(/\\+/g,'/');
    var paths = dir.split('/');
    var promise,dirPath = root;

    paths.forEach(function (p) {
        dirPath = path.resolve(dirPath,p);
        if(!promise){
            promise = mkdir(dirPath);
        }else{
            promise = promise.then(function () {
                return mkdir(dirPath);
            });
        }
    });
    if(!promise){
        promise = promise.resolve();
    }
    return promise;
}
function saveFile(file,filePath) {
    return mkdirRecursive(path.dirname(filePath)).then(function () {
        return new Promise(function (resolve,reject) {
            if(file){
               file = file.buffer;
            }
            fs.writeFile(filePath,file,function (err) {
                if(err){
                    reject(err);
                }else{
                    resolve();
                }
            });
        });
    });

}
exports.upload = function (request,response) {
    var middleware = upload.fields([{name:'file',maxCount:1},{name:'path',maxCount:1}]);
    middleware(request,response,function (err) {
        if(err){
            response.writeJson({
                errNo:500,
                error:err
            })
            return;
        }
        var file = request.files && request.files.file && request.files.file[0],
            body = request.body || {},
            dir = body.dir,
            isFile = body.isFile,
            filename = body.filename;
        var filePath = path.resolve(config.workspace,normalizePath(dir));
        filePath = path.resolve(filePath,normalizePath(filename));

        if(isFile === 'true'){
            return saveFile(file,filePath).then(function () {
                response.writeJson({
                    errNo:200,
                    data:'success'
                });
            },function (err) {
                response.writeJson({
                    errNo:500,
                    data:err
                })
            });
        }


        mkdirRecursive(filePath).then(function () {
            response.writeJson({
                errNo:200,
                data:'success'
            });
        },function (err) {
            response.writeJson({
                errNo:500,
                data:err
            })
        });
    });
};