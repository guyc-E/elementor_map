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
                color: [70, 242, 182],
                haloOpacity: 1
            }
        });
    
        view.ui.empty("top-left");
    
    
        //GeoJSONLayer
        window.extremesLayer = new GeoJSONLayer({
            url: "extreme-points.geojson",
            elevationInfo: {
                mode: "absolute-height",
                //offset: offset
            },
            renderer: {
                type: "simple",
                symbol: {
                    type: "point-3d",
                    symbolLayers: [{
                        type: "icon",
                        resource: { primitive: "circle" },
                        material: { color: [0, 0, 0, 0] },
                        outline: { color: [1, 1, 1, 1], size: 1 },
                        size: 10
                    }, 
                    // {
                    //     type: "icon",
                    //     resource: { primitive: "circle" },
                    //     material: { color: [0, 0, 0, 0] },
                    //     outline: { color: [245, 99, 66, 1], size: 4 },
                    //     size: 30
                    // }
                ]
                }
            },
            popupTemplate: {
                title: "<div>{name}</div><div>{country}</div>",
                content: `
                    <div class="popupDescription">

                    </div>
      `
            }
        });
    
        map.layers.add(extremesLayer);
        //map.layers.removeAll()
    

        // Load Points
        // function sleep(ms) {
        //     return new Promise(resolve => setTimeout(resolve, ms));
        // }
    
        function addFeature(feature) {
            const attributes = {};
            attributes["name"] = feature.properties.name;
            attributes["Address"] = "380 New York St";
            attributes["Report_Date"] = Date.now();
            

            var geometry =  {
                type: "point",  // autocasts as new Point()
                longitude: feature.geometry.coordinates[0],
                latitude: feature.geometry.coordinates[1]
            }
            const addFeature = new Graphic({
                geometry: geometry,
                attributes: attributes
            });
    
            const deleteFeature = {
                objectId: [467]
            };
    
            const promise = extremesLayer.applyEdits({
                addFeatures: [addFeature],
                deleteFeatures: [deleteFeature]
            });
            return promise;
        }



        fetch("http://3.88.173.61:5000/data")
        .then(response => response.json())
        .then(data => {
            //console.log(data.features)
            data.features.forEach( ( feature, index ) => {
                setTimeout(function(){
                    addFeature( feature ).then( () => {
                        view.goTo({
                            center: [ feature.geometry.coordinates[0] , feature.geometry.coordinates[1] ],
                            zoom: 3,
                            tilt: 75,
                            //heading: 105
                        })
                    } );
                }, (index + 1) * 5000);                
            });
        });


        // fetch("../websites.json")
        // .then(response => response.json())
        // .then(data => {
        //     console.log(data)
        //     data.forEach( ( feature, index ) => {
        //         setTimeout(function(){
        //             addFeature( feature ).then( () => {
        //                 view.goTo({
        //                     center: [ feature.geometry.coordinates[0] , feature.geometry.coordinates[1] ],
        //                     zoom: 3,
        //                     tilt: 75,
        //                     //heading: 105
        //                 })
        //             } );
        //         }, (index + 1) * 3000);                
        //     });
        // });

        //top countries
        fetch("http://3.88.173.61:5000/top_countries")
        .then(response => response.json())
        .then(data => {
            console.log(data.data)
            for(var i = 0; i < 5; i++){
                $('.top-countries').append('<div class="country"><div class="country-name">'+data.data[i].name+'</div><div class="country-count">'+data.data[i].sites+'</div></div>');
            }
        });

        // Change Counter
        const numberWithCommas = (x) => {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        }
        var counter = document.querySelector('.counter');
        setInterval(function(){ 
            fetch("http://3.88.173.61:5000/counter")
            .then(response => response.json())
            .then(data => {
                counter.innerText = numberWithCommas(data.total_site);
            });
        }, 3000);

        //Date
        var today = new Date();
        var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];

        setInterval(() => {
            var time = today.getHours()+":"+today.getMinutes()+" | "+monthNames[today.getMonth()]+today.getDate()+", "+today.getFullYear();
            document.querySelector('.date').innerHTML = time;
        }, 60000);

    });

    $( document ).ready(function() {
        $('.discover').on('click', () => {
            $('.discover').addClass('active');
            $('.live').removeClass('active');
        
            $('iframe').show();
            $('main, #viewDiv').hide();
        
        });
    
        $('.live').on('click', () => {
            $('.live').addClass('active');
            $('.discover').removeClass('active');
        
            $('iframe').hide();
            $('main, #viewDiv').show();
        
        });
    });


