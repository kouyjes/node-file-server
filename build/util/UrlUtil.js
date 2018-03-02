const path = require('path');
const srcDir = require('./SrcDir');
var contextDir = path.resolve(__dirname,'../../');
function isAbsoluteUrl(src){
    return /^(https*|file):\/\//i.test(src);
}
function isNodeModuleUrl(src){
    return /\b\/?node_modules\b/.test(src);
}
function extractUrl(dir,src){

    if(isAbsoluteUrl(src)){
        return src;
    }else if(isNodeModuleUrl(src)){
        src = path.resolve(contextDir,src.replace(/^\/+/g,''));
    }else{
        src = resolve(srcDir,dir,src);
    }
    return src;
}
function parseFileType(file){
    if(/\.js$/i.test(file)){
        return 'js';
    }
    if(/\.css$/i.test(file)){
        return 'css';
    }
}
function resolve(rootPath,absPath,relPath) {
    if(relPath.startsWith('/')){
        return path.resolve(rootPath,relPath.replace(/^\/+/,''));
    }
    let relUrl = path.relative(rootPath,absPath).replace(/\\/g,'/') || '';
    let paths = relUrl.split('/');
    relPath.split('/').some(function (p) {
        if(p === '..'){
            paths.pop();
        }else if(p){
            paths.push(p);
        }
    });
    relPath = paths.join('/').replace(/^\/+/,'').replace(/\/{2,}/,'/');
    absPath = path.resolve(srcDir,relPath);
    return absPath;
}
exports.isAbsoluteUrl = isAbsoluteUrl;
exports.isNodeModuleUrl = isNodeModuleUrl;
exports.extractUrl = extractUrl;
exports.parseFileType = parseFileType;
exports.resolve = resolve;