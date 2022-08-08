(function($) {
    'use strict';
    
    $(document).ready(function(){
        var debug = false;
        var map = L.map('leaflet-map', { dragging: !L.Browser.mobile, tap: false, zoomControl: false }).setView([33.6502553, -111.9788628], 10);
        map.scrollWheelZoom.disable();
        L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);
        
        // Load paths from JSON file
        $.getJSON('./json/paths.json?v=' + new Date().getTime(), function(json) {
            var latlngs = json;
            var path = L.polyline.antPath(latlngs, {
                "delay": 1000,
                "dashArray": [
                    6,
                    60
                ],
                "weight": 6,
                "color": "#662410",
                "pulseColor": "#FFFFFF",
                "lineCap": "square",
                "opacity": 1,
                "paused": false,
                "reverse": false,
                "hardwareAccelerated": true
            });
            map.addLayer(path);
            map.fitBounds(path.getBounds(), { padding: [32, 16] });
            window.path = path;
        });

        // Load pins from JSON file
        var group = new L.featureGroup([]);
        $.getJSON('./json/pins.json?v=' + new Date().getTime(), function(json) {
            json.forEach(function(pin) {
                var icon = L.icon({ iconUrl: pin.icon, iconSize: [pin.width || 32, pin.height || 32], iconAnchor: [pin.width / 2 || 16, pin.height || 32], popupAnchor: [0, -pin.height || -32] });
                var marker = L.marker(pin.geo, { icon: icon }).addTo(group);
                if (pin.id == 'church') window.marker = marker;
                //marker.on('mouseover', function (e) { this.openPopup(); });
                //marker.on('mouseout', function (e) { this.closePopup(); map.fitBounds(window.path.getBounds(), { padding: [16, 16] }); });
                marker.bindPopup(
                    '<div class="title">' + pin.title + '</div>' +
                    '<div class="description">' + pin.description + '</div>'
                    );
                });

                // Open main popup by default
                window.marker.openPopup();
        });
        group.addTo(map);
        L.control.zoom({ position:'bottomright' }).addTo(map);
        
        // Mouse hover listener
        map.addEventListener('mousemove', function(ev) {
            // Debug geo-coordinates
            if (debug == true) {
                console.log('[' + ev.latlng.lat.toFixed(7) + ', ' + ev.latlng.lng.toFixed(7) + ']');
            }
        });

        // Update map resize when scrolling is triggered
        $(document).on('scroll', function(){ map.invalidateSize(); });
    });
})(jQuery);