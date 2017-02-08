$(document).ready(function(){
	// map marker data model
	var mapMarkers = function(name, lat, long) {
		var self = this;
		var marker, latLng;
		self.name = ko.observable(name);
		self.lat = ko.observable(lat);
		self.long = ko.observable(long);


		latLng = new google.maps.LatLng(lat, long);

        // display marker
        var request = {
            position: latLng,
            map: map,
            animation: google.maps.Animation.DROP,
            title: name,
        };
        self.marker = new google.maps.Marker(request);
        

        // set marker to visible if in search list
        self.isVisible = ko.observable(false);
        self.isVisible.subscribe(function(currentState) {
			if (currentState) {
				self.marker.setMap(map);
			} else {
				self.marker.setMap(null);
			}
		});
		self.isVisible(true);

		// infowindow
		self.contentString = '<div class="info-title">' + name + '</div>';


		// open info window for location marker
		self.infowindow = new google.maps.InfoWindow({
			content: self.contentString
		});

        this.openInfoWindow = function() {
	        // close all info window to ensure one info window is open at a time
	        for (var i = 0; i < locationsModel.locations().length; i++) {
	            locationsModel.locations()[i].infowindow.close();
	        }

	        // open info window
	        self.infowindow.open(map, self.marker);

	        // center map to location when info window open
	        map.panTo(self.marker.getPosition());

	        // close info window
	        google.maps.event.addListener(self.infowindow, 'closeclick', function () {
	            map.panTo(self.marker.getPosition());
	        });

	        google.maps.event.addListener(map, 'click', function () {
	            self.infowindow.close();
	        });
        }
        this.addListener = google.maps.event.addListener(self.marker, 'click', (this.openInfoWindow));
	}

	// Google map
    var mapOptions = {
        zoom: 15,
        center: new google.maps.LatLng(38.5386, -121.7531),
        mapTypeId: google.maps.MapTypeId.TERRAIN
    };

    var map = new google.maps.Map(document.getElementById('map'), mapOptions);

    // locations view model
    var locationsModel = {
        locations: ko.observableArray([
        	new mapMarkers ('Mondavi Center', '38.5346', '-121.7488' ),
        	new mapMarkers ('Manetti Shrem Museum', '38.5335', '-121.7479' ),
        	new mapMarkers ('International House', '38.5465', '-121.7505'),
        	new mapMarkers ('The ARC & Pavilion', '38.5428', '-121.7592'),
        	new mapMarkers ('Silo', '38.5386', '-121.7531'),
        	new mapMarkers ('Bohart Museum of Entomology', '38.5354', '-121.7527'),
        ]),
        mapControl: map,
        query: ko.observable(''),
    };

    // search function to filter through available locations
    locationsModel.searchResults = ko.computed(function() {
    	var search = locationsModel.query().toLowerCase();
    	// display marker of search results
    	return ko.utils.arrayFilter(locationsModel.locations(), function (location) {
	        var doesMatch = location.name().toLowerCase().indexOf(search) >= 0;
	        location.isVisible(doesMatch);
	        return doesMatch;
	    });
    });

    ko.applyBindings(locationsModel);
})



/* citations
http://stackoverflow.com/questions/32899466/using-knockout-js-and-google-maps-api
http://stackoverflow.com/questions/29557938/removing-map-pin-with-search
*/