(function (Module) {
    //预处理数据
    Module.module('network').service('httpRequest',['httpService','message', function (httpService,message) {
        function handleMessage(result) {
            if(typeof result === 'string'){
                result = JSON.parse(result);
            }
            if(result.status === 401){
                throw new Error('session is invalid !');
            }
            if(result.errNo === 200){
                return result.data;
            }else{
                result = result['responseJSON'] || result.responseText;
                if(!result){
                    message.error('未知错误');
                    return;
                }
                var text = result.data || result['error'] || result;
                if(typeof text != 'string'){
                    text = JSON.stringify(text);
                }
                text = text.replace(/(\r)?\n/g,'<br/>');
                message.error(text);
                throw result;
            }
        }
        this.getRequestUrl = function (url,pathParams,queryParams) {
            return httpService.getRequestUrl(url,pathParams,queryParams);
        };
        this.request = function (request) {
            return httpService.request(request).then(handleMessage,handleMessage);
        };
        this.get = function (url,pathParams,queryParams) {
            return httpService.get(url,pathParams,queryParams).then(handleMessage,handleMessage);
        };
        this.post = function (url,data,pathParams,queryParams) {
            return httpService.post(url,data,pathParams,queryParams).then(handleMessage,handleMessage);
        };
        this.put = function (url,data,pathParams,queryParams) {
            return httpService.put(url,data,pathParams,queryParams).then(handleMessage,handleMessage);
        };
        this.delete = function (url,pathParams,queryParams) {
            return httpService.delete(url,pathParams,queryParams).then(handleMessage,handleMessage);
        };
    }]);
})(HERE.FRAMEWORK.Module);