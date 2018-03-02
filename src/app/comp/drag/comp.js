(function () {
    function getPosition(e){
        var x = e.clientX || e.pageX,
            y = e.clientY || e.pageY;
        return {
            x:x,
            y:y
        };
    }
    function getElPosition(el){
        var style = window.getComputedStyle(el);
        return {
            x:parseFloat(style.left) || 0,
            y:parseFloat(style.top) || 0
        };
    }
    function getClientRect(el){
        return {
            width:el.clientWidth,
            height:el.clientHeight
        };
    }
    function enableDrag(panel,trigger){
        if(!trigger){
            trigger = panel;
        }
        var _this = this;
        var position = this.position;
        var left = parseFloat(position.x) + 'px',
            top = parseFloat(position.y) + 'px';
        panel.style.left = left;
        panel.style.top = top;
        var runtime = {
            lastPos:null,
            mouseDown:null,
            mouseMove:null,
            cancelDrag:null
        };
        panel._runtime = runtime;
        trigger.addEventListener('mousedown', runtime.mouseDown = function (e) {
            runtime.lastPos = getPosition(e);
            _this.$emit('drag-start');
        });
        document.body.addEventListener('mousemove', runtime.mouseMove = function (e) {
            if(!runtime.lastPos){
                return;
            }
            var curPos = getPosition(e);
            var lastPos = runtime.lastPos;
            var elPos = getElPosition(panel);
            elPos.x += curPos.x - lastPos.x;
            elPos.y += curPos.y - lastPos.y;

            elPos.x = Math.max(0,elPos.x);
            elPos.y = Math.max(0,elPos.y);

            panel.style.left = elPos.x + 'px';
            panel.style.top = elPos.y + 'px';
            runtime.lastPos = curPos;

            position.x = elPos.x;
            position.y = elPos.y;
            _this.$emit('drag',curPos);
        },true);
        function stopDrag(){
            runtime.lastPos = null;
            _this.$emit('drag-end');
        }
        document.body.addEventListener('mouseup',runtime.cancelDrag = stopDrag);

    }
    function destroyDrag(panel,trigger){
        if(!panel){
            return;
        }
        if(!trigger){
            trigger = panel;
        }
        var runtime = panel._runtime;
        trigger.removeEventListener('mousedown',runtime.mouseDown);
        document.body.removeEventListener('mousemove',runtime.mouseMove);
        document.body.removeEventListener('mouseup',runtime.cancelDrag);

    }
    var def = {
        template:'<div ref="el" style="position: absolute;box-sizing:border-box;"><slot></slot></div>',
        props:{
            dragTrigger:{
                type:String
            },
            position:{
                type:Object,
                default: function () {
                    return {
                        x:0,
                        y:0
                    };
                }
            }
        },
        data: function () {
            return {

            };
        },
        mounted: function () {
            var el = this.$refs.el;
            var dragTrigger = el.querySelector(this.dragTrigger);
            enableDrag.bind(this)(el,dragTrigger);
        },
        beforeDestroy: function () {
            var el = this.$refs.el;
            var dragTrigger = el.querySelector(this.dragTrigger);
            destroyDrag.bind(this)(el,dragTrigger);
        }
    };
    Vue.component('drag-el',def);
})();