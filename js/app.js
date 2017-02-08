// marker locations

// function initMap(){
// 	var mapOptions = {
// 		center: new google.maps.LatLng(38.5346, -121.7488),
// 		zoom: 18,
// 		mapTypeId: google.maps.MapTypeId.ROADMAP
// 	}

// 	var map = new google.maps.Map(document.getElementById('map'), mapOptions);

// 	var viewModel = {
// 		locations: ko.observableArray([{
// 			name: "Bohart Museum of Entomology", 
// 			latitude: 38.5354, 
// 			longitude: -121.7527
// 		}, {
// 			name: "Mondavi Center", 
// 			latitude: 38.5346, 
// 			longitude: -121.7488		
// 		}]),
// 		mapControl: map
// 	};

// 	ko.applyBindings(viewModel);
// }


// ko.bindingHandlers.marker = {

//     init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
//     	var self = this;
//         var map = bindingContext.$parent.mapControl;
//         var location = valueAccessor().location;
//         var latLng = new google.maps.LatLng(location.lat, location.lng);
//         // var visibleMarkers = ko.observableArray([]);

//         console.log(bindingContext)
//         console.log(valueAccessor())

//         // display marker
//         var request = {
//             position: latLng,
//             map: map,
//             animation: google.maps.Animation.DROP,
//             title: location.name,
//         	query: location.name
//         };
//         var marker = new google.maps.Marker(request);

//         marker.addListener('click', function () {
//             ko.bindingHandlers.marker.openInfoWindow(map, marker, request);
//         });
//     },

//     openInfoWindow: function (map, marker, request) {
//     	var self = this;
//     	var places = new google.maps.places.PlacesService(map);
//     	places.textSearch(request, callback);

//     	function callback(result, status) {
// 			if (status == google.maps.places.PlacesServiceStatus.OK) {
// 				// console.log(result[0]);
// 				// console.log(result[0].photos);

// 		        var contentString = '<div class="info-title">' + result[0].name + '</div>'
// 		        	+ '<div>' + result[0].rating + '</div>';
// 		        if (self.infowindow) {
// 		            self.infowindow.close();
// 		        };
// 		        // display info window
// 		        self.infowindow = new google.maps.InfoWindow({
// 		            content: contentString
// 		        });
// 		        // zoom in on map when clicked
// 		        // map.setZoom(16);
// 		        // change view to satellite when info window is open
// 		        // map.setMapTypeId('hybrid');
// 		        // center map to location when info window open
// 		        map.panTo(marker.getPosition());
// 		        self.infowindow.open(map, marker);
// 		        google.maps.event.addListener(self.infowindow, 'closeclick', function () {
// 		            map.setZoom(15);
// 		            map.setCenter(marker.getPosition());
// 		            map.setMapTypeId('terrain');
// 		        });
// 			}
//     	}
//     }
// };


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

        self.isVisible = ko.observable(false);
        self.isVisible.subscribe(function(currentState) {
			if (currentState) {
				self.marker.setMap(map);
			} else {
				self.marker.setMap(null);
			}
		});

		self.isVisible(true);

        // display info window
        self.infoWindow = function() {
        	var contentString = '<div class="info-title">' + name + '</div>';
	        if (self.infowindow) {
	            self.infowindow.close();
	        };
	        // display info window
	        self.infowindow = new google.maps.InfoWindow({
	            content: contentString
	        });
	        // center map to location when info window open
	        map.panTo(self.marker.getPosition());

	        google.maps.event.addListener(self.infowindow, 'closeclick', function () {
	            map.setZoom(15);
	            // map.setCenter(self.marker.getPosition());
	            map.setMapTypeId('terrain');
	        });

	        // self.marker.addListener('click', function() {
	        // 	self.infowindow.open(map, marker);
	        // });
	        // self.infowindow.open(map, marker);
        }
        self.addListener = google.maps.event.addListener(self.marker, 'click', (self.infoWindow));

        // marker.addListener('click', function () {
        //     ko.bindingHandlers.marker.openInfoWindow(map, marker, request);
        // });
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


 //    	var searchLocations = locationsModel.locations.filter(function(location) {
	//     	return location.name().toLowerCase().indexOf(search) >= 0;
	//     });
 //    	console.log(searchLocations)
	//     return searchLocations;
	// }, locationsModel);

    ko.applyBindings(locationsModel);

    // // locations view model
    // var locationsModel = {
    //     locations: [
    //     	{ name: "Mondavi Center", lat: 38.5346, lng: -121.7488 },
    //     	{ name: "Manetti Shrem Museum", lat: 38.5335, lng: -121.7479 },
    //     	{ name: "International House", lat: 38.5465, lng: -121.7505 },
    //     	{ name: "The ARC & Pavilion", lat: 38.5428, lng: -121.7592 },
    //     	{ name: "Silo", lat: 38.5386, lng: -121.7531 },
    //     	{ name: "Bohart Museum of Entomology", lat: 38.5354, lng: -121.7527 }
    //     ],
    //     mapControl: map,
    //     query: ko.observable(''),

    // };




    // visible marker array
    // var visibleMarkers = ko.observableArray([]);

    // viewModel.visibleMarkers


    // if search result == location name then open info window on click


// locationsModel.search = ko.dependentObservable(function() {
//     var self = this;
//     var search = self.query().toLowerCase();
//     // console.log(location)
//     return ko.utils.arrayFilter(self.locations, function(location) {
//     	console.log(location.name())
//         return location.name().toLowerCase().indexOf(search) >= 0;
//     });
// }, locationsModel);


})



/* citations

http://stackoverflow.com/questions/32899466/using-knockout-js-and-google-maps-api
http://jsfiddle.net/stesta/2T3Db/
http://jsfiddle.net/Wt3B8/23/
http://stackoverflow.com/questions/29557938/removing-map-pin-with-search
*/





// var GoogleMapViewModel = function() {
// 	var self = this;
// 	self.Lat = ko.observable(38.5346);
// 	self.Long = ko.observable(-121.7488);

// 	var map = new google.maps.Map(document.getElementById('map'), {
// 		center: 
// 	})


// }

// ko.applyBindings(new GoogleMapViewModel());

// // marker locations
// var initialLocations = [{
// 	name: "Mondavi Center", 
// 	latitude: 38.5346, 
// 	longitude: -121.7488
// }, {
// 	name: "Bohart Museum of Entomology", 
// 	latitude: 38.5354, 
// 	longitude: -121.7527
// }]

// // set initial map view of the Mondavi Center at Davis, California
// function initMap() {
// 	var mapOptions = {
// 		center: new google.maps.LatLng(38.5346, -121.7488),
// 		zoom: 18,
// 		mapTypeId: google.maps.MapTypeId.ROADMAP
// 	}

// 	var map = new google.maps.Map(document.getElementById('map'), mapOptions);
// }


// // set initial locations as array objects
// var initialLocations = [{
// 	name: "Mondavi Center", 
// 	latitude: 38.5346, 
// 	longitude: -121.7488
// }, {
// 	name: "Bohart Museum of Entomology", 
// 	latitude: 38.5354, 
// 	longitude: -121.7527
// }]

// var mapOptions = {
// 	center: init,
// 	zoom: 18,
// 	mapTypeId: google.maps.MapTypeId.ROADMAP
// }

// // set initial map view of the Mondavi Center at Davis, California
// function initializeMap() {
// 	var map,
// 		mondavi;

// 	mondavi = new google.maps.LatLng(38.5346, -121.7488);
// 	map = new google.maps.Map(document.getElementById('map'), {
// 		zoom: 18,
// 		center: mondavi
// 	});

// 	var marker = new google.maps.Marker({
// 		position: mondavi,
// 		map: map
// 	});
// }


// // // function used to add markers to the map
// // function addMarker(lat, long) {
// // 	var marker = new google.maps.Marker({
// // 		position: {lat, long},
// // 		map: map
// // 	});

// // }

// // addMarker(initialLocations[0].latitude, initialLocations[0].longitude);

// // var viewModel = {
// // 	query: ko.observable('')
// // };

// // ko.applyBindings(viewModel);


// // function GoogleMapViewModel(locations) {
// // 	var self = this;
// // 	var davis,
// // 		map,
// // 		marker,
// // 		location;

// // 	self.locations = ko.observableArray(locations);


// // 	// console.log(locations[0].latitude);





// // 	// function mapMarkers(locations) {
// // 	// 	// console.log(locations);
// // 	// 	console.log(locations[0].latitude);
// // 	// 	// for (var i = 0; i < locations.length; i++) {
// // 	// 	// 	console.log(locations[i].latitude);
// // 	// 	// 	console.log(locations[i].longitude);

// // 	// 	// 	var lat = locations[i].latitude;
// // 	// 	// 	var long = locations[i].longitude;

// // 	// 	// 	marker = new google.maps.Marker({
// // 	// 	// 		position: {lat, long},
// // 	// 	// 		map: map,
// // 	// 	// 		draggable: false
// // 	// 	// 	})
// // 	// 	// }
// // 	// }
	



// // 	// call initializeMap
// // 	// initializeMap(locations);
// // };

// // ko.applyBindings(new GoogleMapViewModel());
// // -end


