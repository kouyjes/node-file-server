const path = require('path');
const fs = require('fs');
const srcDir = path.resolve(__dirname,'../../src');
const MIME = require('mime');
var buildConfig = require('../build.config');
const webpackRunner = require('./webpack-runner');
const pendingFile = path.resolve(__dirname,'./pending.html');
var appConfigMap = {};
var templateMap = {};
buildConfig.pages.forEach(function (page) {
    var envConfig = page.envConfig;
    if(envConfig){
        let relativePath = httpPath(envConfig);
        appConfigMap[relativePath] = page;
    }
    var template = page.template;
    if(template){
        let relativePath = httpPath(template);
        templateMap[relativePath] = page;
    }

});

function httpPath(absPath) {
    var relativePath = path.relative(srcDir,absPath);
    relativePath = relativePath.replace(/\\/g,'/');
    return relativePath;
}
function outputAppConf(response,pathname) {

    var page = appConfigMap[pathname];
    var json = readFileSync(page.envConfig);
    var config = JSON.parse(json);

    delete config.main;
    delete config.init;
    response.outputContent(getMime(page.envConfig),JSON.stringify(config),null,4);
}
function outputTemplate(response,pathname) {
    var page = templateMap[pathname];
    var output = buildConfig.output;
    var filePath = path.resolve(output.path,pathname);
    var content = readFileSync(filePath);
    response.outputContent(getMime(page.template),content);
}
function getMime(absPath) {
    var mime = MIME.lookup(path.basename(absPath));
    if (!mime) {
        mime = 'text/html';
    }
    return mime;
}
function outputStaticResource(response,absPath) {
    var mime = getMime(absPath);
    response.setHeader('Content-Type', mime);
    createReadStream(absPath).pipe(response);
}
function readFileSync(filePath) {
    var fs = isFile(filePath);
    return fs.readFileSync(filePath);
}
function createReadStream(absPath) {
    var fs = isFile(absPath);
    return fs.createReadStream(absPath);
}
function isFile(filePath) {
    var _fs = webpackRunner.getFs();
    if(_fs && _fs.existsSync(filePath) && _fs.statSync(filePath).isFile()){
        return _fs;
    }
    if(fs.existsSync(filePath) && fs.statSync(filePath).isFile()){
        return fs;
    }
    return null;
}
function output(chain,request,response) {
    var pathname = request.pathname;
    var config = request.getContextConfig();
    var result = config.docBase.some(function (doc) {
        const contextPath = (doc.path || config.path || '/');
        if(!pathname.startsWith(contextPath)){
            return;
        }
        let relativePath = pathname.substring(contextPath.length);
        relativePath = relativePath.replace(/^\//g,'');

        if(!relativePath || relativePath.endsWith('/')){
            relativePath += 'index.html';
        }

        if(appConfigMap[relativePath]){
            outputAppConf(response,relativePath);
            return true;
        }
        if(templateMap[relativePath]){
            outputTemplate(response,relativePath);
            return true;
        }
        let filePath = path.resolve(srcDir,relativePath);
        if(isFile(filePath)){
            outputStaticResource(response,filePath);
            return true;
        }
    });
    if(!result){
        chain.next();
    }
}
function execute(chain,request,response) {
    if(webpackRunner.isFinished()){
        output(chain,request,response);
    }else{
        outputStaticResource(response,pendingFile);
    }
}
execute.priority = -2;
exports.execute = execute;