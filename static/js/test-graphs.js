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
  ACRES: new L.LayerGroup(),
  YEARS: new L.LayerGroup(),
  CAUSE: new L.LayerGroup(),
  COUNTY: new L.LayerGroup(),
  REPORT: new L.LayerGroup()
};

// Create the map with our layers
var map = L.map("heatmap", {
  center: [40.73, -74.0059],
  zoom: 12,
  layers: [
    layers.LOCATIONS,
    layers.ACRES,
    layers.YEARS,
    layers.CAUSE,
    layers.COUNTY,
    layers.REPORT
  ]
});

// Add our 'lightmap' tile layer to the map
lightmap.addTo(map);

// Create an overlays object to add to the layer control
var overlays = {
  "Locations": layers.LOCATIONS,
  "Acres": layers.ACRES,
  "Years": layers.YEARS,
  "Cause": layers.CAUSE,
  "County": layers.COUNTY,
  "Report": layers.REPORT
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
  }),
  ACRES: L.ExtraMarkers.icon({
      icon: "ion-android-bicycle",
      iconColor: "white",
      markerColor: "red",
      shape: "circle"
  }),
  YEARS: L.ExtraMarkers.icon({
      icon: "ion-minus-circled",
      iconColor: "white",
      markerColor: "blue-dark",
      shape: "penta"
  }),
  CAUSE: L.ExtraMarkers.icon({
      icon: "ion-android-bicycle",
      iconColor: "white",
      markerColor: "orange",
      shape: "circle"
  }),
  COUNTY: L.ExtraMarkers.icon({
      icon: "ion-android-bicycle",
      iconColor: "white",
      markerColor: "green",
      shape: "circle"
  }),
  REPORT: L.ExtraMarkers.icon({
      icon: "ion-android-bicycle",
      iconColor: "white",
      markerColor: "black",
      shape: "square"
  })
};

// Perform an API call to the cleaned Historical Wildfires in OR
d3.json("../Resources/or_df.csv").then(function(infoLocation) {
    var updatedAt = infoLocation.last_updated;
    var locationInfo = infoLocation.data.locations;

    // Create an object to keep the number of markers in locations
    var locationsCount = {
      LOCATIONS: 0,
      ACRES: 0,
      YEARS: 0,
      CAUSE: 0,
      COUNTY: 0,
      REPORT: 0
    };

    // Initialize a locationsRadiusCode, which will be used as a key to access the appropriate layers, icons, and radius count for layer group
    var locationsRadiusCode;

    // loop through response (i.e., the csv) and push each element's information into the respective array
    for (var i = 0; i < locationInfo.length; i++) {

        // Create a new location object with properties of both location objects
        var location = Object.assign({}, locationInfo[i]);
        // If a location 
        if (!location.locationsCount) {
            locationsRadiusCode = "LOCATIONS";
        }
        else if (!location.acres) {
            locationsRadiusCode = "ACRES";
        }
        else if (!location.fire_year) {
            locationsRadiusCode = "YEARS";
        }
        else if (!locations.general_cause) {
            locationsRadiusCode = "CAUSE";
        }
        else if (!locations.county) {
            locationsRadiusCode = "COUNTY";
        }
        else (!locations.report_date) {
            locationsRadiusCode = "REPORT";
        };

        // Update the location count
        locationsCount[locationsRadiusCode]++;
        // Create a new marker with the appropriate icon and coordinates
        var newMarker = L.marker([location.lat, location.lon], {
            icon: icons[locationsRadiusCode]
        });

        // Add the new marker to the appropriate layer
        newMarker.addTo(layers[locationsRadiusCode]);

        // Bind a popup to the marker that will display on click. This will be rendered as HTML
        newMarker.bindPopup(location.name + "<br> County: " + location.county + "<br> Acres: " + location.acres + "<br> Year: " + location.year + "Wildfires!");
        }

        // Call the updateLegend function, which will... update the legend!
        updateLegend(updatedAt, locationsCount);
    });
});

// Update the legend's innerHTML with the last updated time and location count
function updateLegend(time, locationsCount) {
    document.querySelector(".legend").innerHTML = [
        "<p>Updated: " + moment.unix(time).format("h:mm:ss A") + "</p>",
        "<p class='acres'>Acres Burned: " + location.ACRES + "</p>",
        "<p class='years'>Years: " + location.YEARS + "</p>",
        "<p class='cause'>Cause: " + location.CAUSE + "</p>",
        "<p class='county'>County: " + location.COUNTY + "</p>",
        "<p class='report'>Report: " + location.REPORT + "</p>"
    ].join("");
};