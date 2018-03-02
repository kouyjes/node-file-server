function execute(chain,request,response){
    response.writeJson = function (object) {
        if(object instanceof Buffer){
            object = object.toString();
        }
        var resObj = {
            errno:200,
            errmsg:'',
            data:object
        };
        resObj = JSON.stringify(resObj,null,4);
        response.outputContent('application/json',resObj);

    };
    chain.next();
}
execute.priority = 2;
exports.execute = execute;