function execute(chain,request,response){
    response.writeJson = function (object) {
        if(object instanceof Buffer){
            object = object.toString();
        }
       var result = JSON.stringify(object,null,4);
        response.outputContent('application/json;charset=utf-8',result);

    };
    chain.next();
}
execute.priority = 2;
exports.execute = execute;