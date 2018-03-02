(function (L) {
    var SelectionShape = L.ShapeSelection.Shape;
    L.Selection = L.SVG.extend({
        selections:{
            shape:null,
            startPoint:null
        },
        shapeSelection:null,
        enabled:false,
        _onFinish:null,
        enableSelection: function (shape) {
            if(shape in SelectionShape){
                this.selections.shape = shape;
                if(this.shapeSelection){
                    this.shapeSelection.clear();
                }
                this.shapeSelection = null;
                this.enabled = true;
            }
        },
        disableSelection: function () {
            this.enabled = false;
            if(this.shapeSelection){
                this.shapeSelection.clear();
                this.shapeSelection = null;
            }
        },
        _click: function (e) {
            if(!this.enabled){
                return;
            }
            var shape = this.selections.shape;
            if(!shape || !(shape in SelectionShape)){
                return;
            }
            if(!this.shapeSelection || this.shapeSelection.shape !== shape){
                this.shapeSelection = new (L.ShapeSelection[shape])(this);
                this.initShapeSelectionEvt();
            }
            this.shapeSelection.onClick(e);
        },
        _mouseMove: function (e) {
            var container = d3.select(this._map._container);
            container.classed('drawing',false);
            if(!this.enabled){
                return;
            }
            var shape = this.selections.shape;
            if(!this.shapeSelection || !shape || !(shape in SelectionShape)){
                return;
            }
            if(this.shapeSelection.drawState === 1){
                container.classed('drawing',this.shapeSelection.drawState === 1);
            }
            this.shapeSelection.onMouseMove(e);
        },
        _onMouseDown: function (e) {
            if(this.shapeSelection){
                this.shapeSelection.onMouseDown(e);
            }
        },
        _onMouseUp: function (e) {
            if(this.shapeSelection){
                this.shapeSelection.onMouseUp(e);
            }
        },
        getEvents: function () {
            var events = L.SVG.prototype.getEvents.call(this);
            events.click = this._click;
            events.mousemove = this._mouseMove;
            events.mousedown = this._onMouseDown;
            events.mouseup = this._onMouseUp;
            return events;
        },
        initShapeSelectionEvt: function () {
            if(this.shapeSelection){
                this.shapeSelection.onFinish(this._onFinish);
            }
        },
        onFinish: function (handler) {
            this._onFinish = handler;
            this.initShapeSelectionEvt();
        }
    });
    L.selection = function () {
        return new L.Selection();
    };
})(L);