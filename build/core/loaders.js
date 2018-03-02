const path = require('path');
const { extractUrl,parseFileType,resolve,isAbsoluteUrl } = require('../util/UrlUtil');
const srcDir = require('../util/SrcDir');
const URL = require('url');
function cssLoader(content,resources) {
    var _this = this;
    var rootFile = this.root;
    var file = this.file;
    var regexp = /(["'])\s*([^"']+\.css)\s*\1/ig;
    content.replace(regexp, function (all,m1,src) {

        if(isAbsoluteUrl(src)){
            return all;
        }
        var urlInfo = URL.parse(src);
        src = urlInfo.pathname;
        var _root = path.dirname(rootFile);
        src = extractUrl(_root,src);
        _this.execute([src],file);
        resources.set(src,{
            type:'css'
        });
    });
}
function jsLoader(content,resources) {
    var _this = this;
    var rootFile = this.root;
    var regexp = /(["'])\s*([^"']+\.js)\s*\1/ig;
    content.replace(regexp, function (all,m1,src) {

        if(isAbsoluteUrl(src)){
            return all;
        }
        var urlInfo = URL.parse(src);
        src = urlInfo.pathname;
        var dir = path.dirname(rootFile);
        src = extractUrl(dir,src);
        _this.execute([src],rootFile);
        resources.set(src,{
            type:'js'
        });
    });
}
function jsonLoader(content,resources){
    var _this = this;
    var rootFile = this.root;
    var regexp = /(["'])\s*([^"']+\.json)\s*\1/ig;
    content.replace(regexp, function (all,m1,src) {

        if(isAbsoluteUrl(src)){
            return all;
        }
        var urlInfo = URL.parse(src);
        src = urlInfo.pathname;
        var dir = path.dirname(rootFile);
        src = extractUrl(dir,src);
        _this.execute([src],rootFile);
        resources.set(src,{
            type:'json'
        });
    });
}
function htmlLoader(content,resources) {
    var _this = this;
    var rootFile = this.root;
    var regexp = /(["'])\s*([^"']+\.(?:html|htm|tpl))\s*\1/ig;
    content.replace(regexp, function (all,m1,src) {

        if(isAbsoluteUrl(src)){
            return all;
        }
        var urlInfo = URL.parse(src);
        src = urlInfo.pathname;
        var dir = path.dirname(rootFile);
        src = extractUrl(dir,src);
        _this.execute([src],rootFile);
        resources.set(src,{
            type:'html'
        });
    });
}
function fileLoader(content,resources) {
    var _this = this;
    var rootFile = this.root;
    var page = this.page;
    var regexp = /(["'])*(?:src|source|href|pre-url)\1\s*=\s*(["'])\s*([^"']+)\s*\2/ig;
    content.replace(regexp, function (all,m1,m2,src) {

        if(isAbsoluteUrl(src)){
            return all;
        }
        var urlInfo = URL.parse(src);
        src = urlInfo.pathname;
        var dir = path.dirname(page.template);
        if(page.templateBasePath){
            dir = resolve(srcDir,dir,page.templateBasePath);
        }
        src = extractUrl(dir,src);
        _this.execute([src],rootFile);
        resources.set(src,{
            type:parseFileType(src) || 'file'
        });
    });
}
function cssFileLoader(content,resources){

    var regexp = /\burl\s*\((["']?)\s*([^"'()]+\.[^"'()]+)\s*\1\s*\)/ig;
    var file = this.file;
    content.replace(regexp, function (all,m1,src) {

        if(isAbsoluteUrl(src)){
            return all;
        }
        var urlInfo = URL.parse(src);
        src = urlInfo.pathname;
        var dir = path.dirname(file);
        src = extractUrl(dir,src);
        resources.set(src,{
            type:'file'
        });
    });
}
var parseLoaders = [
    {
        fileRule:/\.js$/,
        loader:cssLoader
    },
    {
        fileRule:/\.js$/,
        loader:jsLoader
    },
    {
        fileRule:'/\.js$/',
        loader:jsonLoader
    },
    {
        fileRule:/\.js$/,
        loader:htmlLoader
    },
    {
        fileRule:/\.html/,
        loader:fileLoader
    },
    {
        fileRule:/\.css$/,
        loader:cssFileLoader
    }
];
module.exports = parseLoaders;