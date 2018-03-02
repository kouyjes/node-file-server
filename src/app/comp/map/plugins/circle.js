(function (L) {
    L.ShapeSelection.circle = L.ShapeSelection.extend({
        shape:L.ShapeSelection.Shape.CIRCLE,
        areaClass:'selection-area',
        circleLineClass:'circle-radius-line',
        circleAssistClass:'circle-help',
        reset: function () {
            this.drawState = 0;
            this.el = null;
            this.start.layerPoint = null;
            this.start.containerPoint = null;
            this.end.layerPoint = null;
            this.end.containerPoint = null;
        },
        onClick: function (e) {
            var container = this.panel._container;
            var pos = e.layerPoint,
                containerPos = e.containerPoint;
            if(this.drawState === 2){
                this.el.remove();
                this.reset();
                return;
            }
            if(this.drawState === 1){
                this.drawState = 2;
                this.el.classed('finished',true);
                this.update();
                this.onFinish();
                return;
            }
            var parent = d3.select(container);
            var g = parent.append('g').classed(this.groupClass,true);
            this.el = g;
            g.append('circle').classed(this.pointClass,true).classed(this.startPointClass,true).attr('r','' + this.pointSize);
            this.start.layerPoint = {
                x:pos.x,
                y:pos.y
            };
            this.start.containerPoint = {
                x:containerPos.x,
                y:containerPos.y
            };
            this.drawState = 1;

            this.update();
        },
        update: function () {

            this.updateStartPoint();
            this.updateCurrentArea();
            this.updateCurrentPoint();

        },
        updateStartPoint: function () {
            if(!this.el){
                return;
            }
            var startPoint = this.start.layerPoint;
            this.el.select('.' + this.startPointClass).attr('cx',startPoint.x).attr('cy',startPoint.y);
        },
        updateCurrentPoint: function () {

        },
        updateCurrentArea: function () {
            if(!this.el){
                return;
            }
            var startPoint = this.start.layerPoint;
            var currentPoint = this.end.layerPoint;
            if(currentPoint){
                var r = Math.sqrt(Math.pow(currentPoint.x - startPoint.x,2) + Math.pow(currentPoint.y - startPoint.y,2));
                this.el.select('.' + this.areaClass).attr('cx',startPoint.x).attr('cy',startPoint.y).attr('r',r);

                this.el.select('.' + this.circleAssistClass).attr('cx',currentPoint.x).attr('cy',currentPoint.y);
                this.el.select('.' + this.circleLineClass).attr('x1',startPoint.x).attr('y1',startPoint.y)
                    .attr('x2',currentPoint.x).attr('y2',currentPoint.y);
            }
        },
        syncCurrentPos: function (e) {
            var pos = e.layerPoint,
                containerPos = e.containerPoint;

            this.end.layerPoint = {
                x:pos.x,
                y:pos.y
            };
            this.end.containerPoint = {
                x:containerPos.x,
                y:containerPos.y
            };
        },
        onMouseMove: function (e) {
            if(this.drawState !== 1){
                return;
            }
            this.syncCurrentPos(e);
            var area = this.el.select('.' + this.areaClass);
            if(area.size() === 0){
                this.el.append('circle').classed(this.areaClass,true);
                this.el.append('circle').classed(this.pointClass,true).classed(this.circleAssistClass,true).attr('r',this.pointSize);
                this.el.append('line').classed(this.circleLineClass,true);
            }
            this.update();
        },
        getSelection: function () {
            if(this.drawState !== 2){
                return null;
            }
            var map = this.getMap();
            var startPoint = this.start.layerPoint,
                endPoint = this.end.layerPoint;
            if(!startPoint || !endPoint){
                return null;
            }
            var startLatLng = map.layerPointToLatLng(startPoint),
                endLatLng = map.layerPointToLatLng(endPoint);
            var radius = map.distance(startLatLng,endLatLng);
            radius = radius /  1000;
            radius = +radius.toFixed(2);
            return {
                point:startLatLng,
                radius:radius
            };
        }
    });
    L.ShapeSelection.circle.addInitHook(function () {
        this.start = {
            layerPoint:null,
            containerPoint:null
        };
        this.end = {
            layerPoint:null,
            containerPoint:null
        };
    });
})(L);