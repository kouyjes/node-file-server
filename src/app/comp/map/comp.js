(function (Application,L) {
    var app = Application.app('comp');
    app.ready(function () {
        var def = {
            templateUrl:'map/comp.html',
            cssUrl:'map/comp.css',
            depResource: {
                type: 'js',
                serial:true,
                dependence:{
                    type:'js',
                    serial:true,
                    urls:[
                        'map/plugins/circle.js','map/plugins/rect.js',
                        'map/plugins/polygon.js'
                    ],
                    dependence:{
                        type:'js',
                        urls:[
                            'map/plugins/shape.js'
                        ]
                    }
                },
                urls: ['map/plugins/selection.js']
            },
            props:{
                src:{
                    type:String,
                    required:true
                },
                gisInfo: {
                    type: Object,
                    default: function () {
                        return {}
                    }
                },
                options: {
                    type: Object,
                    default: function () {
                        return {
                            toolbar: false,
                            zoom: 8
                        }
                    }
                }
            },
            data: function () {
                return {
                    state:{
                        toolbar:{
                            current:null
                        }
                    },
                    markerLayerArray: [],
                    map: {}
                };
            },
            methods:{
                enableShapeSelection: function (current) {
                    var selectionLayer = this.getSelectionLayer();
                    if(this.state.toolbar.current === current){
                        this.state.toolbar.current = null;
                        selectionLayer.disableSelection();
                        return;
                    }
                    this.state.toolbar.current = current;
                    var selectionLayer = this.getSelectionLayer();
                    selectionLayer.enableSelection(current);
                },
                getSelectionLayer: function () {
                    var el = this.$refs['el'];
                    console.log(el.selectionLayer);
                    return el.selectionLayer;
                },
                initMapLayer:function () {
                    var el = this.$refs['el'];
                    var optionsLatLng = this.options.defaultLatLng,
                        defaultLatLng = [23.735069188959354, 120.97595214843751],
                        optionsZoom = this.options.zoom,
                        defaultZoom = 8;
                    var latLng = (optionsLatLng && optionsLatLng.length) ? optionsLatLng: defaultLatLng;
                    var zoom = (optionsZoom && optionsZoom) ? optionsZoom: defaultZoom;
                    var map = this.map =  L.map(el,{
                        attributionControl:false,
                        zoomControl: false
                    }).setView(latLng, zoom);
                    L.tileLayer(this.src,{
                        minZoom: 2,
                        maxZoom: 18
                    }).addTo(map);
                },
                initMapSelectionLayer: function () {
                    var el = this.$refs['el'];
                    var map = this.map;
                    var selectionLayer = L.selection().addTo(map);
                    selectionLayer.onFinish(function (selection) {
                        this.$emit('selection-change',selection);
                    }.bind(this));
                    el.selectionLayer = selectionLayer;

                },
                addMarker: function () {
                    var keys = Object.keys(this.gisInfo);
                    if (keys.length) {
                        this.gisInfo[keys].forEach(function (info, index) {
                            var marker = L.marker(info.gis, {
                                title: index+1 + info.address,
                                riseOnHover: true
                            }).bindPopup(index+1 + info.address);
                            this.markerLayerArray.push(marker);
                        }.bind(this));
                        group = L.layerGroup(this.markerLayerArray);
                        this.map.addLayer(group);
                    }
                },
                setCenterByLatLng: function (gisObject) {
                    var maxZoom = this.map.getMaxZoom();
                    this.map.setView(gisObject.gis, maxZoom);
                }
            },
            mounted: function () {
                this.initMapLayer();
                this.addMarker(this.map);
                this.initMapSelectionLayer();
            },
            watch: {
            }
        };
        app.component('mg-map',def);
    });
})(HERE.FRAMEWORK.Application,L);