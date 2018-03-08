(function (Module) {
    Module.module('http').service('httpService', ['environment',function (environment) {
        var $ = jQuery;
        var pathParamReg = new RegExp('\{([^/{}]+)\}','g');
        function ensureStartsWith(url){
            if(!url){
                return '';
            }
            if(!/^\//.test(url)){
                url = '/' + url;
            }
            return url;
        }
        var eventListeners = {
            beforeSend:[],
            complete:[],
            error:[]
        };
        this.ajax = $.ajax.bind($);
        this.addEventListener = function (type,handler) {
            if(typeof handler !== 'function'){
                return;
            }
            var listeners = eventListeners[type];
            if(!listeners){
                return;
            }
            var index = listeners.indexOf(handler);
            if(index === -1){
                listeners.push(handler);
            }
        };
        this.removeEventListener = function (type,handler) {
            var listeners = eventListeners[type];
            if(!listeners){
                return;
            }
            if(arguments.length === 1){
                listeners.length = 0;
                return;
            }
            var index = listeners.indexOf(handler);
            if(handler.length >= 0){
                listeners.splice(index,1);
            }
        };
        this.executeEventHandler = function (type,params,context) {
            var listeners = eventListeners[type];
            if(!listeners){
                return;
            }
            listeners.forEach(function (handler) {
                try{
                    handler.apply(context,params);
                }catch(e){
                    console.error(e);
                }
            });
        };
        this.getRequestUrl = function (url,pathParams,queryParams) {
            var apiPrefix = environment.attr('apiPrefix');
            apiPrefix = ensureStartsWith(apiPrefix);
            pathParams = pathParams || {};
            url = url.replace(pathParamReg, function (all,name) {
                var val = pathParams[name];
                if(val === void 0 || val === null){
                    return '';
                }
                return val + '';
            });

            url = ensureStartsWith(url);
            url = apiPrefix + url;

            var a = document.createElement('a');
            a.href = url;
            queryParams = queryParams || {};
            Object.keys(queryParams).forEach(function (key) {
                var value = queryParams[key];
                if(value === undefined || value === null){
                    delete queryParams[key];
                }
            });
            var queryString = Object.keys(queryParams).map(function (key) {
                return [key,queryParams[key]].join('=');
            }).join('&');

            if(a.search){
                a.search = a.search + '&' + queryString;
            }else{
                a.search = queryString;
            }
            return a.href;
        };
        this.request = function (request) {
            var url = this.getRequestUrl(request.url,request.pathParams,request.queryParams);

            var method = request.method;
            if(!method){
                method = request.data ? 'POST' : 'GET';
            }
            var async = request.async;
            if(typeof async !== 'boolean'){
                async = true;
            }

            var data = request.data;
            if(data){
                data = JSON.stringify(data);
            }
            return $.ajax({
                method:method,
                url:url,
                cache:false,
                async:async,
                beforeSend: function () {
                    this.executeEventHandler('beforeSend',arguments,this);
                }.bind(this),
                complete: function () {
                    this.executeEventHandler('complete',arguments,this);
                }.bind(this),
                error: function () {
                    this.executeEventHandler('error',arguments,this);
                }.bind(this),
                headers:request.headers,
                dataType:request.dataType,
                contentType:request.contentType,
                data:data
            }).then(function (data) {
                return data;
            }, function (data) {
                this.executeEventHandler('error',arguments,this);
                throw data;
            }.bind(this));
        };
        this.get = function (url,pathParams,queryParams) {
            var request = {
                url:url,
                method:'GET',
                pathParams:pathParams,
                queryParams:queryParams
            }
            return this.request(request);
        };
        this.post = function (url,data,pathParams,queryParams) {
            var request = {
                url:url,
                method:'POST',
                dataType:'json',
                contentType:'application/json',
                data:data,
                pathParams:pathParams,
                queryParams:queryParams
            };
            return this.request(request);
        };
        this.put = function (url,data,pathParams,queryParams) {
            var request = {
                url:url,
                method:'PUT',
                dataType:'json',
                contentType:'application/json',
                data:data,
                pathParams:pathParams,
                queryParams:queryParams
            };
            return this.request(request);
        };
        this.delete = function (url,pathParams,queryParams) {
            var request = {
                url:url,
                method:'DELETE',
                pathParams:pathParams,
                queryParams:queryParams
            };
            return this.request(request);
        };
    }]);
})(HERE.FRAMEWORK.Module);