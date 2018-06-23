//var mapboxToken = "pk.eyJ1IjoiaW5kcmFuaWsiLCJhIjoiY2pod202dXZ3MDJpNDNxbnRpdnF0Y3hwMiJ9.G-Msbu1I25lI-ZKiIcEIhA";


// Create the tile layer that will be the background of our map
var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token=" + "pk.eyJ1IjoiaW5kcmFuaWsiLCJhIjoiY2pod202dXZ3MDJpNDNxbnRpdnF0Y3hwMiJ9.G-Msbu1I25lI-ZKiIcEIhA", {
  attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
  maxZoom: 18
});

// Define variables for our tile layers
var satiliteMap = L.tileLayer(
  'https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v10/tiles/256/{z}/{x}/{y}?access_token=' + "pk.eyJ1IjoiaW5kcmFuaWsiLCJhIjoiY2pod202dXZ3MDJpNDNxbnRpdnF0Y3hwMiJ9.G-Msbu1I25lI-ZKiIcEIhA",{
    attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
    maxZoom: 18
  }
);


// Only one base layer can be shown at a time
var baseMaps = {
  Satilite: satiliteMap,
  Light: lightmap
};



  // Create map object and set default layers
  var myMap = L.map('map-id', {
    center: [20,-10],
    zoom: 2,
    layers: [satiliteMap]

  });

// Query URL
var baseURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";


// Assembling API query URL
var url = baseURL;
var geoJson;


function getMagnitudeColor(magnitude) {
    
    return  (magnitude > 5)  ? '#bd0026':
            (magnitude > 4) && (magnitude <= 5)  ? '#f03b20':
            (magnitude > 3) && (magnitude <= 4)  ? '#fd8d3c' :
            (magnitude > 2) && (magnitude <= 3)  ? '#feb24c' :
            (magnitude > 1) && (magnitude <= 2)  ? '#fed976' :
            '#ffffb2';// magnitude less than or equal to 1
            

}

function dateConversion(timestamp){
    var d = new Date(timestamp);
    // Will display time in 10:30:23 format
    var formattedTime = d.getDate() + '/' + (d.getMonth()+1) + '/' + d.getFullYear() + " Time : " + d.getHours() + ':' + d.getMinutes();
    //var formattedTime = d.format("dd.mm.yyyy hh:MM:ss")
    return formattedTime;
}

// Grabbing our GeoJSON data..
d3.json(url, function(data) {
    // Creating a geoJSON layer with the retrieved data
    geoJson = L.geoJson(data, {
          // Called on each feature
/* 
          style: function(feature) {
            return {color:getMagnitudeColor(feature.properties.mag) };
        }, */
        
        pointToLayer: function(feature, latlng) {
            var magnitude = feature.properties.mag;
            if(magnitude>0 && magnitude != null){
            return new L.CircleMarker(latlng, {radius: (feature.properties.mag * 2), fillOpacity: 0.85,color:getMagnitudeColor(feature.properties.mag)});
            };

        },

          onEachFeature: function(feature, layer) {
            // Setting various mouse events to change style when different events occur
            
            // Giving each feature a pop-up with information about that specific feature
            layer.bindPopup("<strong>Place: </strong>" +feature.properties.place + " <br>" +
                            "<strong>Date: </strong>" + dateConversion(feature.properties.time) + "<br>" +
                            "<strong>Magnitude: </strong>" + feature.properties.mag) ;
          }


    }).addTo(myMap);


    });

    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {
    
        var div = L.DomUtil.create('div', 'info legend'),
           
            labels = ["0 - 1","1 - 2","2 - 3","3 - 4","4 - 5"," > 5"];
            div.innerHTML = '<div><b>Legend<b></div>';
        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i <6 ; i++) {
            var p = i+1;
            console.log(p)
            div.innerHTML +=
                '<i style="background:' + getMagnitudeColor(p) + '">&nbsp;&nbsp;</i>&nbsp;&nbsp;' +
                labels[i]+'<br/>';
        }
    
        return div;
    };
    
    legend.addTo(myMap);

var Overlays = {
  };
  
L.control.layers(baseMaps, Overlays).addTo(myMap);


