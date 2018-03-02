const fs = require('fs');
const path = require('path');
var _resources = new Map();
var resources = {
    set:function (key,value) {
        return _resources.set(key,value);
    },
    get:function (key) {
        return _resources.get(key);
    },
    has:function (key) {
        return _resources.has(key);
    },
    entries:function () {
        return _resources.entries();
    }
};
var parseLoaders = require('./loaders');
var buildConfigFile = path.resolve(__dirname,'../../task-config.js');
if(fs.existsSync(buildConfigFile)){
    let _loaders = require(buildConfigFile).loaders() || [];
    parseLoaders = parseLoaders.concat(_loaders);
}

function extractFileUrl(files,rootFile){

    var page = this;
    files = [].concat(files);
    files.forEach(function (file) {

        if(!fs.existsSync(file) || !fs.statSync(file).isFile()){
            return;
        }
        if(resources.has(file)){
            return;
        }
        var content = fs.readFileSync(file).toString();
        parseLoaders.forEach(function (loader) {
            if(!file.match(loader.fileRule)){
                return;
            }
            loader.loader.call({
                file:file,
                page:page,
                execute:extractFileUrl.bind(page),
                root:rootFile || file
            },content,resources);
        });
    });
    return resources;
}
extractFileUrl.resources = resources;
module.exports = extractFileUrl;

