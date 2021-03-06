var currentDate = new Date();
var timeFormat = 1; 
//switchFormat(0);

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




	// display monthly timetable
	function displayMonth(offset, showRamadan) {
		var lat = $('#latitude').val();
		var lng = $('#longitude').val();
		var timeZone = $('#timezone').val();
		var dst = $('#dst').val();
		var method = $('#method').val();

		prayTimes.setMethod(method);
		currentDate.setMonth(currentDate.getMonth()+ 1* offset);
		var month = currentDate.getMonth();
		var year = currentDate.getFullYear();
		var title = monthFullName(month)+ ' '+ year;
		
		if (showRamadan){
			$('#table-title').html("June-July 2015");
			makeRamadanTable(year, 5, lat, lng, timeZone, dst);
		}
		else{
			$('#table-title').html(title);
			makeTable(year, month, lat, lng, timeZone, dst);
		}
		
	}

	// display monthly timetable
	function displayMonthSettings(offset, showRamadan) {
		var lat = window.localStorage.getItem("latitude");
		var lng = window.localStorage.getItem("longitude");
		
		var dst = window.localStorage.getItem("dst");
		var timeZone = window.localStorage.getItem("timezone");
		var method = window.localStorage.getItem("method");
		var _type = window.localStorage.getItem("type");
		

		prayTimes.setMethod(method);
		currentDate.setMonth(currentDate.getMonth()+ 1* offset);
		var month = currentDate.getMonth();
		var year = currentDate.getFullYear();
		var title = monthFullName(month)+ ' '+ year;
		
		if (showRamadan){
			$('#table-title').html("June-July 2015");
			makeRamadanTable(year, 5, lat, lng, timeZone, dst);
		}
		else{
			$('#table-title').html(title);
			makeTable(year, month, lat, lng, timeZone, dst);
		}
		
	}

	function getRamadanTimes(year, month, startDate, endDate, lat, lng, timeZone, dst){
		var schedule = [];
		var date = new Date(year, month, startDate);
		var endDate = new Date(year, month+ 1, endDate);
		var format = '24h';

		while (date < endDate) {
			var times = prayTimes.getTimes(date, [lat, lng], timeZone, dst, format);
			times.date = date;
			schedule.push(times);
			date.setDate(date.getDate()+ 1);  // next day
		}
		return schedule;
	}

	function makeRamadanTable(year, month, lat, lng, timeZone, dst){
		// var items = {day: 'Day', fajr: 'Fajr', sunrise: 'Sunrise', 
		// 			dhuhr: 'Dhuhr', asr: 'Asr', // sunset: 'Sunset', 
		// 			maghrib: 'Maghrib', isha: 'Isha'};
		var _type = window.localStorage.getItem("type");
		var items = {day: 'Day', presahoor:'Pre Sahoor', sahoor:'Sahoor',fajr: 'Fajr', 
					maghrib: 'Maghrib /Iftar'};

					var tbody = document.createElement('tbody');
					tbody.appendChild(makeTableRow(items, items, 'head-row'));

					var date = new Date(year, month, 16);
					var endDate = new Date(year, month+ 1, 18);
					var format = timeFormat ? '12hNS' : '24h';

					while (date < endDate) {
						var times = prayTimes.getTimes(date, [lat, lng], timeZone, dst, format);
						times.day = monthShortName(date.getMonth())+ "-" + date.getDate();

						if (_type == "1")
							times.sahoor = subtractTime(times.fajr, 10);
						else
							times.sahoor = times.fajr;

						times.presahoor = subtractTime(times.sahoor, 10);

						var today = new Date(); 
						var isToday = (date.getMonth() == today.getMonth()) && (date.getDate() == today.getDate());
						var klass = isToday ? 'today-row' : '';
						tbody.appendChild(makeTableRow(times, items, klass));
			date.setDate(date.getDate()+ 1);  // next day
		}
		removeAllChild($('#timetable'));
		if ($("#timetable")!= null)
			$('#timetable').append(tbody);
		else
			$('timetable').appendChild(tbody);
	}
	// make monthly timetable
	function makeTable(year, month, lat, lng, timeZone, dst) {		
		var items = {day: 'Day', fajr: 'Fajr', sunrise: 'Sunrise', 
					dhuhr: 'Dhuhr', asr: 'Asr', // sunset: 'Sunset', 
					maghrib: 'Maghrib', isha: 'Isha'};

					var tbody = document.createElement('tbody');
					tbody.appendChild(makeTableRow(items, items, 'head-row'));

					var date = new Date(year, month, 1);
					var endDate = new Date(year, month+ 1, 1);
					var format = timeFormat ? '12hNS' : '24h';

					while (date < endDate) {
						var times = prayTimes.getTimes(date, [lat, lng], timeZone, dst, format);
						times.day = date.getDate();
						var today = new Date(); 
						var isToday = (date.getMonth() == today.getMonth()) && (date.getDate() == today.getDate());
						var klass = isToday ? 'today-row' : '';
						tbody.appendChild(makeTableRow(times, items, klass));
			date.setDate(date.getDate()+ 1);  // next day
		}
		removeAllChild($('#timetable'));
		if ($("#timetable")!= null)
			$('#timetable').append(tbody);
		else
			$('timetable').appendChild(tbody);
	}

	// make a table row
	function makeTableRow(data, items, klass) {
		var row = document.createElement('tr');
		for (var i in items) {
			var cell = document.createElement('td');
			cell.innerHTML = data[i];
			cell.style.width = i=='day' ? '3.7em' : '3.7em';
			row.appendChild(cell);
		}
		row.className = klass;
		return row;		
	}

	// remove all children of a node
	function removeAllChild(node) {
		node.empty();
		// if (node == undefined || node == null)
		// 	return;

		// while (node.firstChild)
		// 	node.removeChild(node.firstChild);
	}

	// switch time format
	function switchFormat(offset) {
		var formats = ['24-hour', '12-hour'];
		timeFormat = (timeFormat+ offset)% 2;
		$('#time-format').innerHTML = formats[timeFormat];
		update();
	}

	// update table
	function update(ramadan, setting) {

		var lat = window.localStorage.getItem("latitude");
		var lng = window.localStorage.getItem("longitude");
		var _method = window.localStorage.getItem("method");

		if (_method != null)
			prayTimes = new PrayTimes(_method);


		if (setting)
			displayMonthSettings(0, ramadan);
		else{
			displayMonth(0, ramadan);
			lat = document.getElementById("latitude").value;
			lng = document.getElementById("longitude").value;
		}

		
		updateCityZip(lat, lng);
		
	}

	function updateCityZip(lat, lng){
		if (lat != undefined && lng != undefined){
			var pos = new google.maps.LatLng(lat, lng);
			var geocoder = new google.maps.Geocoder();
			geocoder.geocode({'latLng': pos}, function(results, status){
				if (results[1]){
					$("#city").text("City: " + results[1].formatted_address);
					//document.getElementById("city").innerText = "City: " + results[1].formatted_address;
				}
				else{
					$("#city").text("Error finding city");
				}

				if (results[0]){
					var _zipcode = results[0].address_components[5].long_name;
					$("#zip").val(_zipcode);
				}
			})
		}
	}

	function subtractTime(time, subtract){
		var t = time.split(':');
		if (t[1] < subtract){
			var s = subtract - parseInt(t[1]);
			var left = 60-s;
			return (parseInt(t[0])-1) + ":"+ left;
		}
		else{
			var mins =(parseInt(t[1])- subtract);
			return t[0] + ":" + (mins>10?mins:'0'+mins);
		}
	}
	function updateToday(){
		saveSettings();
		var lat = window.localStorage.getItem("latitude");
		var lng = window.localStorage.getItem("longitude");
		var _method = window.localStorage.getItem("method");
		var _timezone = window.localStorage.getItem("timezone");
		var _dst = window.localStorage.getItem("dst");
		var _type = window.localStorage.getItem("type");

		if (_method != null)
			prayTimes = new PrayTimes(_method);


		if (lat != undefined && lng != undefined){
			var items = {day: 'Date', sahoor: 'Sahoor', fajr: 'Fajr', sunrise: 'Sunrise', 
					dhuhr: 'Dhuhr', asr: 'Asr', // sunset: 'Sunset', 
					maghrib: 'Maghrib/ Iftar', isha: 'Isha'};

		var tbody = document.createElement('tbody');
		tbody.appendChild(makeTableRow(items, items, 'head-row'));

		
		var format = timeFormat ? '12hNS' : '24h';

		var times = prayTimes.getTimes(new Date(), [lat, lng], _timezone, _dst, format);
			times.day = new Date().toLocaleDateString("en-US",{
								     year: "numeric", month: "short",
								    day: "numeric"
								});
			if (_type == "1")
				times.sahoor = subtractTime(times.fajr, 10);
			else
				times.sahoor = times.fajr;

			tbody.appendChild(makeTableRow(times, items, "klass"));
		removeAllChild($('#todaytable'));
		if ($("#todaytable")!= null)
			$('#todaytable').append(tbody);
		else
			$('todaytable').appendChild(tbody);
		}
		//update todaytable

		updateCityZip(lat, lng);

		

	}

	function updateByZip(){
		//http://maps.googleapis.com/maps/api/geocode/json?address=l9t7t9
		var zipcode = document.getElementById("zip").value;
		if (zipcode.length == 5 && checkZipCode(zipcode)){
			updateGeocode(zipcode);
		}
		if (zipcode.length == 6){
			zipcode = zipcode.substr(0,3) + " " +zipcode.substr(3,3);
			zipcode = zipcode.toUpperCase();
			document.getElementById("zip").value = zipcode;

			if (checkPostal(zipcode))
				updateGeocode(zipcode);
			
		}
		
	}

	function updateGeocode(zipcode){
		var geocoder = new google.maps.Geocoder();
				geocoder.geocode({'address':zipcode}, function(results, status){
					if (results.length > 0 && results[0].geometry != null){
						document.getElementById("latitude").value = results[0].geometry.location.A;
						document.getElementById("longitude").value = results[0].geometry.location.F;
						updateToday();
					}
				});
	}

	function checkPostal(postal) {
		var regex = new RegExp(/^[ABCEGHJKLMNPRSTVXY]\d[ABCEGHJKLMNPRSTVWXYZ]( )?\d[ABCEGHJKLMNPRSTVWXYZ]\d$/i);
		if (regex.test(postal))
			return true;
		else return false;
	}

	function checkZipCode(zip){
		var regex = new RegExp (/^\d{5}$/i);
		if (regex.test(zip))
			return true;
		else
			return false;
	}

	// return month full name
	function monthFullName(month) {
		var monthName = new Array('January', 'February', 'March', 'April', 'May', 'June', 
			'July', 'August', 'September', 'October', 'November', 'December');
		return monthName[month];
	}

	function monthShortName(month){
		var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
		return monthNames[month];
	}

	// function $(id) {
	// 	return document.getElementById(id);
	// }