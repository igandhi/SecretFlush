var x = document.getElementById("location");
var lat;
var lon;
if (navigator.geolocation){
   	navigator.geolocation.getCurrentPosition(showPosition);
} else{
	x.innerHTML="Geolocation is not supported by this browser.";
}
  	

function showPosition(position){
	x.innerHTML="Latitude: " + position.coords.latitude + 
	"<br>Longitude: " + position.coords.longitude;	
	lat=position.coords.latitude;
	lon=position.coords.longitude;
}

$().ready(function() {
	var venId;
	var venName;
	$('#getLoc').click(function(event) {
		$.getJSON('https://api.foursquare.com/v2/venues/search?ll='+lat+','+lon+'&intent=browse&radius=50&client_id=GXB5MO3ZVI55FR5MGV4IPMVB4RDUFCCQRZJGCTRDDR2UIDHF&client_secret=EI3XUMQ5MYXANF3WJUCTVLY25B4ZYUXBXOW1JHXT500AFKLW&v=1', function(json){
			$('.results').text(json.response.groups[0].items[0].id);
			venId = json.response.groups[0].items[0].id;
			$('.results').append(json.response.groups[0].items[0].name);
			venName = json.response.groups[0].items[0].name;
		});
	});

	$('#send').click(function() {
		var data = {};
		data.id = venId;
		data.name = venName;

		$.ajax({
			type:'POST',
			data:JSON.stringify(data),
			contentType:'application/json',
			url:'http://localhost:8000/send',
			success:function(data) {
				console.log('success');
				console.log(JSON.stringify(data));
			}
		});
	});
});
