function openDeviceBrowser (externalLinkToOpen)
{
	window.open(externalLinkToOpen, '_system', 'location=no');
}

function saveAndBack(){
	saveSettings();
	window.location.href="index.html";

}

function saveAndCalendar(){
	saveSettings();
	window.location.href="calendar.html";

}


function setalarm(){
	//notification.showToast("hello there");
	//notification.get(12);
        //notification.getTriggered();
        saveSettings();
	window.location.href="setschedule.html";
}

function getLocation(){
	navigator.geolocation.getCurrentPosition(function(position){
			if (position != null){
				document.getElementById("latitude").value = position.coords.latitude;
				document.getElementById("longitude").value = position.coords.longitude;
				

				// var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
				// var geocoder = new google.maps.Geocoder();
				// geocoder.geocode({'latLng': pos}, function(results, status){
				// 	if (results[1]){
				// 		document.getElementById("city").innerText = "City: " + results[1].formatted_address;
				// 	}
				// 	else{
				// 		document.getElementById("city").innerText = "Error finding city";
				// 	}
				// })
				updateToday();
				//update(false, false);
			}
		}, function(err){alert("error!!!")},{timeout:10000, enableHighAccuracy: true, maximumAge:75000}
        );

}

function saveSettings(){
	if ($('#latitude').length > 0){
	var _lat = $('#latitude').val();
	var _lng = $('#longitude').val();
	var _zip = $('#zip').val();
	var _dst = $('#dst').val();
	var _timeZone = $('#timezone').val();
	var _method = $('#method').val();
	var _type = $("input[type=radio][name=type]:checked").val();

	window.localStorage.setItem("latitude",_lat);
	window.localStorage.setItem("longitude",_lng);
	window.localStorage.setItem("zip",_zip);
	window.localStorage.setItem("dst",_dst);
	window.localStorage.setItem("timezone",_timeZone);
	window.localStorage.setItem("method",_method);
	window.localStorage.setItem("type",_type);
	}
}

function fetchSettings()
{
	var _lat = window.localStorage.getItem("latitude");
	var _lng = window.localStorage.getItem("longitude");
	var _zip = window.localStorage.getItem("zip");
	var _dst = window.localStorage.getItem("dst");
	var _timezone = window.localStorage.getItem("timezone");
	var _method = window.localStorage.getItem("method");
	var _type = window.localStorage.getItem("type");
	if (_lat != null)
		$('#latitude').val(_lat);
	
	if (_lng != null)
		$('#longitude').val(_lng);
	
	if (_zip != null)
		$('#zip').val(_zip);
	
	if (_dst != null)
		$('#dst').val(_dst);
	
	if (_timezone != null)
		$('#timezone').val(_timezone);
	
	if (_method != null)
		$('#method').val(_method);
	
	if (_type != null)
		$("input[type=radio][name=type][value="+_type+"]").attr('checked',true);
}
