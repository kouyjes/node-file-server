const path = require('path');
const webpack = require('webpack');
var FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');

const srcDir = require('./util/SrcDir');
var config = require('./runtime').config;
var wpkConfigs = require('./webpack.build.config');
wpkConfigs.forEach(function (wpkConfig,index) {

    var plugins = wpkConfig.plugins;
    var entry = wpkConfig.entry;
    if(config.hotReplace && index === 0){
        Object.keys(entry).forEach(function (key) {
            entry[key] = [path.resolve(srcDir,'../build/hot-client.js')].concat(entry[key]);
        });
        plugins.push(new webpack.HotModuleReplacementPlugin());
        plugins.push(new webpack.NoEmitOnErrorsPlugin());
        plugins.push(new FriendlyErrorsPlugin());
    }
});
module.exports = wpkConfigs;