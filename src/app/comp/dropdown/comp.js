(function (Application) {
    var app = Application.app('comp');
    app.ready(function () {
        var def = {
            templateUrl:'dropdown/comp.html',
            cssUrl:'dropdown/comp.css',
            props:{
                fixedLayout:{
                    type:Boolean,
                    default:false
                }
            },
            data: function () {
                return {
                    mouseup:null,
                    onScroll:null,
                    collapsePending:false,
                    state:{},
                    layoutPending:true,
                    menuStyle:{
                        top:0,
                        left:0
                    },
                    collapse:true
                };
            },
            mounted: function () {
                this.mouseup = function () {
                    if(this.collapsePending){
                        this.collapsePending = false;
                        return;
                    }
                    this.collapse = true;
                }.bind(this);
                this.onScroll = function () {
                    if(this.fixedLayout && !this.collapse){
                        this.updateFixLayout();
                    }
                }.bind(this);
                document.body.addEventListener('click',this.mouseup);
                document.body.addEventListener('wheel',this.onScroll);
                window.addEventListener('resize',this.onScroll);
            },
            destroyed: function () {
                document.body.removeEventListener('click',this.mouseup);
                document.body.removeEventListener('wheel',this.onScroll);
                window.removeEventListener('resize',this.onScroll);
            },
            methods:{
                toggleCollapse: function () {
                    this.collapse = !this.collapse;
                    this.collapsePending = true;
                    if(this.fixedLayout){
                        this.fixLayout();
                    }else{
                        this.absLayout();
                    }
                },
                fixLayout: function () {
                    this.layoutPending = true;
                    this.updateFixLayout();
                    this.$nextTick(function () {
                        this.updateFixLayout();
                        this.layoutPending = false;
                    }.bind(this));;
                },
                updateFixLayout: function () {
                    var menu = this.$refs['dropdown'];
                    var trigger = this.$refs['trigger'];
                    var menuStyle = this.menuStyle;
                    var menuWidth = Math.max(menu.clientWidth,menu.offsetWidth);
                    var bound = trigger.getBoundingClientRect();
                    menuStyle.top = (bound.y || bound.top) + bound.height;
                    menuStyle.left = ((bound.x || bound.left) - (menuWidth - bound.width) / 2);
                },
                absLayout: function () {
                    var menu = this.$refs['dropdown'];
                    this.$nextTick(function () {
                        menu.style.marginLeft = - menu.offsetWidth / 2 + 'px';
                        this.$emit('click');
                    }.bind(this));
                }
            }
        };
        app.component('mg-dropdown',def);
    });
})(HERE.FRAMEWORK.Application);