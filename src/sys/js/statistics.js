var statistics = (function () {
    function moduleName(name){
        return name + '_Module';
    }
    function appName(name){
        return name + '_Application';
    }
    function statistics(win){

        var FRAMEWORK = win.HERE.FRAMEWORK;
        var Application = FRAMEWORK.Application;
        var Module = FRAMEWORK.Module;
        var modules = Module.modules();
        var apps = Application.apps();

        var model = {
            nodeKeyProperty:'name',
            nodeDataArray:[],
            linkDataArray:[]
        };
        var nodeMap = {};

        function _getName(item){
            var name;
            if(item instanceof Application){
                name = appName(item.appName);
            }else{
                name = moduleName(item.moduleName);
            }
            return name;
        }
        function _getText(item){
            var name = item.name();
            if(item instanceof Application){
                name += '(Application)'
            }else{
                name += '(Module)'
            }
            //name = '\n' + name + '\n';
            return name;
        }
        function getNodeBgColor(item){
            var isApp = item instanceof Application;
            return isApp ? '#686a8a' : '#69826b';
        }
        function getNodeColor(item){
            var isApp = item instanceof Application;
            return isApp ? 'blue' : '#022';
        }
        function getLinkColor(from,to){
            var fromApp = from instanceof Application;
            var toApp = to instanceof Application;
            if(fromApp && toApp){
                return '#4e4eef';
            }
            if(!fromApp && toApp){
                return 'red';
            }
            if(!fromApp && !toApp){
                return '#49535d';
            }
            return '#6db56d';
        }
        function statisticsItem(item){
            if(!(item instanceof Module)){
                return;
            }
            var name = _getName(item);
            if(nodeMap[name]){
                return;
            }
            nodeMap[name] = item;
            model.nodeDataArray.push({
                text:_getText(item),
                name:name,
                textColor:getNodeColor(item),
                color:getNodeBgColor(item)
            });
            item.parent && item.parent.items().forEach(function (_item) {
                if(!(item instanceof Module)){
                    return;
                }
                model.linkDataArray.push({
                    color:getLinkColor(item,_item),
                    from:name,
                    to:_getName(_item),
                    text:item.name() + '--->' + _item.name(),
                    curviness:20
                });
                statisticsItem(_item);
            });
        }
        apps.concat(modules).forEach(function (m) {
            statisticsItem(m);
        });

        return model;
    }

    return statistics;
})();