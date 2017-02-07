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


ko.bindingHandlers.marker = {

    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var map = bindingContext.$parent.mapControl;
        var location = valueAccessor().location;
        var latLng = new google.maps.LatLng(location.lat, location.lng);
        var marker = new google.maps.Marker({
            position: latLng,
            map: map,
            animation: google.maps.Animation.DROP,
            title: location.name
        });

        marker.addListener('click', function () {
            ko.bindingHandlers.marker.openInfoWindow(map, marker);
        });
    },

    openInfoWindow: function (map, marker) {
    	var self = this;
        var contentString = '<div">' + marker.getTitle() + '</div>';
        if (self.infowindow) {
            self.infowindow.close();
        };
        // display info window
        self.infowindow = new google.maps.InfoWindow({
            content: contentString
        });
        map.setZoom(15);
        // center map to location when info window open
        map.panTo(marker.getPosition());
        self.infowindow.open(map, marker);
        google.maps.event.addListener(self.infowindow, 'closeclick', function () {
            map.setZoom(15);
            map.setCenter(marker.getPosition());
        });
    }
};

$(document).ready(function(){
	google.maps.event.addDomListener(window, 'load', function () {

	    var mapOptions = {
            zoom: 15,
            center: new google.maps.LatLng(38.5386, -121.7531),
            mapTypeId: google.maps.MapTypeId.ROADMAP
	    };
	    var map = new google.maps.Map(document.getElementById('map'), mapOptions);

	    // var viewModel = {
	    //     locations: ko.observableArray([
	    //     	{ name: "Mondavi Center", lat: 38.5346, lng: -121.7488 },
	    //     	{ name: "Manetti Shrem Museum", lat: 38.5335, lng: -121.7479 },
	    //     	{ name: "International House", lat: 38.5465, lng: -121.7505 },
	    //     	{ name: "The ARC & Pavilion", lat: 38.5428, lng: -121.7592 },
	    //     	{ name: "Silo", lat: 38.5386, lng: -121.7531 },
	    //     	{ name: "Bohart Museum of Entomology", lat: 38.5354, lng: -121.7527 }
	    //     ]),
	    //     mapControl: map,
	    // };

	    var viewModel = {
	        locations: [
	        	{ name: "Mondavi Center", lat: 38.5346, lng: -121.7488 },
	        	{ name: "Manetti Shrem Museum", lat: 38.5335, lng: -121.7479 },
	        	{ name: "International House", lat: 38.5465, lng: -121.7505 },
	        	{ name: "The ARC & Pavilion", lat: 38.5428, lng: -121.7592 },
	        	{ name: "Silo", lat: 38.5386, lng: -121.7531 },
	        	{ name: "Bohart Museum of Entomology", lat: 38.5354, lng: -121.7527 }
	        ],
	        mapControl: map,
	        Query: ko.observable('')
	    };

	    // search function to filter through available locations
	    viewModel.searchResults = ko.computed(function() {
	    	var search = viewModel.Query();
		    return viewModel.locations.filter(function(location) {
		      return location.name.toLowerCase().indexOf(search) >= 0;
		    });
		}, viewModel);

	    ko.applyBindings(viewModel);
	});
})











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


