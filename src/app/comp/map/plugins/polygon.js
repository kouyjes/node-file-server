(function (L) {
    var areaClass = 'polygon-area';
    L.ShapeSelection.polygon = L.ShapeSelection.extend({
        shape:L.ShapeSelection.Shape.POLYGON,
        currentLineClass:'current-line',
        hitRadius:20,
        isHitPoint: function (e) {
            if(this.points.length < 2){
                return false;
            }
            var startPoint = this.points[0];
            var pos = e.layerPoint;
            var dis = Math.sqrt(Math.pow(pos.x - startPoint.x,2) + Math.pow(pos.y - startPoint.y,2));
            return dis <= this.hitRadius;
        },
        reset: function () {
            this.points.length = 0;
            this.drawState = 0;
            this.currentPoint = null;
        },
        onClick: function (e) {
            var container = this.panel._container;
            var pos = e.layerPoint,
                containerPos = e.containerPoint;

            var parent = d3.select(container);
            var g;
            var path;

            if(this.drawState === 2){
                this.el.remove();
                this.reset();
                return;
            }

            if(this.drawState === 0){
                g = parent.append('g').classed(this.groupClass,true).classed('polygon-group',true);
                this.el = g;
                path = g.append('path').classed(areaClass,true);
            }else{
                g = this.el;
                path = g.select('.' + areaClass);
            }

            if(this.isHitPoint(e)){
                var startPoint = this.points[0];
                path.classed('finished',true);
                this.points.push({
                    x:startPoint.x,
                    _x:containerPos.x,
                    y:startPoint.y,
                    _y:containerPos.y
                });
                this.drawState = 2;
                g.classed('finished',true);
                this.onFinish();
            }else{
                g.append('circle').classed(this.pointClass,true).classed(this.startPointClass,this.drawState === 0)
                    .attr('r','' + this.pointSize);
                this.points.push({
                    x:pos.x,
                    _x:containerPos.x,
                    y:pos.y,
                    _y:containerPos.y
                });
                this.drawState = 1;
            }

            this.update();

        },
        update: function () {
            if(!this.el || this.points.length === 0){
                return;
            }
            var startPoint = this.points[0];
            var points = this.points.slice(1);
            var startPointClass = this.startPointClass,
                currentPointClass = this.currentPointClass;
            this.el.selectAll('.' + this.pointClass).filter(function () {
                var el = d3.select(this);
                if(el.classed(startPointClass)){
                    el.attr('cx',startPoint.x).attr('cy',startPoint.y);
                    return false;
                }else if(el.classed(currentPointClass)){
                    return false;
                }
                return true;
            }).each(function (d,index) {
                var point = points[index];
                if(point){
                    d3.select(this).attr('cx',point.x).attr('cy',point.y);
                }
            });

            this.updateCurrentArea();
        },
        updateHelpLine: function () {
            if(!this.el || this.points.length === 0){
                return;
            }
            var lastPoint = this.points[this.points.length - 1];

            var pos = this.currentPoint;
            if(!pos){
                return;
            }
            this.el.select('.' + this.currentPointClass).attr('cx',pos.x).attr('cy',pos.y);
            var currentLine = this.el.select('.' + this.currentLineClass);
            currentLine.attr('x1',lastPoint.x).attr('y1',lastPoint.y);
            currentLine.attr('x2',pos.x).attr('y2',pos.y);
        },
        updateCurrentArea: function () {
            this.el.select('.' + areaClass).attr('d',this.getPathD());
        },
        getPathD: function () {
            var d = this.points.map(function (p,index) {
                if(index === 0){
                    return 'M' + p.x + ' ' + p.y;
                }
                return 'L' + p.x + ' ' + p.y;
            }).join(' ');
            if(this.drawState === 2){
                d += 'Z';
            }
            return d;
        },
        onMouseMove: function (e) {
            if(this.drawState !== 1){
                return;
            }
            var pos = e.layerPoint;
            var startPoint = this.points[0];
            var currentPoint = this.el.select('.' + this.currentPointClass);
            if(currentPoint.size() === 0){
                this.el.append('circle').classed(this.pointClass,true)
                    .classed(this.currentPointClass,true).attr('r',this.pointSize);
                this.el.append('line').classed(this.currentLineClass,true);
            }
            var isHit = this.isHitPoint(e);
            if(isHit){
                pos = startPoint;
            }
            this.currentPoint = {
                x:pos.x,
                y:pos.y
            };

            this.updateHelpLine();
        },
        getSelection: function () {
            if(this.drawState !== 2){
                return null;
            }
            var map = this.getMap();

            var points = this.points.map(function (point) {
                return map.layerPointToLatLng(point);
            });
            return {
                points:points
            };
        }
    });
    L.ShapeSelection.polygon.addInitHook(function () {
        this.points = [];
        this.currentPoint = null;
    });
})(L);