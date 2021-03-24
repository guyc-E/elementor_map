require([
    "esri/Map",
    "esri/views/SceneView",
    "esri/layers/TileLayer",
    "esri/Basemap",
    "esri/layers/GeoJSONLayer",
    "esri/Graphic",
], function (Map, SceneView, TileLayer, Basemap, GeoJSONLayer, Graphic) {


    const basemap = new Basemap({
        baseLayers: [
            new TileLayer({
                //url: "https://services.arcgisonline.com/arcgis/rest/services/World_Terrain_Base/MapServer"
                url: "https://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer"
            })
        ]
    });

    // Map
    window.map = new Map({
        basemap: basemap
    });

    //SceneView
    window.view = new SceneView({
        container: "viewDiv",
        map: map,
        alphaCompositingEnabled: true,
        qualityProfile: "high",
        camera: {
            position: [-55.03975781, 14.94826384, 19921223.30821],
            heading: 2.03,
            tilt: 0.13
        },
        environment: {
            background: {
                type: "color",
                color: [255, 255, 255, 255]
                //color: [255, 252, 244, 0]
            },
            starsEnabled: false,
            atmosphereEnabled: false,
            lighting: {
                directShadowsEnabled: false,
                date: "Sun Jun 23 2019 19:19:18 GMT+0200 (Central European Summer Time)"
            }
        },
        constraints: {
            altitude: {
                min: 10000000,
                max: 25000000
            }
        },

        popup: {
            dockEnabled: true,
            dockOptions: {
                position: "top-right",
                breakpoint: false,
                buttonEnabled: false
            },
            collapseEnabled: false
        },
        highlightOptions: {
            color: [255, 255, 255],
            haloOpacity: 0.5
        }
    });

    view.ui.empty("top-left");


    //GeoJSONLayer
    const layer = new GeoJSONLayer({
        url: "test.json",
        elevationInfo: {
            mode: "absolute-height",
            //offset: offset
        },
        definitionExpression: "time >= 4",
        interval: {
            // set time interval to one day
            unit: "days",
            value: 1
        },
        renderer: {
            type: "simple",
            symbol: {
                type: "point-3d",
                symbolLayers: [{
                    type: "icon",
                    resource: {primitive: "circle"},
                    material: {color: [0, 0, 0, 0]},
                    outline: {color: [245, 99, 66, 1], size: 8},
                    size: 10
                }, {
                    type: "icon",
                    resource: {primitive: "circle"},
                    material: {color: [0, 0, 0, 0]},
                    outline: {color: [245, 99, 66, 1], size: 4},
                    size: 30
                }]
            }
        },
    });

    map.layers.add(layer);
    var g_counter = 0;
    view.whenLayerView(layer).then(function (lv) {
        layerView = lv;
        layerView.watch("updating", function (value) {

            // availableFields will become available
            // once the layer view finishes updating
            if (!value) {
                layerView.filter = {where:"time >10"};
                layerView.outfields = ["*"]
                layerView.queryFeatures({
                    outFields: layerView.availableFields,
                    // where: "time > 2"
                })
                    .then(function (results) {
                        console.log(results.features.length, " features returned");
                        console.log(results.features)
                    })
                    .catch(function (error) {
                        console.log("query failed: ", error);
                    });
            }
        });
    });
    //go to point
    // view.goTo({
    //     center: [-126, 49],
    //     zoom: 3,
    //     tilt: 75,
    //     heading: 105
    // })

    // view.goTo(graphic1)
    // .then(function() {
    //   return view.goTo(graphic2);
    // })
    // .then(function() {
    //   return view.goTo(graphic3);
    // });

//     setInterval(() => {
//         // First create a point geometry
//
// // Create a graphic and add the geometry and symbol to it
//         var pointGraphic = new Graphic({
//             geometry: point,
//             symbol: markerSymbol
//         });
//         // var expr= "time >=3 "+ Math.random()*10;
//         var expr = "time >=3 ";
//         console.log(expr);
//         layer.definitionExpression = expr;
//         // addFeature(pointGraphic)
//         // view.goTo({
//         //     center: [Math.floor(Math.random() * 100) , Math.floor(Math.random() * 100) ],
//         //     zoom: Math.floor(Math.random() * 10),
//         //     tilt: 75,
//         //     heading: 105
//         // })
//     }, 1000);


});