(function (Application) {
    var app = Application.app('comp');
    app.ready(function () {
        var def = {
            template:'<span :title="text" v-html="result"></span>',
            props:{
                keyword:{
                    type:String,
                    default:''
                },
                text:{
                    type:String,
                    default:''
                },
            },
            data: function () {
                return {
                    result:this.getHighlight()
                };
            },
            methods:{
                getHighlight: function () {
                    var keyword = this.keyword || '';
                    var text = this.text || '';
                    return text.replace(keyword,'<i class="mg-text-highlight">' + keyword + '</i>');
                }
            },
            watch:{
                keyword: function () {
                    this.result = this.getHighlight();
                },
                text: function () {
                    this.result = this.getHighlight();
                }
            }
        };
        app.component('highlight',def);
    });
})(HERE.FRAMEWORK.Application);