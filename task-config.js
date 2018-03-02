const path = require('path');
const gulp = require('gulp');
const cleanCSS = require('gulp-clean-css');
const srcDir = require('./build/util/SrcDir');
const config = require('./build/runtime').config;
function copyLangTask(){
    var stream = gulp.src(srcDir + '/**/lang/*.json');
    stream = stream.pipe(gulp.dest(config.outputDir));
    return stream;
}
function copyCssTask(){

    var stream = gulp.src(path.resolve(srcDir,'index.css'));
    stream = stream.pipe(cleanCSS()).pipe(gulp.dest(config.outputDir));
    return stream;
}
function copyVendorTask() {
    var stream = gulp.src(srcDir + '/vendor/**/*');
    stream = stream.pipe(gulp.dest(path.resolve(config.outputDir,'vendor')));
    return stream;
}
var buildConfig = {
    loaders: function () {
        return [];
    },
    copyTasks: function () {
        return [
            copyLangTask(),
            copyCssTask()
        ];
    }
};
module.exports = buildConfig;
