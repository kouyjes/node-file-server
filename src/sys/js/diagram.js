var Diagram = (function ($) {
    var fontFamily = 'Microsoft YaHei';
    function Diagram(config){
        if(!config){
            throw new Error('Diagram parameter is invalid !');
        }
        this.container = config.container;
        this.model = config.model;
    }
    Diagram.prototype.render = function () {
        var diagram = this.diagram = $(go.Diagram, this.container, {
            initialContentAlignment: go.Spot.Center,
            "toolManager.mouseWheelBehavior": go.ToolManager.WheelZoom,
            layout: $(go.ForceDirectedLayout),
            "undoManager.isEnabled": true
        });

        var nodeTemplateParams = [];
        nodeTemplateParams.push(go.Node);
        nodeTemplateParams.push("Auto");
        //nodeTemplateParams.push(new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify));
        nodeTemplateParams.push($(go.Shape, "RoundedRectangle", {
                cursor: "pointer"
            },new go.Binding("fill", "color"))
        );
        nodeTemplateParams.push($(go.TextBlock, {
                margin:8,
                font: "bold 18px " + fontFamily,
                editable: false
            },
            new go.Binding('stroke','textColor'),
            new go.Binding("text").makeTwoWay())
        );


        diagram.nodeTemplate = $.apply(this,nodeTemplateParams);


        var linkTemplateParams = [];
        linkTemplateParams.push(go.Link);
        linkTemplateParams.push({
            curve: go.Link.Bezier, adjusting: go.Link.Stretch,
            reshapable: false, relinkableFrom: false, relinkableTo: false,
            toShortLength: 3
        });
        linkTemplateParams.push(new go.Binding("points").makeTwoWay());
        linkTemplateParams.push(new go.Binding("curviness"));
        linkTemplateParams.push( $(go.Shape,  // the link shape
            { strokeWidth: 2 },new go.Binding("stroke", "color")));
        linkTemplateParams.push($(go.Shape,  // the arrowhead
            { toArrow: "standard"},new go.Binding("stroke", "color")));

        diagram.linkTemplate = $.apply(this,linkTemplateParams);


        diagram.model = this.model;
    };

    return Diagram;
})(go.GraphObject.make);