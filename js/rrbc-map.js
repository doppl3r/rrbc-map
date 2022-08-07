(function($) {
    'use strict';
    
    $(document).ready(function(){
        var map = L.map('leaflet-map', { dragging: !L.Browser.mobile, tap: false }).setView([33.6502553, -111.9788628], 10);
        map.scrollWheelZoom.disable();
        L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', { maxZoom: 18 }).addTo(map);
        
        var latlngs = [
            [33.6517575, -111.9774950],
            [33.6515787, -111.9774896],
            [33.6515709, -111.9784390],
            [33.6513453, -111.9784337],
            [33.6512828, -111.9785356],
            [33.6500758, -111.9785302],
            [33.6500668, -111.9788575],
            [33.6501391, -111.9788575]
        ];
        var path = L.polyline.antPath(latlngs, {
            "delay": 1000,
            "dashArray": [
                10,
                50
            ],
            "weight": 5,
            "color": "#0000FF",
            "pulseColor": "#FFFFFF",
            "paused": false,
            "reverse": false,
            "hardwareAccelerated": true
        });
        
        
        
        map.addLayer(path);
        map.fitBounds(path.getBounds(), { padding: [16, 16] });
        
        map.addEventListener('mousemove', function(ev) {
            console.log('[' + ev.latlng.lat.toFixed(7) + ', ' + ev.latlng.lng.toFixed(7) + ']');
        });

        // Update map resize when scrolling is triggered
        $(document).on('scroll', function(){ map.invalidateSize(); });
    });
})(jQuery);