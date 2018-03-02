var config = require('./runtime').config;
function createLoaders(type,options) {
    options = options || {}
    var cssLoader = {
        loader: 'css-loader',
        options: {
            minimize: config.minimize,
            sourceMap: options.sourceMap
        }
    };
    var loaders = [cssLoader];
    if(type){
        loaders.push({
            loader: type + '-loader',
            options: Object.assign({}, options, {
                sourceMap: options.sourceMap
            })
        });
    }
    return loaders;
}

function cssLoaders(options) {

    options = options || {}

    return {
        css: createLoaders('',options),
        postcss: createLoaders('',options),
        less: createLoaders('less',options),
        sass: createLoaders('sass', Object.assign({indentedSyntax: true},options)),
        scss: createLoaders('sass',options),
        stylus: createLoaders('stylus',options),
        styl: createLoaders('stylus',options)
    }
}

function styleLoaders() {

    var options = {};
    var output = []
    var loaders = cssLoaders(options)
    for (var extension in loaders) {
        var loader = loaders[extension]
        output.push({
            test: new RegExp('\\.' + extension + '$'),
            use: loader
        })
    }
    return output
}

exports.loaders = styleLoaders();