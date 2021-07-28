// graphing JS for graphs page

// create promise
d3.csv("../../Resources/or_df.csv").then(function(response) {
    //console.log(response);

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
    var sixties = [];    var seventies = [];    var eighties = [];    var nineties = [];    
    var double00s = [];    var twenty10s = [];    var twenty20s = [];

    // initialize decade location arrays to specifically hold locations of fires
    var sixtiesLocs = [];    var seventiesLocs = [];    var eightiesLocs = [];    var ninetiesLocs = [];    
    var double00sLocs = [];    var twenty10sLocs = [];    var twenty20sLocs = [];


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
            // 60s
        if (year > 1959 && year <= 1969) {
            tempObj["report_date"] = report_date;
            tempObj["county"] = county;
            tempObj["total_acres"] = acres;
            tempObj["general_cause"] = cause;
            tempObj["fire_year"] = year;
            tempObj["location"] = [lat,lon];
            sixties.push(tempObj);
            tempObj = {};
            sixtiesLocs.push([lat,lon]);
        }
            // 70s
        else if (year > 1969 && year <= 1979) {
            tempObj["report_date"] = report_date;
            tempObj["county"] = county;
            tempObj["total_acres"] = acres;
            tempObj["general_cause"] = cause;
            tempObj["fire_year"] = year;
            tempObj["location"] = [lat,lon];
            seventies.push(tempObj);
            tempObj = {};
            seventiesLocs.push([lat,lon]);
        }
            // 80s
        else if (year > 1979 && year <= 1989) {
            tempObj["report_date"] = report_date;
            tempObj["county"] = county;
            tempObj["total_acres"] = acres;
            tempObj["general_cause"] = cause;
            tempObj["fire_year"] = year;
            tempObj["location"] = [lat,lon];
            eighties.push(tempObj);
            tempObj = {};
            eightiesLocs.push([lat,lon]);
        }
            // 90s
        else if (year > 1989 && year <= 1999) {
            tempObj["report_date"] = report_date;
            tempObj["county"] = county;
            tempObj["total_acres"] = acres;
            tempObj["general_cause"] = cause;
            tempObj["fire_year"] = year;
            tempObj["location"] = [lat,lon];
            nineties.push(tempObj);
            tempObj = {};
            ninetiesLocs.push([lat,lon]);
        }
            // 2000s
        else if (year > 1999 && year <= 2009) {
            tempObj["report_date"] = report_date;
            tempObj["county"] = county;
            tempObj["total_acres"] = acres;
            tempObj["general_cause"] = cause;
            tempObj["fire_year"] = year;
            tempObj["location"] = [lat,lon];
            double00s.push(tempObj);
            tempObj = {};
            double00sLocs.push([lat,lon]);
        }
            // 2010s
        else if (year > 2009 && year <= 2020) {
            tempObj["report_date"] = report_date;
            tempObj["county"] = county;
            tempObj["total_acres"] = acres;
            tempObj["general_cause"] = cause;
            tempObj["fire_year"] = year;
            tempObj["location"] = [lat,lon];
            twenty10s.push(tempObj);
            tempObj = {};
            twenty10sLocs.push([lat,lon]);
        }
            // 2020s
        else if (year > 2020) {
            tempObj["report_date"] = report_date;
            tempObj["county"] = county;
            tempObj["total_acres"] = acres;
            tempObj["general_cause"] = cause;
            tempObj["fire_year"] = year;
            tempObj["location"] = [lat,lon];
            twenty20s.push(tempObj);
            tempObj = {};
            twenty20sLocs.push([lat,lon]);
        }
    }

    /////////////////////////////////////////////////////////
    // dynamically generate list of Decade options via d3 //    
    ///////////////////////////////////////////////////////
    var decades = ["60s", "70s", "80s", "90s", "00s", "10s","20s"];
    
    // create reference to select tag
    var sel = d3.select("#selDataset");

    // loop through decades
    decades.forEach(decade => {

        // create new option tag and save it to a variable
        var option = sel.append("option");
        option.attr("value", decade);
        option.text(decade);

    })

    //////////////
    // Heatmap //
    ////////////

    // create streets tile layer
    // var streets = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    //     attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    //     tileSize: 512,
    //     maxZoom: 18,
    //     zoomOffset: -1,
    //     id: "mapbox/streets-v11",
    //     accessToken: API_KEY
    // });

    // create array of decade location objects to loop through
    var decadeLocs = [
        {"decade": "60s", "locations": sixtiesLocs},
        {"decade": "70s", "locations": seventiesLocs}, 
        {"decade": "80s", "locations": eightiesLocs},
        {"decade": "90s", "locations": ninetiesLocs}, 
        {"decade": "2000s", "locations": double00sLocs}, 
        {"decade": "2010s", "locations": twenty10sLocs}, 
        {"decade": "2020s", "locations": twenty20sLocs}
    ];

    var heatlayers = {}

    decadeLocs.forEach(decade => {
        //console.log(decade.decade);
        var heatlayer =  L.heatLayer(decade.locations, {
                radius: 80,
                blur: 15,
                gradient: {.1: 'yellow', .6: 'orange', 1: 'red'}
            });
        heatlayers[decade.decade] = heatlayer;
        heatlayer = null;
    })

    // create map connection to html id == map
    var myMap = L.map("heatmap", {
        center: [43.8041, -120.5542],
        zoom: 7,
        layers: streets
    });

    L.control.layers(null, heatlayers).addTo(myMap);


})