const fs = require('fs');
const path = require('path');
const config = require('../filters/config');
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
exports.list = function (request,response) {
    var data = '';
    request.on('data',function (d) {
        data += d;
    });

    request.on('end',function () {
        if(data){
            data = JSON.parse(data);
        }
        var pathname = path.normalize(data.path || '');
        pathname = pathname.replace(/\\/g,'/');
        var dir = path.resolve(config.workspace,pathname);
        outputFiles(response,dir);
    });
};
exports.upload = function (request,response) {
    response.writeJson({});
};