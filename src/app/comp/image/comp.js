(function (Application) {
    var app = Application.app('comp');
    app.ready(function () {
        var ImageLoader = app.getService('ImageLoader');
        var def = {
            template:'<div ref="img" class="custom-img-comp"></div>',
            cssUrl:'image/comp.css',
            props:{
                src:{
                    type:String|Number,
                    required:true
                }
            },
            data: function () {
                return {};
            },
            watch:{
                src: function () {
                    this.loadImage();
                }
            },
            methods:{
                isValidSrc: function (src) {
                    return src !== null && src !== undefined && src !== '';
                },
                loadImage: function () {
                    var wrapper = this.$refs['img'];
                    if(!this.isValidSrc(this.src)){
                        wrapper.innerHTML = '';
                        return;
                    }
                    wrapper.innerHTML = '<i class="loading-image el-icon-loading"></i>';
                    ImageLoader.load(this.src).then(function (image) {
                        wrapper.innerHTML = '';
                        wrapper.appendChild(image);
                    }, function () {
                        wrapper.innerHTML = '';
                    });
                }
            },
            mounted: function () {
                this.loadImage();
            }
        };
        app.component('image-comp',def);
    });
})(HERE.FRAMEWORK.Application);