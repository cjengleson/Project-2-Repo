// index.js for project 3- wildfires project

// use d3 to read in samples.json located in data directory
d3.csv("static/Resources/or_df.csv").then((response) => {
    // console log for debugging
    console.log(response);

    // initialize arrays to hold CSV data
    var locations = [];
    var acresArray = [];
    var yearsArray = [];
    var causeArray = [];
    var countyArray = [];
    var reportArray = [];
    // loop through response (i.e., the csv) and push each element's information into the respective array
    for (var i = 0; i < response.length; i++) {
        var lat = response[i].latitude;
        var lon = response[i].longitude;
        var acres = response[i].total_acres;
        var years = response[i].fire_year;
        var cause = response[i].general_cause;
        var county = response[i].county;
        var report_date = response[i].report_date;
        if (lat) {
        locations.push([lat, lon]);
        acresArray.push(acres);
        yearsArray.push(years);
        causeArray.push(cause);
        countyArray.push(county);
        reportArray.push(report_date);
        }
    }

    // create array of objects in the order we prefer
    var data = [];
    var tempObj = {};
    for (var i = 0; i < response.length; ++i) {
        tempObj["report_date"] = reportArray[i];
        tempObj["county"] = countyArray[i];
        tempObj["total_acres"] = acresArray[i];
        tempObj["general_cause"] = causeArray[i];
        tempObj["fire_year"] = yearsArray[i];
        tempObj["location"] = locations[i];
        data.push(tempObj);
        tempObj = {};
    }

    //////////////////////////////////////////////////////////
    // initially, add all csv data to webpage table via d3 //
    ////////////////////////////////////////////////////////

    // create reference to table body tbody
    var tbody = d3.select("tbody");

    // function to add an array of objects to the table
    function addEntries(tableData) {
        
        // loop through data objects 
        tableData.forEach(item => {
            // create row and a variable to reference it
            var row = tbody.append("tr");

            // use Object.entries to access the current object's contents- loop through them
            Object.entries(item).forEach(([key,value]) => {

                //append table data for current key-value pair in object; check for values we want in the table
                if (key === "report_date") {
                    row.append("td").text(value);
                }
                if (key === "county") {
                    row.append("td").text(value);
                }
                if (key === "total_acres") {
                    row.append("td").text(value);
                }
                if (key === "general_cause") {
                    row.append("td").text(value);
                }

            });
        });
    }

    // call addEntries with all the table data from csv
    addEntries(data);


    ////////////////////////////////////////////
    // create event listening functionality  //
    //////////////////////////////////////////

    // select the button html tag
    var button = d3.select("#btnSearch");

    // select the form html tag
    var form = d3.selectAll("#form");

    // create event handlers for clicking 'Filter Table' and for pressing the enter key
    button.on("click",runEnter);
    form.on("change",runEnter);

    // create runEnter function to handle input from user
    function runEnter() {

        // prevent refreshing
        d3.event.preventDefault();

        // select all input html elements and grab the values inserted
        var dateValue = d3.select("#searchDate").property("value");
        var countyValue = d3.select("#searchCounty").property("value");
        var acresValue = d3.select("#searchTotalAcres").property("value");
        var causeValue = d3.select("#searchCause").property("value");


        //////////////////////
        // filter the data //
        ////////////////////

        // create variable to hold all of tableData, will skim non-matching results as we progress through each filter value
        var results = data;
        // create boolean as a flag to see if there are results to filter. 
        var empty = true;

        // if input values exist, filter the results by the value + set 'empty' to false
        if (dateValue) {
            results = results.filter(entry => entry.report_date===dateValue);
            empty = false;
        }
        if (countyValue) {
            results = results.filter(entry => entry.county.toLowerCase() === countyValue.toLowerCase());
            empty = false;
        }
        if (acresValue) {
            results = results.filter(entry => entry.total_acres === acresValue);       
            empty = false;
        }
        if (causeValue) {
            results = results.filter(entry => entry.general_cause.toLowerCase() === causeValue.toLowerCase());
            empty = false;
        }

        // check to see if there were entries to filter. if empty, do nothing (will leave tableData alone i.e., applies no filters); if not empty, add the filtered results.
        if(!empty) {
            // input was made by the user //

            // clear the table before populating with results
            tbody.html("");
            // call addEntries to display the filtered results (i.e., add to the table via d3)
            addEntries(results);
        }
    }

})