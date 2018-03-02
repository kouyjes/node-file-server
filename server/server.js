'use strict';
var server = require('nm-web-server');
const path = require('path');
var dir = path.resolve(__dirname,'../src');
var nodeResource = path.resolve(__dirname,'../node_modules');
var apiDir = path.resolve(__dirname,'../mock');
var buildDir = path.resolve(__dirname,'../build');
var proxy = {
    pathRule:'^/api',
    server:'192.168.1.100',
    port:8088,
    headers:{}
};
// disabled proxy
proxy = null;
var config = {
    contexts:[
        {
            serverName:'web server',
            multiCpuSupport:false,
            zipResponse:false,
            sessionCookieName:'x3_session',
            sessionCookiePath:null,
            disabledAgentCache:true,
            port:8080,
            proxy:proxy,
            docBase:[
                {
                    path:'/',
                    dir:dir
                },
                {
                    path:'/node_modules',
                    dir:nodeResource
                },
                {
                    path:'/api',
                    dir:apiDir
                },
                {
                    path:'/',
                    dir:buildDir
                }
            ]
        },
        {
            serverName:'web server',
            multiCpuSupport:false,
            zipResponse:false,
            sessionCookieName:'x3_session',
            sessionCookiePath:null,
            disabledAgentCache:true,
            port:8081,
            proxy:proxy,
            docBase:[
                {
                    path:'/',
                    dir:path.resolve(dir,'../release')
                },
                {
                    path:'/api',
                    dir:apiDir
                }
            ]
        }
    ]
};
process.on('exitProcess', function () {
    process.exit();
})
server.startServer(config);