(function (Application) {
    var app = Application.app('comp');
    var compId = (function () {
        var i = 1;
        return function () {
            return 'mg-select-' + (i++);
        }
    })();
    var selectCompId = null;
    function indexOf(items,item,key){
        var index = -1;
        items.some(function (sel,_index) {
            if(sel === item || (sel[key] && sel[key] === item[key])){
                index = _index;
                return true;
            }
        });
        return index;
    }
    function matchTree(items,keyword){
        if(!items || !items.length){
            return false;
        }
        if(!keyword){
            keyword = '';
        }
        var _matched = false;
        items.forEach(function (item,index) {
            var value = item.name || '';
            var matched = value.indexOf(keyword) >= 0;
            if(matchTree(item.children,keyword)){
                matched = true;
            }
            if(matched){
                _matched = true;
            }
            item.matched = matched;
            if(!keyword){
                item.expand = item._expand;
            }else{
                item.expand = item.matched;
            }

            Vue.set(items,index,item);
        });

        return _matched;
    }
    function initItems(items){
        items.forEach(function (item) {
            if(item.expand === void 0){
                item.expand = false;
                item.matched = true;
            }
            if(item.children && item.children.length){
                initItems(item.children);
            }
        });
    }
    var def = {
        templateUrl:'select/comp.html',
        cssUrl:'select/comp.css',
        props:{
            maxHeight:{
                type:String
            },
            identify:{
                type:String,
                default:'id'
            },
            multi:{
                type:Boolean,
                default:false
            },
            filter:{
                type:Boolean,
                default:false
            },
            display:{
                type:String,
                default:'name'
            },
            initCollapse:{
                type:Boolean,
                default:true
            },
            items:{
                type:Array,
                default: function () {
                    return [];
                }
            },
            selectItems:{
                type:Array,
                default: function () {
                    return [];
                }
            },
            selectItem:{
                type:Object,
                default: function () {
                    return null;
                }
            }
        },
        data: function () {
            var _data = {
                compId:compId(),
                collapse:this.initCollapse,
                keyword:'',
                select:[]
            };
            if(this.multi && this.selectItems){
                _data.select = _data.select.concat(this.selectItems);
            }else if(this.selectItem){
                _data.select = _data.select.concat(this.selectItem);
            }
            return _data;
        },
        methods:{
            isSelect: function (item) {
                var selects = this.select;
                if(!selects){
                    return false;
                }
                if(!(selects instanceof Array)){
                    selects = [selects];
                }
                return indexOf(selects,item,this.identify) >= 0;
            },
            removeKeyword: function () {
                this.keyword = '';
            },
            toggleCollapse: function () {
                this.collapse = !this.collapse;
            },
            click: function () {
                selectCompId = this.compId;
            },
            toggleSelect: function (item) {
                var selects = this.select || [];
                if(!(selects instanceof Array)){
                    selects = [selects];
                }
                var index = indexOf(selects,item,this.identify);
                if(index >= 0){
                    selects.splice(index,1);
                }else{
                    if(this.multi){
                        selects.push(item);
                    }else{
                        selects.splice(0,selects.length,item);
                        this.collapse = true;
                    }

                }
                this.select = selects;
                var select = this.multi ? selects : selects[0];
                this.$emit('change',select);
            }
        },
        watch:{
            keyword: function (keyword) {
                if(!keyword){
                    keyword = '';
                }
                matchTree(this.items,keyword);
            },
            selectItem: function () {
                if(!this.multi){
                    this.select = [];
                    if(this.selectItem){
                        this.select.push(this.selectItem);
                    }
                }
            },
            selectItems: function () {
                if(this.multi){
                    this.select = [].concat(this.selectItems || []);
                }
            }
        },
        mounted: function () {
            this.collapseBox = function () {
                if(selectCompId === this.compId){
                    selectCompId = null;
                }else{
                    this.collapse = true;
                }
            }.bind(this);
            document.body.addEventListener('mousedown', this.collapseBox);
        },
        destroyed: function () {
            document.body.removeEventListener('mousedown', this.collapseBox);
        }
    };
    var listDef = {
        templateUrl:'select/list.html',
        props:{
            identify:{
                type:String,
                default:'id'
            },
            level:{
                type:Number,
                default:0
            },
            display:{
                type:String,
                default:'name'
            },
            keyword:{
                type:String,
                default: ''
            },
            items:{
                type:Array,
                default: function () {
                    return [];
                }
            },
            select:{
                type:Array,
                default: function () {
                    return [];
                }
            }
        },
        data: function () {
            return {

            };
        },
        methods:{
            isSelect: function (item) {
                var selects = this.select;
                if(!selects){
                    return false;
                }
                if(!(selects instanceof Array)){
                    selects = [selects];
                }
                return indexOf(selects,item,this.identify) >= 0;
            },
            hasChildren: function (item) {
                return item.children && item.children.length;
            },
            toggleSelect: function (item) {
                if(item.disabled){
                    this.toggleExpand(this.items,item);
                    return;
                }
                this.$emit('change',item);
            },
            toggleExpand: function (items,item) {
                item.expand = !item.expand;
                item._expand = item.expand;
                items.splice(items.indexOf(item),1,item);
            }
        }
    };
    app.component('mg-select-list', listDef);
    app.component('mg-select',def);
})(HERE.FRAMEWORK.Application);