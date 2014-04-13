var x = document.getElementById("location");
var lat;
var lon;

  	
function showPosition(position) {
	x.innerHTML="Latitude: " + position.coords.latitude + 
	"<br>Longitude: " + position.coords.longitude;	
	lat=position.coords.latitude;
	lon=position.coords.longitude;
}
$(document).ready(function() {
	var venId;
	var venName;
	if(navigator.geolocation){
		navigator.geolocation.getCurrentPosition(showPosition);
	} else{
		x.innerHTML="Geolocation is not supported by this browser.";
	}
	$.getJSON('https://api.foursquare.com/v2/venues/search?ll=40.52510,-74.4413445&intent=browse&radius=50&client_id=GXB5MO3ZVI55FR5MGV4IPMVB4RDUFCCQRZJGCTRDDR2UIDHF&client_secret=EI3XUMQ5MYXANF3WJUCTVLY25B4ZYUXBXOW1JHXT500AFKLW&v=1', function(json){
		$('.results').text(json.response.groups[0].items[0].id);
		venId = json.response.groups[0].items[0].id;
		$('.results').append(json.response.groups[0].items[0].name);
		venName = json.response.groups[0].items[0].name;
		sendVenueInfo();
	});
	$('#getLoc').click(function(event) {
		// 
	});

	$('#send').click(function() {
		var data = {};
		data.venue = {};
		data.venue.id = venId;
		data.venue.name = venName;
		data.message = "This is a test message, hoe";
		data.username = "mastermind";
		console.log(data);
		$.ajax({
			type:'POST',
			data:JSON.stringify(data),
			contentType:'application/json',
			url:'/send',
			success:function(data) {
				console.log('success');
				console.log(JSON.stringify(data));
			},
			error: function(err) {
				console.error(err);
			}
		});
	});
	function sendVenueInfo() {
		var socket = io.connect('http://localhost:3000'); 
		socket.emit('venId', { my: 'data' });
		socket.on('newMes', function (data) {
			$('#result').text(data);	
			console.log(data);
		});
	}
});


