(function (L) {
    L.ShapeSelection.rect = L.ShapeSelection.circle.extend({
        shape:L.ShapeSelection.Shape.RECT,
        rectAssistCircleClass:'rect-help-circle',
        updateCurrentArea: function () {
            if(!this.el){
                return;
            }
            var pos = this.end.layerPoint;
            if(!pos){
                return;
            }
            var startPoint = this.start.layerPoint;
            var width = pos.x - startPoint.x,
                height = pos.y - startPoint.y;
            var x = startPoint.x,y = startPoint.y;
            if(width < 0){
                x = pos.x;
                width = Math.abs(width);
            }
            if(height < 0){
                y = pos.y;
                height = Math.abs(height);
            }
            this.el.select('.' + this.areaClass).attr('x',x).attr('y',y).attr('width',width).attr('height',height);
        },
        updateCurrentPoint: function () {
            var currentPoint = this.end.layerPoint;
            if(currentPoint){
                this.el.select('.' + this.currentPointClass).attr('cx',currentPoint.x).attr('cy',currentPoint.y);
            }
        },
        onMouseMove: function (e) {
            if(this.drawState !== 1){
                return;
            }
            this.syncCurrentPos(e);
            var area = this.el.select('.' + this.areaClass);
            if(area.size() === 0){
                this.el.append('rect').classed(this.areaClass,true);
                this.el.append('circle')
                    .classed(this.pointClass,true).classed(this.rectAssistCircleClass,true).classed(this.currentPointClass,true).attr('r',this.pointSize);
            }
            this.update();
        },
        getSelection: function () {
            if(this.drawState !== 2){
                return null;
            }
            var map = this.getMap();
            var pointA = this.start.layerPoint,
                pointD = this.end.layerPoint;
            if(!pointA || !pointD){
                return null;
            }
            var startLatLng = map.layerPointToLatLng(pointA),
                endLatLng = map.layerPointToLatLng(pointD);
            var pointB = {
                x:pointD.x,
                y:pointA.y
            };
            var width = map.distance(startLatLng,map.layerPointToLatLng(pointB)),
                height = map.distance(map.layerPointToLatLng(pointB),endLatLng);
            width = width / 1000;
            height = height / 1000;
            width = +width.toFixed(2);
            height = +height.toFixed(2);
            return {
                point:startLatLng,
                _point:endLatLng,
                width:width,
                height:height
            };
        }
    });
})(L);