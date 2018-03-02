import { Module } from 'webapp-core';
Module.module('util', function () {
    this.resource = {
        js:[import('lz-string').then(function (LZString) {
            window['LZString'] = LZString;
        }),'js/clone.js','js/storage.js','js/string-util.js']
    };
});