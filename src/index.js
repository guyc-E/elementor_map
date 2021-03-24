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
                title: "{name}",
                content: `
        <div class="popupImage">
          <img src="{imageUrl}" alt="{imageCaption}"/>
        </div>
        <div class="popupImageCaption">{imageCaption}</div>
        <div class="popupDescription">
          <p class="info">
            <span class="esri-icon-favorites"></span> {type}
          </p>
          <p class="info">
            <span class="esri-icon-map-pin"></span> {location}
          </p>
          <p class="info">
            <span class="esri-icon-documentation"></span> {facts}
          </p>
        </div>
        <div class="popupCredits">
          Sources: <a href="{sourceUrl}" target="_blank">{source}</a> released under <a href="{sourceCopyrightUrl}">{sourceCopyright}</a>, <a href="{imageCopyrightUrl}" target="_blank">{imageCopyright}</a>.
        </div>
      `
            }
        });
    
        map.layers.add(extremesLayer);
        //map.layers.removeAll()
    

        // Load Points
        function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
    
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
    
        fetch("../websites.json")
        .then(response => response.json())
        .then(data => {
            console.log(data)
            data.forEach( ( feature, index ) => {
                setTimeout(function(){
                    addFeature( feature ).then( () => {
                        view.goTo({
                            center: [ feature.geometry.coordinates[0] , feature.geometry.coordinates[1] ],
                            zoom: 3,
                            tilt: 75,
                            //heading: 105
                        })
                    } );
                }, (index + 1) * 3000);                
            });
        });

        // Change Counter
        const numberWithCommas = (x) => {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        }

        var counter = document.querySelector('.counter');
        var count = 7342123;
        counter.innerText = numberWithCommas(count);

        setInterval(function(){ 
            fetch("http://3.88.173.61:5000/counter")
            .then(response => response.json())
            .then(data => {
                console.log(data);
            });
            count = count + 11;
            counter.innerText = numberWithCommas(count + 11);
        }, 3000);


        // function join(t, a, s) {
        //     function format(m) {
        //         let f = new Intl.DateTimeFormat('en', m);
        //         return f.format(t);
        //     }
        //     return a.map(format).join(s);
        // }

        // let s = join(new Date, [{day: 'numeric'}, {month: 'short'}, {year: 'numeric'}], ' ');
        // console.log(s);
        // var date = new Date().toLocaleTimeString() + " " + s;
        // console.log(date);

        var today = new Date();
        var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];

        setInterval(() => {
            var time = today.getHours()+":"+today.getMinutes()+" | "+monthNames[today.getMonth()]+today.getDate()+", "+today.getFullYear();
            document.querySelector('.date').innerHTML = time;
        }, 60000);
        

        
        
        
        
        
        
        

        
        

    
    
    });
