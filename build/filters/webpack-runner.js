var config = require('../../build/webpack.dev.config.js');
const webpack = require('webpack');
const MemoryFS = require("memory-fs");
const fs = new MemoryFS();
const compiler = webpack(config);
compiler.outputFileSystem = fs;
var finished = false;
compiler.run(function (err) {
    finished = true;
    if(!err){
        compiler.watch({
            aggregateTimeout:300
        },function (err) {

        });
    }
});
exports.isFinished = function () {
    return finished;
};
exports.getFs = function () {
    return fs;
};
exports.compiler = compiler;