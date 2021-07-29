// Graphing JS for graphs.html page

// Create a promise
d3.csv("../Resources/or_df.csv").then(function(response) {
    // console.log(response);

// Create the tile layer that will be the background of our map
var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "light-v10",
  accessToken: API_KEY
});

// 1975-1981 and 2015-2021

// Initialize all of the LayerGroups we'll be using
var layers = {
  LOCATIONS: new L.LayerGroup(),
};

// Create the map with our layers
var map = L.map("heatmap", {
  center: [40.73, -74.0059],
  zoom: 12,
  layers: [
    layers.LOCATIONS,
  ]
});

// Add our 'lightmap' tile layer to the map
lightmap.addTo(map);

// Create an overlays object to add to the layer control
var overlays = {
  "Locations": layers.LOCATIONS,
};

// Create a control for our layers, add our overlay layers to it
L.control.layers(null, overlays).addTo(map);

// Create a legend to display information about our map
var info = L.control({
  position: "bottomright"
});

// When the layer control is added, insert a div with the class of "legend"
info.onAdd = function() {
  var div = L.DomUtil.create("div", "legend");
  return div;
};
// Add the info legend to the map
info.addTo(map);

// Initialize an object containing icons for each layer group
var icons = {
  LOCATIONS: L.ExtraMarkers.icon({
    icon: "ion-settings",
    iconColor: "white",
    markerColor: "yellow",
    shape: "star"
  })
};

// Perform an API call to the cleaned Historical Wildfires in OR
d3.json("../Resources/or_df.csv").then(function(wildfires) {

    // Create an object to keep the number of markers in each layer
    var locationsCount = {
      LOCATIONS: 0,
    };

    // Initialize a locationsRadius, which will be used as a key to access the appropriate layers, icons, and radius count for layer group
    var locationsRadius;

        // Create a new location object with properties of both location objects
        var location = Object.assign({}, )

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

      // Create a new marker with the appropriate icon and coordinates
      var newMarker = L.marker([station.lat, station.lon], {
        icon: icons[stationStatusCode]
      });

      // Add the new marker to the appropriate layer
      newMarker.addTo(layers[stationStatusCode]);

      // Bind a popup to the marker that will  display on click. This will be rendered as HTML
      newMarker.bindPopup(station.name + "<br> Capacity: " + station.capacity + "<br>" + station.num_bikes_available + " Bikes Available");
    }

    // Call the updateLegend function, which will... update the legend!
    updateLegend(updatedAt, stationCount);
  });
});

// Update the legend's innerHTML with the last updated time and station count
function updateLegend(time, stationCount) {
  document.querySelector(".legend").innerHTML = [
    "<p>Updated: " + moment.unix(time).format("h:mm:ss A") + "</p>",
    "<p class='out-of-order'>Out of Order Stations: " + stationCount.OUT_OF_ORDER + "</p>",
    "<p class='coming-soon'>Stations Coming Soon: " + stationCount.COMING_SOON + "</p>",
    "<p class='empty'>Empty Stations: " + stationCount.EMPTY + "</p>",
    "<p class='low'>Low Stations: " + stationCount.LOW + "</p>",
    "<p class='healthy'>Healthy Stations: " + stationCount.NORMAL + "</p>"
  ].join("");
}
});