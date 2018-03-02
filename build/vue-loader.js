var ExtractTextPlugin = require('extract-text-webpack-plugin')
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
    if(config['extractCss']){
        return ExtractTextPlugin.extract({
            use: loaders,
            fallback: 'vue-style-loader'
        });
    }
    loaders.unshift('vue-style-loader');
    return loaders;
}
function cssLoaders() {

    var options = {
        sourceMap:config.sourceMap
    };

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

exports.loader = {
    test: /\.vue$/,
    loader: 'vue-loader',
    options: {
        loaders:cssLoaders(),
        transformToRequire: {
            video: ['src', 'poster'],
            source: 'src',
            img: 'src',
            image: 'xlink:href'
        }
    }
};
