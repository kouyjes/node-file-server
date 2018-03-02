(function (Application) {
    Application.app('image', function () {
        this.resource = {
            js:['js/image-loader.js','js/imageService.js']
        };
    },'env');
})(HERE.FRAMEWORK.Application);