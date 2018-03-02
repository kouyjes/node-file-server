const path = require('path');
const md5 = require('md5');
const srcDir = require('./util/SrcDir');
const Constant = require('./constant');
const buildConfig = require('./build.config');
const baseConfig = require('./webpack.conf');
const { resolve,isAbsoluteUrl } = require('./util/UrlUtil');
var runtime = require('./runtime');
const CleanWebpackPlugin = require('clean-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
function ensureArray(arr) {
    if(!arr){
        return [];
    }
    if(!(arr instanceof Array)){
        arr = [].concat(arr);
    }
    return arr;
}
var wpkConfig = baseConfig();
wpkConfig.output = buildConfig.output;
var plugins = wpkConfig['plugins'] || [];
plugins.push(new CleanWebpackPlugin([path.relative(srcDir,buildConfig.output.path)],srcDir));
var entry = wpkConfig.entry = {};
function addEntryFile(page,key,files){
    var suffix = page.template ? md5(page.template) : '';
    key = key + suffix;
    entry[key] = files;
    return key;
}
buildConfig.pages.map(function (page) {
    var envConfig = require(page.envConfig);

    var apps = envConfig.apps,modules = envConfig.modules;

    var baseDir = srcDir;
    if(page.template){
        baseDir = path.dirname(page.template);
        if(page.templateBasePath){
            baseDir = resolve(srcDir,baseDir,page.templateBasePath);

        }
    }
    var main = ensureArray(envConfig.main).map(function (file) {
        return path.resolve(baseDir,file);
    });
    var init = ensureArray(envConfig.init).map(function (file) {
        return path.resolve(baseDir,file);
    });
    var resources = [];

    var chunks = [];

    modules.forEach(function (m) {
        if(m.compile !== false && !isAbsoluteUrl(m.url)){
            resources.push(path.resolve(baseDir,m.url));
        }
    });
    apps.forEach(function (app) {
        if(app.compile !== false && !isAbsoluteUrl(app.url)){
            resources.push(path.resolve(baseDir,app.url));
        }
    });
    resources = resources.concat(main);
    chunks.push(addEntryFile(page,Constant.SYSTEM_MAIN,resources));
    if(init.length > 0){
        chunks.push(addEntryFile(page,Constant.SYSTEM_INIT,init));
    }


    if(page.template){
        let filename = path.relative(srcDir,page.template).replace(/\\/g,'/');
        if(runtime.config.production){
            filename = path.resolve(runtime.config.outputDir,path.relative(srcDir,page.template));
        }
        plugins.push(new HtmlWebpackPlugin({
            template:page.template,
            filename:filename,
            hash:true,
            chunksSortMode:function (chunk1,chunk2) {
                var n1 = chunk1.names[0],n2 = chunk2.names[0];
                if(n1 > n2){
                    return 1;
                }else if(n1 < n2){
                    return -1;
                }
                return 0;
            },
            chunks:[Constant.SYSTEM_COMMON].concat(chunks)
        }));
    }

});

module.exports = [wpkConfig];