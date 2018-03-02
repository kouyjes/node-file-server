(function (L) {
    var SelectionShape = {
        CIRCLE:'circle',
        RECT:'rect',
        POLYGON:'polygon'
    };
    Object.keys(SelectionShape).map(function (key) {
        SelectionShape[SelectionShape[key]] = true;
    });
    L.ShapeSelection = L.Class.extend({
        panel:null,
        el:null,
        shape:null,
        drawState:0,
        pointClass:'point',
        startPointClass:'start-point',
        currentPointClass:'current-point',
        groupClass:'selection-group',
        pointSize:8,
        drag:true,
        _onFinish:null,
        initialize: function (panel) {
            console.log(panel);
            this.panel = panel;
        },
        getMap: function () {
            if(!this.panel){
                return null;
            }
            return this.panel._map;
        },
        getSelection: function () {

        },
        reset: function () {

        },
        update: function () {

        },
        clear: function () {
            if(this.el){
                this.el.remove();
            }
        },
        onClick: function (e) {
            
        },
        onMouseDown: function (e) {
        },
        onMouseUp: function (e) {
        },
        onMouseMove: function () {
        },
        onFinish: function (handler) {
            if(arguments.length !== 0){
                if(typeof handler === 'function'){
                    this._onFinish = handler;
                }
                return;
            }
            if(typeof this._onFinish === 'function'){
                var selection = this.getSelection() || {};
                selection.shape = this.shape;
                this._onFinish(selection);
            }
        }
    });
    L.ShapeSelection.Shape = SelectionShape;
})(L);