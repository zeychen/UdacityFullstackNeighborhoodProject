// google map - working - start
var initialLocations = [
	{name: "Mondavi Center", latitude: 38.5346, longitude: -121.7488},
	{name: "Bohart Museum of Entomology", latitude: 38.5354, longitude: -121.7527}
]


function GoogleMapViewModel(locations) {
	var self = this;
	var davis,
		map,
		marker,
		location;

	self.locations = ko.observableArray(locations);


	// console.log(locations[0].latitude);



	// set initial map view of the Mondavi Center at Davis, California
	function initializeMap(locations) {
		// console.log(locations[0].latitude);
		// console.log(locations.length);
		davis = new google.maps.LatLng(38.5346, -121.7488);
		map = new google.maps.Map(document.getElementById('map'), {
			zoom: 18,
			center: davis
		});

		// console.log(locations);
		// mapMarkers(locations);

		// for (var i = 0; i < locations.length; i++) {
		// 	console.log(locations[i].latitude);

		// }
	};

	// function mapMarkers(locations) {
	// 	// console.log(locations);
	// 	console.log(locations[0].latitude);
	// 	// for (var i = 0; i < locations.length; i++) {
	// 	// 	console.log(locations[i].latitude);
	// 	// 	console.log(locations[i].longitude);

	// 	// 	var lat = locations[i].latitude;
	// 	// 	var long = locations[i].longitude;

	// 	// 	marker = new google.maps.Marker({
	// 	// 		position: {lat, long},
	// 	// 		map: map,
	// 	// 		draggable: false
	// 	// 	})
	// 	// }
	// }
	



	// call initializeMap
	initializeMap(locations);
};

ko.applyBindings(new GoogleMapViewModel());
// -end

