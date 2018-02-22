var URL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
var mapboxKey = "pk.eyJ1IjoibW1jbGF1Z2hsaW44NyIsImEiOiJjamRoank1NjQwd2R1MzNybGppOG9kZTdsIn0.2JTZIjgBlzTvfKjs7Rw_Dg"
var mapboxURL = "https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?"

d3.json(URL, function (data) {
    createFeatures(data.features)
});

function chooseColor(magnitude) {
    if (magnitude < 1) {
        return "#33BF00"
    }
    else if (magnitude < 2) {
        return "#6EC200"
    }
    else if (magnitude < 3) {
        return "#ACC600"
    }
    else if (magnitude < 4) {
        return "#CAA800"
    }
    else if (magnitude < 5) {
        return "#CE6D00"
    }
    else {
        return "#D23000"
    };
};

function createFeatures(earthquakeData) {
    var earthquakes = L.geoJSON(earthquakeData, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, {
                radius: feature.properties.mag * 4,
                fillColor: chooseColor(feature.properties.mag),
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            });
        }
    });
    createMap(earthquakes);
};

function createMap(earthquakes) {
    var streetmap = L.tileLayer(`${mapboxURL}access_token=${mapboxKey}`);
    var myMap = L.map("map", {
        center: [20, 0],
        zoom: 2.5,
        layers: [streetmap, earthquakes]
    });
    var legend = L.control({ position: 'bottomright' });

    legend.onAdd = function (map) {

        var div = L.DomUtil.create('div', 'info legend'),
            grades = [0, 1, 2, 3, 4, 5],
            labels = [];

        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + chooseColor(grades[i] + 1) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }

        return div;
    };

    legend.addTo(myMap);
};