(function (Application) {
    var app = Application.app('file-manager');
    var def = {
        templateUrl:'comp/paging/comp.html',
        cssUrl:'comp/paging/comp.css',
        props:{
            pageCount:{
                type:Number,
                required:true
            },
            page:{
                type:Number,
                default:1
            },
            pageThreshold:{
                type:Number,
                default:10
            }
        },
        data:function () {
            var page = this.page;
            page = Math.max(1,page);
            page = Math.min(this.pageCount,page);
            return {
                currentPage:page
            };
        },
        computed:{
            preEnable:function () {
                return this.currentPage > 1;
            },
            nextEnable:function () {
                return this.currentPage < this.pageCount;
            },
            pageItems:function () {
                var start = this.currentPage;
                var end = start + this.pageThreshold - 1;
                var pre = end - this.pageCount;
                if(pre > 0){
                    start -= pre;
                }
                start = Math.max(1,start);
                end = Math.min(this.pageCount,end);
                var items = [];
                for(var i = start;i <= end;i++){
                    items.push(i);
                }
                return items;
            }
        },
        watch:{
            currentPage:function () {
                this.pageChange();
            },
            page:function () {
                this.initCurrentPage();
            },
            pageCount:function () {
                this.initCurrentPage();
            }
        },
        methods:{
            initCurrentPage:function () {
                var page = this.page;
                page = Math.max(1,page);
                page = Math.min(this.pageCount,page);
                this.currentPage = page;
            },
            pageChange:function () {
                this.$emit('change',this.currentPage);
            },
            prePage:function () {
                var page = this.currentPage;
                page--;
                page = Math.max(1,page);
                if(page !== this.currentPage){
                    this.currentPage = page;
                }
            },
            nextPage:function () {
                var pageCount = this.pageCount;
                var page = this.currentPage;
                page++;
                page = Math.min(pageCount,page);
                if(page !== this.currentPage){
                    this.currentPage = page;
                }
            },
            pageTo:function (index) {
                if(this.currentPage !== index){
                    this.currentPage = index;
                }
            }
        }
    };
    app.component('task-paging',def);
})(HERE.FRAMEWORK.Application);