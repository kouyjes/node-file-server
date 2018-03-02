import { Application } from 'webapp-core';
import Vue from 'vue';
Application.component = function (id,definition) {
    if(definition === void 0){
        return function (resolve) {
            var def = Vue.component(id);
            if(typeof def === 'function'){
                return def(resolve);
            }
            return resolve(def);
        };
    }
    return Vue.component.apply(Vue,arguments);
};
Application.prototype.component = function (id,definition) {
    if(typeof definition === 'object'){
        var templateUrl = definition['templateUrl'],
            cssUrl = definition['cssUrl'],
            depResource = definition['depResource'];
        delete definition['templateUrl'];
        delete definition['cssUrl'];
        delete definition['depResource'];
        if(!templateUrl && !cssUrl){
            return Vue.component.apply(Vue,arguments);
        }

        var resources = [];
        if(templateUrl){
            resources.push({
                type:'text',
                urls:[templateUrl]
            });
        }
        if(cssUrl){
            resources.push({
                type:'css',
                urls:[].concat(cssUrl)
            });
        }

        if(!(depResource instanceof Array)){
            depResource = [depResource];
        }
        depResource = depResource.filter(function (resource) {
            return resource && resource.type && resource.urls instanceof Array;
        });

        resources = resources.concat(depResource);

        var _this = this;
        var callback = function (resolve) {
            Promise.all(resources.map(function (resource) {
                return _this.loadResource(resource);
            })).then(function (dataArray) {
                if(templateUrl){
                    definition.template = dataArray.shift()[0];
                }
                resolve(definition);
            });
        };
        return Vue.component(id,callback);
    }
    return Vue.component.apply(Vue,arguments);
};