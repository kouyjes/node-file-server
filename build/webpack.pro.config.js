const path = require('path');
const srcDir = require('./util/SrcDir');
var runtime = require('./runtime.pro');

var config = runtime.config;
var wpkConfigs = require('./webpack.build.config');
const webpack = require('webpack');

var version = require('./version');
version.update();

var outputDir  = config.outputDir;
wpkConfigs.forEach(function (wpkConfig) {

    var plugins = wpkConfig.plugins;
    var output = wpkConfig.output;
    output.path = path.resolve(outputDir,path.relative(srcDir,output.path));


    plugins.push(new webpack.DefinePlugin({
        'process.env.NODE_ENV': '"production"'
    }));

    plugins.push(new webpack.optimize.UglifyJsPlugin({
        uglifyOptions: {
            compress: {
                warnings: false
            }
        },
        sourceMap: config.sourceMap,
        parallel: true
    }));



});

module.exports = wpkConfigs;