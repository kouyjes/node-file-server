function loginInfo(request,response){
    var loginInfo = {
        userName:'admin_' + Math.random()
    };
    response.outputContent('application/json',JSON.stringify(loginInfo));
}
exports.loginInfo = loginInfo;