(function (Application) {
    var app = Application.app('file-manager');
    var def = {
        templateUrl: 'comp/progress-bar/comp.html',
        cssUrl: 'comp/progress-bar/comp.css',
        props:{
            progress:{
                type:Number,
                default:0
            }
        },
        data:function () {
            return {};
        },
        computed:{
            progressWidth:function () {
                var progress = this.progress;
                progress *= 100;
                progress = progress.toFixed(1);
                return progress + '%';
            }
        },
        methods:{

        }
    };
    app.component('progress-bar',def);
})(HERE.FRAMEWORK.Application);