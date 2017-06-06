
$('#strength-option').click(function() {
    var checked = $(this).attr('checked');
    if (checked) {
        $('#toggle-strength').toggle('slide');
        $(this).attr('checked', false);
    }
    else {
        $(this).attr('checked', true);
    }
});
$('#cardio-option').click(function() {
    var checked = $(this).attr('checked');
    if (checked) {
        $('#toggle-cardio').toggle('slide');
        $(this).attr('checked', false);
    }
    else {
        $(this).attr('checked', true);
    }
});
$('#anchor1').click(function(){
    $('html, body').animate({
        scrollTop: $( $(this).attr('href') ).offset().top
    }, 500);
    return false;
});


// Google Map initialize
// function initialize() {
//   initMap();
//   initAutocomplete();
// }
// var myFunction = {};
//
// function initMap() {
//   var miami = {lat: 25.761681 , lng: -80.191788 };
//   var ny = {lat: 40.730610, lng:  -73.935242};
//   var map = new google.maps.Map(document.getElementById('map'), {
//     zoom: 12,
//     center: miami
//   });
//   var marker = new google.maps.Marker({
//     position: miami,
//     map: map
//   });
//   var marker2 = new google.maps.Marker({
//     position: ny,
//     map: map
//   });
//   var infowindow = new google.maps.InfoWindow({
//         content: "User sexy will workout legs at LAFitness on 6/3/2017!"
//   });
//   infowindow.open(map,marker);
// }
//
//
// //setting the geocoder
// var geocoder = new google.maps.Geocoder();
// myFunction.geocode = function() {
// 	var address = $('#address').val();
// 	geocoder.geocode( { 'address': address}, function(results, status) {
// 		if (status == google.maps.GeocoderStatus.OK)
// 		{
// 			map.setCenter(results[0].geometry.location);
// 			var marker = new google.maps.Marker({
// 				map: map,
// 				position: results[0].geometry.location
// 			});
// 		}
// 		else
// 		{
// 			alert("Geocode was not successful for the following reason: " + status);
// 		}
// 	});
// };
//
// // Autocomplete forms for Google Maps
// var placeSearch, autocomplete;
//       var componentForm = {
//         street_number: 'short_name',
//         route: 'long_name',
//         locality: 'long_name',
//         administrative_area_level_1: 'short_name',
//         country: 'long_name',
//         postal_code: 'short_name'
//       };
//
//       function initAutocomplete() {
//         // Create the autocomplete object, restricting the search to geographical
//         // location types.
//         autocomplete = new google.maps.places.Autocomplete(
//             /** @type {!HTMLInputElement} */(document.getElementById('autocomplete')),
//             {types: ['geocode']});
//
//         // When the user selects an address from the dropdown, populate the address
//         // fields in the form.
//         autocomplete.addListener('place_changed', fillInAddress);
//       }
//
//       function fillInAddress() {
//         // Get the place details from the autocomplete object.
//         var place = autocomplete.getPlace();
//
//         for (var component in componentForm) {
//           document.getElementById(component).value = '';
//           document.getElementById(component).disabled = false;
//         }
//
//         // Get each component of the address from the place details
//         // and fill the corresponding field on the form.
//         for (var i = 0; i < place.address_components.length; i++) {
//           var addressType = place.address_components[i].types[0];
//           if (componentForm[addressType]) {
//             var val = place.address_components[i][componentForm[addressType]];
//             document.getElementById(addressType).value = val;
//           }
//         }
//       }
//
//       // Bias the autocomplete object to the user's geographical location,
//       // as supplied by the browser's 'navigator.geolocation' object.
//       function geolocate() {
//         if (navigator.geolocation) {
//           navigator.geolocation.getCurrentPosition(function(position) {
//             var geolocation = {
//               lat: position.coords.latitude,
//               lng: position.coords.longitude
//             };
//             var circle = new google.maps.Circle({
//               center: geolocation,
//               radius: position.coords.accuracy
//             });
//             autocomplete.setBounds(circle.getBounds());
//           });
//         }
//       }
function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: -33.8688, lng: 151.2195},
    zoom: 13
  });
  var card = document.getElementById('pac-card');
  var input = document.getElementById('pac-input');
  var types = document.getElementById('type-selector');
  var strictBounds = document.getElementById('strict-bounds-selector');

  map.controls[google.maps.ControlPosition.TOP_RIGHT].push(card);

  var autocomplete = new google.maps.places.Autocomplete(input);

  // Bind the map's bounds (viewport) property to the autocomplete object,
  // so that the autocomplete requests use the current map bounds for the
  // bounds option in the request.
  autocomplete.bindTo('bounds', map);

  var infowindow = new google.maps.InfoWindow();
  var infowindowContent = document.getElementById('infowindow-content');
  infowindow.setContent(infowindowContent);
  var marker = new google.maps.Marker({
    map: map,
    anchorPoint: new google.maps.Point(0, -29)
  });

  autocomplete.addListener('place_changed', function() {
    infowindow.close();
    marker.setVisible(false);
    var place = autocomplete.getPlace();
    if (!place.geometry) {
      // User entered the name of a Place that was not suggested and
      // pressed the Enter key, or the Place Details request failed.
      window.alert("No details available for input: '" + place.name + "'");
      return;
    }

    // If the place has a geometry, then present it on a map.
    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport);
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(17);  // Why 17? Because it looks good.
    }
    marker.setPosition(place.geometry.location);
    marker.setVisible(true);

    var address = '';
    if (place.address_components) {
      address = [
        (place.address_components[0] && place.address_components[0].short_name || ''),
        (place.address_components[1] && place.address_components[1].short_name || ''),
        (place.address_components[2] && place.address_components[2].short_name || '')
      ].join(' ');
    }

    infowindowContent.children['place-icon'].src = place.icon;
    infowindowContent.children['place-name'].textContent = place.name;
    infowindowContent.children['place-address'].textContent = address;
    infowindow.open(map, marker);
  });

  // Sets a listener on a radio button to change the filter type on Places
  // Autocomplete.
  function setupClickListener(id, types) {
    var radioButton = document.getElementById(id);
    radioButton.addEventListener('click', function() {
      autocomplete.setTypes(types);
    });
  }

  setupClickListener('changetype-all', []);
  setupClickListener('changetype-address', ['address']);
  setupClickListener('changetype-establishment', ['establishment']);
  setupClickListener('changetype-geocode', ['geocode']);

  document.getElementById('use-strict-bounds')
      .addEventListener('click', function() {
        console.log('Checkbox clicked! New state=' + this.checked);
        autocomplete.setOptions({strictBounds: this.checked});
      });
    }
