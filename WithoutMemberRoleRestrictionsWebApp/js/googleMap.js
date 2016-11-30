
var map;
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: -33.8688, lng: 151.2195},
    zoom: 13
  });
  var input = /** @type {!HTMLInputElement} */(
      document.getElementById('pac-input'));

  var types = document.getElementById('type-selector');
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(types);

  var autocomplete = new google.maps.places.Autocomplete(input);
  autocomplete.bindTo('bounds', map);

  var infowindow = new google.maps.InfoWindow();
  var marker = new google.maps.Marker({
    map: map,
    anchorPoint: new google.maps.Point(0, -29)
  });

  autocomplete.addListener('place_changed', function() {
    infowindow.close();
    marker.setVisible(false);
    var place = autocomplete.getPlace();
    if (!place.geometry) {
      window.alert("Autocomplete's returned place contains no geometry");
      return;
    }

    // If the place has a geometry, then present it on a map.
    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport);
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(17);  // Why 17? Because it looks good.
    }
    marker.setIcon(/** @type {google.maps.Icon} */({
      url: place.icon,
      size: new google.maps.Size(71, 71),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(17, 34),
      scaledSize: new google.maps.Size(35, 35)
    }));
    marker.setPosition(place.geometry.location);
    marker.setVisible(true);

    var address = '';
    if (place.address_components) {
      address = [
        (place.address_components[0] && place.address_components[0].short_name || ''),
        (place.address_components[1] && place.address_components[1].short_name || ''),
        (place.address_components[2] && place.address_components[2].short_name || '')
      ].join(' ');
        console.log(place.address_components.length);
    for( i=0; i<place.address_components.length;i++){
      //SETTING FORM FIELDS!!!
          
          if(place.address_components[i].types[0]==="route"){
            console.log("Calle: "+ place.address_components[i].long_name);
            document.getElementById("Street").value =place.address_components[i].long_name;
          }
          if(place.address_components[i].types[0]==="administrative_area_level_2"){
            console.log("Ciudad: "+ place.address_components[i].long_name);
            document.getElementById("City").value =place.address_components[i].long_name;
          }
           if(place.address_components[i].types[0]==="administrative_area_level_1"){
            console.log("Estado/Provincia: "+ place.address_components[i].long_name);
            document.getElementById("State").value =place.address_components[i].long_name;
          }
          if(place.address_components[i].types[0]==="postal_code"){
            console.log("Postal: "+ place.address_components[i].long_name);
            document.getElementById("PostalCode").value =place.address_components[i].long_name;
          }
         }
		
	}

    infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
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

}

$(document).ready(function(){
	 $('#pac-input').bind('keyup', function () {
		 google.maps.event.trigger(map, "resize");
        google.maps.event.trigger(map, "resize");
    });
});

