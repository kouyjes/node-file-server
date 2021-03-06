import { Application } from 'webapp-core';
Application.app('file-manager',function () {
    this.route = {
        path:'/',
        component:Application.component('file-comp')
    };
    this.resource = {
        js:[
            'comp/files/comp.js',
            'comp/paging/comp.js',
            'comp/progress-bar/comp.js',
            'comp/file-upload/comp.js',
            'service/fileService.js'
        ]
    };
},['network','util']);