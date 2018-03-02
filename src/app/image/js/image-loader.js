(function (ResourceLoader,Application) {
    var app = Application.app('image');
    app.service('ImageLoader', function () {
        var queues = [],
            loading = [];
        var max = 3;
        this.load = function (url) {
            var p = new Promise(function (resolve,reject) {
                queues.push({
                    url:url,
                    resolve:resolve,
                    reject:reject
                });
                loop();
            });
            return p;
        };
        function loadImage(item){
            var url = item.url;
            var resolve = item.resolve,
                reject = item.reject;
            var p = ResourceLoader.load({
                type:'image',
                urls:[url]
            }).then(function (data) {
                var image = data[0] && data[0].target;
                resolve(image);
                loading.splice(loading.indexOf(p),1);
                loop();
            }, function (e) {
                reject(e);
                loading.splice(loading.indexOf(p),1);
                loop();
            });
            loading.push(p);
        }
        function loop(){
            var item;
            while(loading.length <= max && (item = queues.shift())){
                loadImage(item);
            }
        }
    });
})(HERE.FRAMEWORK.ResourceLoader,HERE.FRAMEWORK.Application);