//////////////////
// Chloropleth //
////////////////

// Creating map object
var myMap = L.map("map", {
    center: [43.8041, -120.5542],
    zoom: 7
  });

  // Adding tile layer
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
}).addTo(myMap);

// set var to geoJson path
var geoPath = "../../Resources/us-county-boundaries.geojson";

// Grab data with d3 promise
d3.json(geoPath).then(function(geoData) {


    ///////////////////////////////////////////
    // Filtering and Adding Data to geojson //
    /////////////////////////////////////////

    // access the CSV via d3 promise
    d3.csv("../../Resources/or_df.csv").then(function(response) {

        /////////////////////////////////////////////
        // grab necessary data from wildfires CSV //
        ///////////////////////////////////////////

        // initialize arrays to hold CSV data
        var locations = [];
        var acresArray = [];
        var yearsArray = [];
        var causeArray = [];
        var countyArray = [];
        var reportArray = [];
        
        // initialize decade arrays to hold all data for each year
        var twenty11 = [];    var twenty13 = [];    var twenty19 = [];  

        // loop through response (i.e., the csv) and push each element's information into the respective array
        for (var i = 0; i < response.length; i++) {
            var lat = response[i].latitude;
            var lon = response[i].longitude;
            var acres = response[i].total_acres;
            var year = response[i].fire_year;
            var cause = response[i].general_cause;
            var county = response[i].county;
            var report_date = response[i].report_date;
            if (lat) {
            locations.push([lat, lon]);
            acresArray.push(acres);
            yearsArray.push(year);
            causeArray.push(cause);
            countyArray.push(county);
            reportArray.push(report_date);
            }

            // create decade arrays as we loop through entire dataset
            var tempObj = {};
                // 2011
            if (year === "2011") {
                tempObj["report_date"] = report_date;
                tempObj["county"] = county;
                tempObj["total_acres"] = acres;
                tempObj["general_cause"] = cause;
                tempObj["fire_year"] = year;
                tempObj["location"] = [lat,lon];
                twenty11.push(tempObj);
                tempObj = {};
            }
                // 2013
            else if (year === "2013") {
                tempObj["report_date"] = report_date;
                tempObj["county"] = county;
                tempObj["total_acres"] = acres;
                tempObj["general_cause"] = cause;
                tempObj["fire_year"] = year;
                tempObj["location"] = [lat,lon];
                twenty13.push(tempObj);
                tempObj = {};
            }
                // 2019
            else if (year === "2019") {
                tempObj["report_date"] = report_date;
                tempObj["county"] = county;
                tempObj["total_acres"] = acres;
                tempObj["general_cause"] = cause;
                tempObj["fire_year"] = year;
                tempObj["location"] = [lat,lon];
                twenty19.push(tempObj);
                tempObj = {};
            }  
        }

        // find unique countries in geoData 
        var uniqueCounties = [];
        geoData.features.forEach(obj => {
            uniqueCounties.push(obj.properties.name);
        })

        // loop through each unique county, sum the acres per year and then add to the geoJson a new key representing the specific years acre-total
        uniqueCounties.forEach(county => {
            var acreSum19 = 0;
            var acreSum13 = 0;
            var acreSum11 = 0;

            // 2019 summing and adding to geoData
            twenty19.forEach(obj => {
                if(obj.county === county) {
                    acreSum19+= parseFloat(obj.total_acres);
                }
            })
            geoData.features.forEach(obj => {
                if(obj.properties.name === county) {
                    obj.properties["sum19"] = String(acreSum19);
                }
            })

            // 2013 summing and adding
            twenty13.forEach(obj => {
                if(obj.county === county) {
                    acreSum13+= parseFloat(obj.total_acres);
                }
            })
            geoData.features.forEach(obj => {
                if(obj.properties.name === county) {
                    obj.properties["sum13"] = String(acreSum13);
                }
            })
            // 2011 summing and adding
            twenty11.forEach(obj => {
                if(obj.county === county) {
                    acreSum11+= parseFloat(obj.total_acres);
                }
            })
            geoData.features.forEach(obj => {
                if(obj.properties.name === county) {
                    obj.properties["sum11"] = String(acreSum11);
                }
            })

        });
        
    });
    console.log(geoData);  

    ///////////////////////////////////
    // Create new choropleth layers //
    /////////////////////////////////

        ///////////
        // 2011 // 
        /////////
    var geojson11 = L.choropleth(geoData, {

        // Define what  property in the features to use
        valueProperty: "sum11",

        // Set color scale
        scale: ["#ffffb2", "#b10026"],

        // Number of breaks in step range
        steps: 7,

        // q for quartile, e for equidistant, k for k-means
        mode: "q",
        style: {
        // Border color
        color: "#fff",
        weight: 1,
        fillOpacity: 0.8
        },

        // Binding a pop-up to each layer
        onEachFeature: function(feature, layer) {
        layer.bindPopup("County: " + feature.properties.name + "<br>Acres burned: <br>" 
            + feature.properties.sum11); 
        }
    }).addTo(myMap);


    // Set up the legend
    var legend11 = L.control({ position: "bottomright" });
    legend11.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend");
        var limits = geojson11.options.limits;
        var colors = geojson11.options.colors;
        var labels = [];

        // Add min & max
        var legendInfo = "<h1>Number of Fires 2011</h1>" +
        "<div class=\"labels\">" +
            "<div class=\"min\">" + limits[0] + "</div>" +
            "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
        "</div>";

        div.innerHTML = legendInfo;

        limits.forEach(function(limit, index) {
        labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
        });

        div.innerHTML += "<ul>" + labels.join("") + "</ul>";
        return div;
    };

    // // Adding legend to the map
    // legend.addTo(myMap);


        ///////////
        // 2013 //
        /////////
    var geojson13 = L.choropleth(geoData, {

        // Define what  property in the features to use
        valueProperty: "sum13",

        // Set color scale
        scale: ["#ffffb2", "#b10026"],

        // Number of breaks in step range
        steps: 7,

        // q for quartile, e for equidistant, k for k-means
        mode: "q",
        style: {
        // Border color
        color: "#fff",
        weight: 1,
        fillOpacity: 0.8
        },

        // Binding a pop-up to each layer
        onEachFeature: function(feature, layer) {
        layer.bindPopup("County: " + feature.properties.name + "<br>Acres burned: <br>" 
            + feature.properties.sum13); 
        }
    });

    // Set up the legend
    var legend13 = L.control({ position: "bottomright" });
    legend13.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend");
        var limits = geojson13.options.limits;
        var colors = geojson13.options.colors;
        var labels = [];

        // Add min & max
        var legendInfo = "<h1>Number of Fires 2013</h1>" +
        "<div class=\"labels\">" +
            "<div class=\"min\">" + limits[0] + "</div>" +
            "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
        "</div>";

        div.innerHTML = legendInfo;

        limits.forEach(function(limit, index) {
        labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
        });

        div.innerHTML += "<ul>" + labels.join("") + "</ul>";
        return div;
    };

    // // Adding legend to the map
    // // legend.addTo(myMap);

        ///////////
        // 2019 //
        /////////
        var geojson19 = L.choropleth(geoData, {

            // Define what  property in the features to use
            valueProperty: "sum19",
    
            // Set color scale
            scale: ["#ffffb2", "#b10026"],
    
            // Number of breaks in step range
            steps: 7,
    
            // q for quartile, e for equidistant, k for k-means
            mode: "q",
            style: {
            // Border color
            color: "#fff",
            weight: 1,
            fillOpacity: 0.8
            },
    
            // Binding a pop-up to each layer
            onEachFeature: function(feature, layer) {
            layer.bindPopup("County: " + feature.properties.name + "<br>Acres burned: <br>" 
                + feature.properties.sum19); 
            }
        });
        // .addTo(myMap) ^^^^^^^^^^
    
        // Set up the legend
        var legend19 = L.control({ position: "bottomright" });
        legend19.onAdd = function() {
            var div = L.DomUtil.create("div", "info legend");
            var limits = geojson19.options.limits;
            var colors = geojson19.options.colors;
            var labels = [];
    
            // Add min & max
            var legendInfo = "<h1>Number of Fires 2019</h1>" +
            "<div class=\"labels\">" +
                "<div class=\"min\">" + limits[0] + "</div>" +
                "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
            "</div>";
    
            div.innerHTML = legendInfo;
    
            limits.forEach(function(limit, index) {
            labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
            });
    
            div.innerHTML += "<ul>" + labels.join("") + "</ul>";
            return div;
        };
    
        // Adding legend to the map
        legend11.addTo(myMap);
        var currentLegend = legend11;

        myMap.on('baselayerchange', function (eventLayer) {
            if (eventLayer.name === '2011') {
                myMap.removeControl(currentLegend);
                currentLegend = legend11;
                legend11.addTo(myMap);
            }
            else if  (eventLayer.name === '2013') {
                myMap.removeControl(currentLegend);
                currentLegend = legend13;
                legend13.addTo(myMap);
            }
            else if  (eventLayer.name === "2019") {
               myMap.removeControl(currentLegend);
                currentLegend = legend19;
                legend19.addTo(myMap);
            }
          });
    
//////////////////////////////////////
    // set up choropleth layers and add to map
    var choroplethLayers = {
        "2011" : geojson11,
        "2013" : geojson13,
        "2019" : geojson19
    };

    L.control.layers(choroplethLayers).addTo(myMap);


});