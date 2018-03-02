const path = require('path');
const srcDir = require('./util/SrcDir');

module.exports = {
    output:{
        filename:'[name].js',
        path:path.resolve(srcDir,'chunks'),
        publicPath:'/chunks/'
    },
    pages:[
        {
            template:path.resolve(srcDir,'index.html'),
            //templateBasePath:'./',
            envConfig:path.resolve(srcDir,'env/applications.json')
        }
    ]
};