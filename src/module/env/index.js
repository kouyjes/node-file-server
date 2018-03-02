import { Module } from 'webapp-core';
Module.module('env', function () {
    this.resource = {
        js:[]
    };
});
Module.module('env').service('environment', function () {
    var config = {
        attributes:{}
    };
    this.updateEnvironment = function (environment) {
        if(environment){
            config = environment;
        }
        if(!config.attributes){
            config.attributes = {};
        }
    };
    this.attr = function (name,value) {
        if(value === void 0){
            return config.attributes[name];
        }
        if(name in config.attributes){
            throw new Error('environment attribute : ' + name + ' cannot be modified !');
        }
        if(name && value){
            config.attributes[name] = value;
        }
    };
    this.attributes = function () {
        var attributes = {};
        Object.keys(config.attributes).forEach(function (key) {
            attributes[key] = config.attributes[key];
        });
        return attributes;
    };
});