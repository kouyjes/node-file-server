import { Application } from 'webapp-core';
Application.app('comp', function () {
    this.resource = {
        js:[
            'highlight/comp.js',
            'select/comp.js',
            'nodes-graph/comp.js',
            'image/comp.js',
            'drag/comp.js',
            'map/comp.js',
            'dropdown/comp.js',
            'slider-block/comp.js'
        ],
        css:[]
    };
    this.name('公共组件');
},['util'],['directive','image']);