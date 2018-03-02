import { Module } from 'webapp-core';
Module.module('http', function () {
    this.resource = {
        js:[function () {
            return import('jquery').then(function (jquery) {
                window['jQuery'] = jquery;
            });
        },'js/httpService.js']
    };
},'env');