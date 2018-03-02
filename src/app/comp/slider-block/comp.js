(function (Application) {
    var app = Application.app('comp');
    var colors = ['#ef7164','#eea95e','#efcf68','#6fb8ef','#88c966'];
    var def = {
        templateUrl:'slider-block/comp.html',
        cssUrl:'slider-block/comp.css',
        props:{
            sliderCount:{
                type:Number,
                default:5
            },
            max:{
                type:Number,
                default:1
            },
            min:{
                type:Number,
                default:0
            },
            disperse:{
                type:Boolean,
                default:true
            }
        },
        data: function () {

            var _data = {
                indicator:{
                    max:0,
                    min:0,
                    maxHeight:1
                },
                handler:{
                    mouseDown:null,
                    mouseMove:null,
                    mouseUp:null,
                    _mouseDown:null,
                    _mouseMove:null,
                    _mouseUp:null
                }
            };
            return _data;
        },
        computed:{
            maxValue: function () {
                var indicator = this.indicator;
                return indicator.max / indicator.maxHeight;
            },
            minValue: function () {
                var indicator = this.indicator;
                return indicator.min / indicator.maxHeight;
            },
            maxCaption: function () {
                var value = this.maxValue;
                return parseInt((value * 100)) + '%';
            },
            minCaption: function () {
                var value = this.minValue;
                return parseInt((value * 100)) + '%';
            }
        },
        mounted: function () {

            var _this = this;
            var indicator = this.indicator;
            var indicatorEl = this.$refs['indicator'];
            var indicatorMax = this.$refs['indicatorMax'],
                indicatorMin = this.$refs['indicatorMin'];

            indicatorMax._indicator = indicatorMin._indicator = true;
            indicatorMax._isMax = true;
            indicatorMin._isMin = true;

            var maxHeight = indicatorEl.clientHeight;
            indicator.max = maxHeight;
            indicator.maxHeight = maxHeight;

            if(this.max){
                indicator.max = maxHeight * this.max;
            }
            if(this.min){
                indicator.min = maxHeight * Math.min(this.min,this.max);
            }
            var handler = this.handler;
            var current = {
                pos:null
            };
            function getPos(e){
                return {
                    x:e.pageX || e.clientX,
                    y:e.pageY || e.clientY
                };
            }
            handler.mouseDown = function (e) {
                var target = e.target;
                if(!target._indicator){
                    return;
                }
                current.pos = getPos(e);
                current.isMax = target._isMax;
                current.isMin = target._isMin;
            };
            handler.mouseMove = function (e) {
                if(!current.pos){
                    return;
                }
                var pos = getPos(e);
                var _y = pos.y - current.pos.y;
                current.pos = pos;
                if(current.isMax){
                    var max = indicator.max - _y;
                    max = Math.max(0,max);
                    max = Math.max(max,indicator.min);
                    max = Math.min(max,maxHeight);
                    indicator.max = max;
                }else{
                    var min = indicator.min - _y;
                    min = Math.max(0,min);
                    min = Math.min(min,indicator.max);
                    min = Math.min(min,maxHeight);
                    indicator.min = min;
                }
            };
            handler.mouseUp = function () {
                var pos = current.pos;
                current = {};
                if(pos){
                    _this.indicatorChange();
                }
            };
            indicatorEl.addEventListener('mousedown',handler.mouseDown);
            indicatorEl.addEventListener('mousemove',handler.mouseMove);
            indicatorEl.addEventListener('mouseleave',handler.mouseUp);
            indicatorEl.addEventListener('mouseup',handler.mouseUp);
        },
        beforeDestroy: function () {
            var indicatorEl = this.$refs['indicator'];
            var handler = this.handler;
            indicatorEl.removeEventListener('mousedown',handler.mouseDown);
            indicatorEl.removeEventListener('mousemove',handler.mouseMove);
            indicatorEl.removeEventListener('mouseleave',handler.mouseUp);
            indicatorEl.removeEventListener('mouseup',handler.mouseUp);
        },
        methods: {
            getSliderBgColor: function (i) {
                return colors[i % colors.length];
            },
            getSliderHeight: function () {
                return (100 / this.sliderCount) + '%';
            },
            indicatorChange: function () {
                this.$emit('change',{
                    max:this.maxValue,
                    min:this.minValue
                });
            }
        }
    };
    app.component('slider-block',def);
})(HERE.FRAMEWORK.Application);