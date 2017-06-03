(function ($, undefined)
{

var alignRight = function(){

    var docW = $(document).width();

    $('.gaddress').each( function(){

        var $fields = $(this).find('.city,.state,.postalCode,.country'), idx = 0, w = 0;
        $fields.each( function(i, e){
            w = parseInt( $(e).width() );
            if( 1 == idx % 2 && docW >= 768 ){
                $(e).css( { float: 'right' } );
            }else{
                $(e).css( { float: 'none' } );
            }
            idx ++;
        }); // each

    }); // each

}; // alignRight

alignRight();
$(window).resize( alignRight );

// $input is a jQuery input object
var gaComplete = function( $input ){
  var autocomplete,


  initAutocomplete = function () {
    $input.focus( geolocate );
    var options = {

        types: ['address']
    };
    autocomplete = new google.maps.places.Autocomplete(
        $input.get(0),
        options
    );
    autocomplete.addListener('place_changed', fillInAddress);
  }, // initAutocomplete


  fillInAddress = function () {
    // Get the place details from the autocomplete object.
    var place = autocomplete.getPlace();
    $input.closest('.gaddress').find('[data-gaddress-types]').each( function(){

      var $t = $(this),
      types  = $t.data('gaddress-types').replace(/\s+/g,' '),
      orType = types.indexOf(',') !== -1 ,
      types  = types.split( orType ? ',' : ' ' ),
      name   = $t.data('gaddress-name'),
      values = [];

      if(  !(name == 'long_name' || name == 'short_name') ){
        name = 'long_name';
      }

      for (var i = 0; i < place.address_components.length; i++) {
        var address = place.address_components[i];

        for (var j = 0; j < types.length; j++) {
          if( -1 !== $.inArray( types[j], address.types ) ){
            values.push( address[ name ] );
            if( orType ) break; // found one of the defined types
          }
        } // for j

        if( orType ) break; // found one of the defined types
      }// for i

      $t.val( values.join(' ') ).valid();

    });
  }, // fillInAddress


  geolocate = function () {
    if (!navigator.geolocation)
      return;

    navigator.geolocation.getCurrentPosition(function(position) {
      var geolocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      var circle = new google.maps.Circle({
        center: geolocation,
        radius: position.coords.accuracy
      });
      autocomplete.setBounds(circle.getBounds());
    });

  };

  // main
  initAutocomplete();

};


init = function (){
  $('input.gaddress-autocomplete').each( function(){
    gaComplete( $(this) );
  });
};


$.fn.gaddress = function (method)
{
    if ($.fn.gaddress[method])
    {
        return $.fn.gaddress[method].apply(this, Array.prototype.slice.call(arguments, 1));
    }
    else if (typeof method === "object" || !method)
    {
        return initialize.apply(this, arguments);
    }
    else
    {
        $.error("Method " + method + " does not exist on jQuery.gaddress");
    }
};

$.fn.gaddress.init = init;

})(jQuery);

$(document).gaddress('init');

	// start jqueryform initialization
	// --------------------------------
	JF.init('#jqueryform-c89ddb');

	// watch form element change event to run jqueryform's formlogic
	// ---------------------------------------------------------------
	var logics = [
    {
        "disabled": false,
        "action": "show",
        "selector": "f3",
        "match": "all",
        "rules": [
            {
                "disabled": false,
                "selector": "f2",
                "condition": "==",
                "value": "Strength"
            }
        ]
    },
    {
        "disabled": false,
        "action": "show",
        "selector": "f4",
        "match": "any",
        "rules": [
            {
                "disabled": false,
                "selector": "f2",
                "condition": "==",
                "value": "Cardio"
            }
        ]
    },
    {
        "disabled": false,
        "action": "hide",
        "selector": "f3",
        "match": "all",
        "rules": [
            {
                "disabled": false,
                "selector": "f2",
                "condition": "==",
                "value": "Cardio"
            }
        ]
    },
    {
        "disabled": false,
        "action": "hide",
        "selector": "f4",
        "match": "all",
        "rules": [
            {
                "disabled": false,
                "selector": "f2",
                "condition": "==",
                "value": "Strength"
            }
        ]
    }
];
	$('input,input:radio,select').change(function(){
		$.formlogic( {logics: logics} );
	});
// $('#strength-option').click(function() {
//     var checked = $(this).attr('checked');
//     if (checked) {
//         $('#toggle-strength').toggle('slide');
//         $(this).attr('checked', false);
//     }
//     else {
//         $(this).attr('checked', true);
//     }
// });
// $('#cardio-option').click(function() {
//     var checked = $(this).attr('checked');
//     if (checked) {
//         $('#toggle-cardio').toggle('slide');
//         $(this).attr('checked', false);
//     }
//     else {
//         $(this).attr('checked', true);
//     }
// });
$('#anchor1').click(function(){
    $('html, body').animate({
        scrollTop: $( $(this).attr('href') ).offset().top
    }, 500);
    return false;
});



//setting the geocoder
var geocoder = new google.maps.Geocoder();
myFunction.geocode = function() {
	var address = $('#address').val();
	geocoder.geocode( { 'address': address}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK)
		{
			map.setCenter(results[0].geometry.location);
			var marker = new google.maps.Marker({
				map: map,
				position: results[0].geometry.location
			});
		}
		else
		{
			alert("Geocode was not successful for the following reason: " + status);
		}
	});
};

// Getting geolocation for workoutRoutes

var x = document.getElementById("demo");

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
}

function showPosition(position) {
    x.innerHTML = "Latitude: " + position.coords.latitude +
    "<br>Longitude: " + position.coords.longitude;
}
