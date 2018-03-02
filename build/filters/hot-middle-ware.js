var config = require('../runtime').config;
var execute = function (chain) {
    chain.next();
}
if(config.hotReplace){
    const webpackRunner = require('./webpack-runner');
    const compiler = webpackRunner.compiler;
    let hotMiddlewareFn = require('webpack-hot-middleware');
    let hotMiddleware = hotMiddlewareFn(compiler, {
        log: false,
        heartbeat: 2000
    });
    compiler.plugin('compilation', function (compilation) {

        compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
            hotMiddleware.publish({ action: 'reload' });
            cb();
        })
    });
    execute = function (chain,request,response) {
        hotMiddleware(request,response,chain.next.bind(chain));
    }
}
execute.priority = -1;
exports.execute = execute;