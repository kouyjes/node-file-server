const contextPath = __dirname;
const path = require('path');
const gulp = require('gulp');
const gulpMerge = require('merge-stream');
const uglify = require('gulp-uglify');
const cleanCSS = require('gulp-clean-css');
const babel = require('gulp-babel');
const del = require('del');
const config = require('./build/runtime.pro').config;
const srcDir = require('./build/util/SrcDir');
const buildConfig = require('./build/build.config');
const fs = require('fs');
const {isNodeModuleUrl,parseFileType,isAbsoluteUrl} = require('./build/util/UrlUtil');
const extractFileUrl = require('./build/core/resource-extract');
const taskConfig = require('./task-config');
gulp.task('clean', function() {
    return del.sync([config.outputDir]);
});
function copyFile(file,fileConfig){

    let distDir;
    var regexp = /\\/g;
    if(isNodeModuleUrl(distDir = path.relative(contextPath,file).replace(regexp,'/'))){
    }else{
        distDir = path.relative(srcDir,file).replace(regexp,'/');
    }
    distDir = path.resolve(config.outputDir,distDir);
    distDir = path.dirname(distDir);

    var stream = gulp.src(file);
    var fileType = fileConfig.type || parseFileType(file);
    if(fileType === 'js'){
        if(!file.endsWith('.min.js')){
            stream = stream.pipe(babel({
                babelrc: false,
                presets: [[ "es2015", { modules: false } ]],
                plugins: []
            })).pipe(uglify({
                compress:{
                    drop_console:true,
                    unused:true,
                    dead_code:true
                }
            }));
        }
    }else if(fileType === 'css'){
        stream = stream.pipe(cleanCSS());
    }

    stream = stream.on('error', function (err) {
        console.error(err);
    });
    stream = stream.pipe(gulp.dest(distDir));
    return stream;
}
gulp.task('copy',['clean'],function () {
    var validFiles = {};
    buildConfig.pages.forEach(function (page) {

        var envConfig = require(page.envConfig);

        validFiles[page.envConfig] = {
            type:'json'
        };

        var allDeclares = [];
        envConfig.modules.concat(envConfig.apps).forEach(function (declare) {
            if(isAbsoluteUrl(declare.url)){
                return;
            }
            let file = path.resolve(srcDir,declare.url);
            if(declare.compile === false){
                validFiles[file] = {
                    type:'js'
                };
            }
            allDeclares.push(file);
        });

        var extractFn = extractFileUrl.bind(page);
        extractFn(allDeclares);
        if(page.template){
            extractFn(page.template);
        }
    });
    var resources = extractFileUrl.resources;
    var iterator = resources.entries();
    var entry;
    var streams = [];
    while((entry = iterator.next()) && !entry.done){
        let file = entry.value[0];
        let fileConfig = entry.value[1];
        if(isAbsoluteUrl(file)){
            continue;
        }
        if(!fs.existsSync(file) || !fs.statSync(file).isFile()){
            continue;
        }


        streams.push(copyFile(file,fileConfig));
    }

    Object.keys(validFiles).forEach(function (file) {
        streams.push(copyFile(file,validFiles[file]));
    });

    streams = streams.concat(taskConfig.copyTasks());
    return gulpMerge(streams);
});