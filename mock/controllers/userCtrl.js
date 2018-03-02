function getUserById(request,response){
    var pathParams = request.pathParams;
    var user = {
        userId:pathParams.userId,
        userName:'admin_' + Math.random()
    };
    response.outputContent('application/json',JSON.stringify(user));
}
getUserById.$mappingUrl = '/user/{userId}';
exports.getUserById = getUserById;