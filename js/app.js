$(document).ready(function(){
	// Google map
    var mapOptions = {
        zoom: 15,
        center: new google.maps.LatLng(38.5386, -121.7531),
        mapTypeId: google.maps.MapTypeId.TERRAIN
    };

    var map = new google.maps.Map(document.getElementById('map'), mapOptions);

    // initialize info window
    var infowindow = new google.maps.InfoWindow();

	// map marker data model
	var mapMarkers = function(name, lat, long, foursquareid) {
		var self = this;
		var marker, latLng;
		var foursquareurl;

		self.name = ko.observable(name);
		self.lat = ko.observable(lat);
		self.long = ko.observable(long);
		self.foursquareid = ko.observable(foursquareid);

		latLng = new google.maps.LatLng(lat, long);

		

        // display marker
        var request = {
            position: latLng,
            map: map,
            animation: google.maps.Animation.DROP,
        };
        self.marker = new google.maps.Marker(request);

		// set marker to visible if in search list
        self.isVisible = ko.observable(false);
        self.isVisible.subscribe(function(currentState) {
        	infowindow.close();
			if (currentState) {
				self.marker.setMap(map);
			} else {
				self.marker.setMap(null);
			}
		});
		self.isVisible(true);

		// get place info from four square
		this.getContent = function() {


			// self.topTips = ko.observableArray([]);
			var topTips = [];
			var photos = [];
			var foursquareurl = 'https://api.foursquare.com/v2/venues/' + foursquareid + '/tips?sort=recent&limit=5&v=20150609&client_id=4EPS21I4V4MVCYXWDT4QNZZG1JETWZ2LIJMYQ34FNBWZ1RMV&client_secret=U3P1XLU204VMYO4BHGIWPDOY130Z1AFTT1OQTI2TY0HW0T43';
			var foursquarephotos = 'https://api.foursquare.com/v2/venues/' + foursquareid + '/photos?sort=recent&limit=5&v=20150609&client_id=4EPS21I4V4MVCYXWDT4QNZZG1JETWZ2LIJMYQ34FNBWZ1RMV&client_secret=U3P1XLU204VMYO4BHGIWPDOY130Z1AFTT1OQTI2TY0HW0T43';
			// console.log(foursquareurl)
			// return foursquareurl;

			$.getJSON(foursquareurl,
				function(data) {
				$.each(data.response.tips.items, function(i, tips){
					topTips.push('<li>' + tips.text + '</li>');
			});

			}).done(function(){

				self.comments = '<h3>5 Most Recent Comments</h3>' + '<ol class="tips">' + topTips.join('') + '</ol>';
			}).fail(function(jqXHR, textStatus, errorThrown) {
				self.comments = '<h3>5 Most Recent Comments</h3>' + '<h4>Oops. There was a problem retrieving this location\'s comments.</h4>';				
				console.log('getJSON request failed! ' + textStatus);
			});


			$.getJSON(foursquarephotos,
			function(data) {
				console.log(data.response.photos.items)
				$.each(data.response.photos.items, function(i, photos){
					self.photo = photos.prefix + '200x200' + photos.suffix;
					console.log(self.photo);
				});
			}).done(function(){
				self.photos = '<img src="' + self.photo + '">';
			}).fail(function(jqXHR, textStatus, errorThrown) {
				self.photos = '<h4>Oops. There was a problem retrieving this location\'s photos.</h4>';				
				console.log('getJSON request failed! ' + textStatus);
			});
		}();

		// open info window
        this.openInfoWindow = function() {
        	self.marker.setAnimation(google.maps.Animation.DROP);

	        // close all info window to ensure one info window is open at a time
	        for (var i = 0; i < locationsModel.locations().length; i++) {
	            infowindow.close();
	        }

	        // info window parameters
    		var contentString = '<h2 class="info-title">' + name + '</h2>' +
    			'<div class="info-comments">' + self.comments + '</div>' +
    			'<div class="info-photos">' + self.photos + '</div>';

	        infowindow.setContent(contentString);
	        infowindow.open(map, self.marker);

	        // center map to location when info window open
	        map.panTo(self.marker.getPosition());

	        // close info window
	        google.maps.event.addListener(infowindow, 'closeclick', function () {
	            map.panTo(self.marker.getPosition());
	        });

	        google.maps.event.addListener(map, 'click', function () {
	            infowindow.close();
	        });
        }
        this.addListener = google.maps.event.addListener(self.marker, 'click', (this.openInfoWindow));
	}

    // locations view model
    var locationsModel = {
        locations: ko.observableArray([
        	new mapMarkers ('Mondavi Center', '38.5346', '-121.7488', '4b0586baf964a520946b22e3' ),
        	new mapMarkers ('Memorial Union Art Gallery', '38.542154', '-121.7520577', '4b9d1b0ff964a5202f9036e3' ),
        	new mapMarkers ('International House', '38.5465', '-121.7505', '4ba1c28ff964a5203acb37e3'),
        	new mapMarkers ('The ARC & Pavilion', '38.5428', '-121.7592', '4d44f11de198721ea379c18b'),
        	new mapMarkers ('Silo', '38.5386', '-121.7531', '4b687e41f964a520f97b2be3'),
        	new mapMarkers ('Bohart Museum of Entomology', '38.5354', '-121.7527', '4bd7111e5631c9b69bdda630'),
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