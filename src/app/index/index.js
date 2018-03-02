import { Application } from 'webapp-core';
Application.app('index',function () {
    this.route = {
        path:'/',
        component:Application.component('page-comp')
    };
    this.resource = {
        js:['comp/comp.js']
    };
},[],['file-manager']);