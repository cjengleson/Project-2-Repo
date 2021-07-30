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
var geoPath = "static/Resources/us-county-boundaries.geojson";

// Grab data with d3 promise
d3.json(geoPath).then(function(geoData) {


    ///////////////////////////////////////////
    // Filtering and Adding Data to geojson //
    /////////////////////////////////////////

    // access the CSV via d3 promise
    d3.csv("static/Resources/or_df.csv").then(function(response) {

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
        var early = [];    var late = [];   

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
                // 1975-1981
            if (year >= 1975 && year <= 1981) {
                tempObj["report_date"] = report_date;
                tempObj["county"] = county;
                tempObj["total_acres"] = acres;
                tempObj["general_cause"] = cause;
                tempObj["fire_year"] = year;
                tempObj["location"] = [lat,lon];
                early.push(tempObj);
                tempObj = {};
            }
                // 2015-2021
            else if (year >= 2015 && year <= 2021) {
                tempObj["report_date"] = report_date;
                tempObj["county"] = county;
                tempObj["total_acres"] = acres;
                tempObj["general_cause"] = cause;
                tempObj["fire_year"] = year;
                tempObj["location"] = [lat,lon];
                late.push(tempObj);
                tempObj = {};
            }
        }

        // find unique countries in geoData 
        var uniqueCounties = [];
        geoData.features.forEach(obj => {
            uniqueCounties.push(obj.properties.name);
        })
        var sum19 = 0;
        var sum20 = 0;
        // loop through each unique county, sum the acres per year and then add to the geoJson a new key representing the specific years acre-total
        uniqueCounties.forEach(county => {
            var earlySum = 0;
            var lateSum = 0;
            // 1975-1981 summing and adding to geoData
            early.forEach(obj => {
                if(obj.county === county) {
                    earlySum+= parseFloat(obj.total_acres);
                }
            });

            // 2015-2021 summing and adding
            late.forEach(obj => {
                if(obj.county === county) {
                    lateSum+= parseFloat(obj.total_acres);
                }
            });
            console.log(`${county} County\n1975-1981: ${earlySum}\n2015-2021: ${lateSum}`);
            sum19+=earlySum;
            sum20+=lateSum;
        });
        console.log(`early sum: ${sum19}\nlate sum: ${sum20}`);
    });

    ///////////////////////////////////
    // Create new choropleth layers //
    /////////////////////////////////

        ////////////////
        // 1975-1981 // 
        //////////////
    var geojson1975 = L.choropleth(geoData, {

        // Define what  property in the features to use
        valueProperty: "sum1975",

        // Set color scale
        scale: ["#ffffb2", "#b10026"],

        // Number of breaks in step range
        steps: 9,

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
        layer.bindPopup(feature.properties.name + " County<br>Acres burned: <br>" 
            + feature.properties.sum1975); 
        }
    }).addTo(myMap);


    // Set up the legend
    var legend1975 = L.control({ position: "bottomright" });
    legend1975.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend");
        var limits = geojson1975.options.limits;
        var colors = geojson1975.options.colors;
        var labels = [];

        // Add min & max
        var legendInfo = "<h1>Acres Burned 1975-1981</h1>" +
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

        ////////////////
        // 2015-2021 //
        //////////////
    var geojson2015 = L.choropleth(geoData, {

        // Define what  property in the features to use
        valueProperty: "sum2015",

        // Set color scale
        scale: ["#ffffb2", "#b10026"],

        // Number of breaks in step range
        steps: 9,

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
        layer.bindPopup(feature.properties.name + " County:<br>Acres burned: <br>" 
            + feature.properties.sum2015); 
        }
    });

    // Set up the legend
    var legend2015 = L.control({ position: "bottomright" });
    legend2015.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend");
        var limits = geojson2015.options.limits;
        var colors = geojson2015.options.colors;
        var labels = [];

        // Add min & max
        var legendInfo = "<h1>Acres Burned 2015-2021</h1>" +
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
        legend1975.addTo(myMap);
        var currentLegend = legend1975;

        myMap.on('baselayerchange', function (eventLayer) {
            if (eventLayer.name === '1975-1981') {
                myMap.removeControl(currentLegend);
                currentLegend = legend1975;
                legend1975.addTo(myMap);
            }
            else if  (eventLayer.name === '2015-2021') {
                myMap.removeControl(currentLegend);
                currentLegend = legend2015;
                legend2015.addTo(myMap);
            }
          });
    
    // set up choropleth layers and add to map
    var choroplethLayers = {
        "1975-1981" : geojson1975,
        "2015-2021" : geojson2015
    };

    L.control.layers(choroplethLayers).addTo(myMap);


});