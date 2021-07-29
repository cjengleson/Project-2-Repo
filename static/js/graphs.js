// heatmap JS


// create promise
d3.csv("../Resources/or_df.csv").then(function(response) {
    console.log(response);

    ///////////////////////////////////
    // grab necessary data from CSV //
    /////////////////////////////////

    // initialize arrays to hold CSV data
    var locations = [];
    var acresArray = [];
    var yearsArray = [];
    var causeArray = [];
    var countyArray = [];
    var reportArray = [];
    
    // initialize decade arrays to hold all data for each decade
    var early = [];
    var late = [];

    // initialize decade location arrays to specifically hold locations of fires
    var earlyLocs = [];
    var lateLocs = [];

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
            earlyLocs.push([lat,lon]);
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
            lateLocs.push([lat,lon]);
        }
   
    }
    console.log(late.length, early.length);
    //////////////
    // Heatmap //
    ////////////

    // create streets tile layer
    var streets = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/streets-v11",
        accessToken: API_KEY,
    });

    // create array of decade location objects to loop through
    var decadeLocs = [
        {"decade": "1975-1981", "locations": earlyLocs},
        {"decade": "2015-2021", "locations": lateLocs}
    ];

    var heatlayers = {}

    // create map connection to html id == heatmap
    var myMap = L.map("heatmap", {
        center: [43.8041, -120.5542],
        zoom: 7,
        layers: streets,
    });

    decadeLocs.forEach(decade => {
        console.log(decade.decade);
        console.log(decade.locations);
        var heatlayer =  L.heatLayer(decade.locations, {
                radius: 80,
                blur: 2,
                gradient: {.1: 'yellow', .6: 'orange', 1: 'red'}
            });
        if(decade.decade === "1975-1981") {
            heatlayer.addTo(myMap);
        }
        heatlayers[decade.decade] = heatlayer;
        heatlayer = null;
    });

    // add control and layers
    L.control.layers(null, heatlayers).addTo(myMap);

});
