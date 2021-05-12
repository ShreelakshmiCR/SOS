
var capabilites;
var offerings;
var mymap;
var myChart;

$(document).ready(function(){
    
    $("#timeForm").hide();
    $("#availProp").hide();
    $("#availStn").hide();
    $('#timeSeries').hide();
	$("#bboxSearch").hide();
    map_new(["0", "0"]);
	$('#stations').select2();
});


$("#provider").click(function(){
  
	var div_data="<option value=\"gc\">GetCapabilities</option><option value=\"ds\">DescribeSensor</option><option value=\"go_airtemperature_1\">GetObservation Air Temperature</option><option value=\"go_pressure_1\">GetObservation Atmospheric Pressure</option>";
     $(div_data).appendTo('#requests'); 
	
});

$("#requests").on('change', function(){
	
	if($("#requests").val() == "gc"){
		$("#availProp").hide();
		$("#availStn").hide();
		$('#myChart').hide();
		$('#timeSeries').hide();
		$("#timeForm").hide();
		$("#bboxSearch").show();

		if(offerings!=null || offerings!=undefined){
		$('#map').children().remove();
		var latitudeLongArray = new Array(offerings.length);

		$.each(offerings,function(capI,capD)
				{
					// console.log(capD.latitude+" "+capD.longitude
						if(capD.latitude!=null && capD.longitude != null){
							var name = capD.description;
							if(name==null || name == "")
								name = capD.name;
						var latLong = [name, capD.latitude, capD.longitude];
						latitudeLongArray[capI] = latLong;
						}
				});
		mymap.remove();
		map_new(latitudeLongArray);
			}
		
	}
	
	else if( $("#requests").val() == "ds"){
		$("#availProp").show();
		$('#myChart').hide();
		  $("#availStn").show();
		  $('#timeSeries').hide();
		  $("#timeForm").hide();
		  $("#bboxSearch").hide();

		  if(offerings!=null || offerings!=undefined){
			$('#map').children().remove();
			var latitudeLongArray = new Array(offerings.length);
	
			$.each(offerings,function(capI,capD)
					{
						// console.log(capD.latitude+" "+capD.longitude
							if(capD.latitude!=null && capD.longitude != null){
								var name = capD.description;
								if(name==null || name == "")
									name = capD.name;
							var latLong = [name, capD.latitude, capD.longitude];
							latitudeLongArray[capI] = latLong;
							}
					});
			mymap.remove();
			map_new(latitudeLongArray);
				}
	}

	else
	{
		$("#bboxSearch").hide();
	//$("#stations").select2('destroy');
	//$("#stations").empty();
	$("#stations").children('option').hide();
	 var div_data="";
	 $('#map').children().remove();
	 var latitudeLongArray = new Array(offerings.length);
	 $.each(offerings,function(capI,capD)
	 {
		
		
		$.each(capD.observedProperty,function(opI,opD) {
			if($("#requests").val().includes("go_airtemperature") && opD == "http://mmisw.org/ont/cf/parameter/air_temperature")
			{
				
				$("#stations").children("option[value^='"+capD.name+"']").show();
				if(capD.latitude!=null && capD.longitude != null){ 
					latitudeLongArray.push([capD.name, capD.latitude, capD.longitude]);
				}
			}
			if($("#requests").val().includes("go_pressure") && opD == "http://mmisw.org/ont/cf/parameter/air_pressure_at_sea_level")
			{
				$("#stations").children("option[value^='"+capD.name+"']").show();
				if(capD.latitude!=null && capD.longitude != null){ 
					latitudeLongArray.push([capD.name, capD.latitude, capD.longitude]);
				}
			}
			if($("#requests").val().includes("go_conductivity") && opD == "http://mmisw.org/ont/cf/parameter/sea_water_electrical_conductivity")
			{
				$("#stations").children("option[value^='"+capD.name+"']").show();
				if(capD.latitude!=null && capD.longitude != null){ 
					latitudeLongArray.push([capD.name, capD.latitude, capD.longitude]);
				}
			}
			if($("#requests").val().includes("go_currents") && opD == "http://mmisw.org/ont/cf/parameter/currents")
			{
				$("#stations").children("option[value^='"+capD.name+"']").show();
				if(capD.latitude!=null && capD.longitude != null){ 
					latitudeLongArray.push([capD.name, capD.latitude, capD.longitude]);
				}
			}
			if($("#requests").val().includes("go_salinity") && opD == "http://mmisw.org/ont/cf/parameter/sea_water_salinity")
			{
				$("#stations").children("option[value^='"+capD.name+"']").show();
				if(capD.latitude!=null && capD.longitude != null){ 
					latitudeLongArray.push([capD.name, capD.latitude, capD.longitude]);
				}
			}
			if($("#requests").val().includes("go_waterlevel") && opD == "http://mmisw.org/ont/cf/parameter/sea_floor_depth_below_sea_surface")
			{
				$("#stations").children("option[value^='"+capD.name+"']").show();
				if(capD.latitude!=null && capD.longitude != null){ 
					latitudeLongArray.push([capD.name, capD.latitude, capD.longitude]);
				}
			}
			if($("#requests").val().includes("go_watertemperature") && opD == "http://mmisw.org/ont/cf/parameter/sea_water_temperature")
			{
				$("#stations").children("option[value^='"+capD.name+"']").show();
				if(capD.latitude!=null && capD.longitude != null){ 
					latitudeLongArray.push([capD.name, capD.latitude, capD.longitude]);
				}
			}
			if($("#requests").val().includes("go_waves") && opD == "http://mmisw.org/ont/cf/parameter/waves")
			{
				$("#stations").children("option[value^='"+capD.name+"']").show();
				if(capD.latitude!=null && capD.longitude != null){ 
					latitudeLongArray.push([capD.name, capD.latitude, capD.longitude]);
				}
			}
			if($("#requests").val().includes("go_winds") && opD == "http://mmisw.org/ont/cf/parameter/winds")
			{
				$("#stations").children("option[value^='"+capD.name+"']").show();
				if(capD.latitude!=null && capD.longitude != null){ 
					latitudeLongArray.push([capD.name, capD.latitude, capD.longitude]);
				}
			}
			$(div_data).appendTo('#stations');	
		});
	 });
	 mymap.remove();
	 map_new(latitudeLongArray);
	 //$('#stations').select2();	
	}
	//-------------------
	if( $("#requests").val().includes("_series")){
		$("#availProp").hide();
		 $("#availStn").show();
		$('#myChart').show();
		$('#timeSeries').show();
		$("#timeForm").show();
		$("#inTimeForm").hide();
	}
	else if($("#requests").val().includes("_1")){
		$("#availProp").hide();
		$('#myChart').hide();
		  $("#availStn").show();
		  $('#timeSeries').hide();
		  $("#inTimeForm").show();
		  $("#timeForm").show();
	}
	
	else {
		
		}
	 //---------------------------
	  
});

$("#bb-search-btn").click(function(){

	var llclat = $("#llclat").val();
	var llclon = $("#llclon").val();

	var urclat = $("#urclat").val();
	var urclon = $("#urclon").val();
	
	var lrclat = $("#llclat").val();
	var lrclon = $("#urclon").val();
	
	var ulclat = $("#llclat").val();
	var ulclon = $("#urclon").val();

	//mymap.remove();
	map_bb(llclat,llclon,ulclat,ulclon,lrclat, lrclon, urclat, urclon);

});

function getPropertyName(requestValue)
{
	var propertyName = "";
	switch(requestValue) {
		case 'go_airtemperature_1': propertyName = "air_temperature"; break;
		case 'go_airtemperature_series': propertyName = "air_temperature"; break;
		case 'go_pressure_1': propertyName = "air_pressure_at_sea_level"; break;
		case 'go_pressure_series': propertyName = "air_pressure_at_sea_level"; break;
		case 'go_conductivity_1': propertyName = "sea_water_electrical_conductivity"; break;
		case 'go_conductivity_series': propertyName = "sea_water_electrical_conductivity"; break;
		case 'go_currents_1': propertyName = "currents"; break;
		case 'go_currents_series': propertyName = "currents"; break;
		case 'go_salinity_1': propertyName = "sea_water_salinity"; break;
		case 'go_salinity_series': propertyName = "sea_water_salinity"; break;
		case 'go_waterlevel_1': propertyName = "sea_floor_depth_below_sea_surface"; break;
		case 'go_waterlevel_series': propertyName = "sea_floor_depth_below_sea_surface"; break;
		case 'go_watertemperature_1': propertyName = "sea_water_temperature"; break;
		case 'go_watertemperature_series': propertyName = "sea_water_temperature"; break;
		case 'go_waves_1': propertyName = "waves"; break;
		case 'go_waves_series': propertyName = "waves"; break;
		case 'go_winds_1': propertyName = "winds"; break;
		case 'go_winds_series': propertyName = "winds"; break;
	}
	return propertyName;
}


$("#request-btn").click(function(){
	insertXMLRequest($("#requests").val(), $("#stations").val(),$("#property").val());this.blur();
     var request_url = this.value;
     
     if($("#requests").val()=="gc"){
     $.ajax({
         type: "GET",
         beforeSend: function(){
        	    $('.ajax-loader').css("visibility", "visible");
        	  },
         url:"http://localhost:8080/ndbc/allstations",
         dataType: "json",
         contentType:'application/json',
         responseType:'application/json',
         cors: true ,
         secure: true,
         headers: {
             'Access-Control-Allow-Origin': '*',
         },
         success: function (data) {
        	 capabilites = data;
             
             // var respXML = data.capabilities.responseXML;
			 if(data.code == "000") 
			 	{

					var r = document.getElementById('results');
             
					r.value = data.capabilities.responseXML;

					var sations = data.capabilities.sensorIds;
					
					$.each(sations,function(i,data)
					{
					// alert(data.value+":"+data.text);
					var div_data="<option value="+data+">"+data+"</option>";
					// alert(div_data);
					$(div_data).appendTo('#stations'); 
					}); 
					$('#stations').select2();
					offerings= data.capabilities.observationOfferings;
					$('#map').children().remove();
					var latitudeLongArray = new Array(offerings.length);

					$.each(offerings,function(capI,capD)
							{
								// console.log(capD.latitude+" "+capD.longitude
									if(capD.latitude!=null && capD.longitude != null){
										var name = capD.description;
										if(name==null || name == "")
											name = capD.name;
									var latLong = [name, capD.latitude, capD.longitude];
									latitudeLongArray[capI] = latLong;
									}
							});
					mymap.remove();
					map_new(latitudeLongArray);
				}
			else
				{
						alert(data.message);
				}

             
             },
             complete: function(){
            	    $('.ajax-loader').css("visibility", "hidden");
            	  }
       });
     }
     
     else if($("#requests").val()=="ds"){
 		
 		$.ajax({
 	         type: "GET",
 	         beforeSend: function(){
 	        	    $('.ajax-loader').css("visibility", "visible");
 	        	  },
 	         url:"http://localhost:8080/ndbc/describesensor/"+$("#stations").val()+"::"+$("#property").val(),
 	         dataType: "json",
 	         contentType:'application/json',
 	         responseType:'application/json',
 	         cors: true ,
 	         secure: true,
 	         headers: {
 	             'Access-Control-Allow-Origin': '*',
 	         },
 	         success: function (data) {
 	             	             
				if(data.code == "000")
				{
					var r = document.getElementById('results');
 	             	r.value = data.sensorInfo.response;

					if(!(data.sensorInfo.sensorDesc.errorMessage ==null || data.sensorInfo.sensorDesc.errorMessage == undefined))
	            	 {
	            	 	alert(data.sensorInfo.sensorDesc.errorMessage);
	            	 }
 	            	else
 	            	{
 	            		var sensorDesc = [data.sensorInfo.sensorDesc.name, 
 	 	            	data.sensorInfo.sensorDesc.description, 
 	 	            	data.sensorInfo.sensorDesc.propertyName,
 	 	            	data.sensorInfo.sensorDesc.classifierPublisher,
 	 	            	data.sensorInfo.sensorDesc.country,
 	 	            	data.sensorInfo.sensorDesc.address,
 	 	            	data.sensorInfo.sensorDesc.latitude,
 	 	            	data.sensorInfo.sensorDesc.longitude];
 	 	            
 	 	           		mymap.remove();
 	 	           		map_desc("ds",sensorDesc, data.sensorInfo.sensorDesc.latitude, data.sensorInfo.sensorDesc.longitude,null,null);
 	 	             
 	            	}
				}
				else
				{
						alert(data.message);
				}             
 	             },
 	             complete: function(){
 	            	    $('.ajax-loader').css("visibility", "hidden");
 	            	  }
 	       });
 	}
    
    else if($("#requests").val().includes("_1")){
  		
  		$.ajax({
  	         type: "GET",
  	         beforeSend: function(){
  	        	    $('.ajax-loader').css("visibility", "visible");
  	        	  },
  	         url:"http://localhost:8080/ndbc/observation/"+$("#stations").val()+"/"+getPropertyName($("#requests").val())+"/"+$("#timePosition").val(),
  	         dataType: "json",
  	         contentType:'application/json',
  	         responseType:'application/json',
  	         cors: true ,
  	         secure: true,
  	         headers: {
  	             'Access-Control-Allow-Origin': '*',
  	         },
  	         success: function (data) {
  	             var r = document.getElementById('results');
  	             
  	             r.value = data.sensorInfo.response;
  	             
  	             if(!(data.sensorInfo.observation.errorMessage ==null || data.sensorInfo.observation.errorMessage == undefined))
  	            	 {
  	            	 	alert(data.sensorInfo.observation.errorMessage);
  	            	 }
  	             else
  	            	 {
  	            	 	var sensorDesc = [data.sensorInfo.observation.description, 
  	  	            	data.sensorInfo.observation.boundedBy, 
  	  	            	data.sensorInfo.observation.stationId,
  	  	            	data.sensorInfo.observation.time,
  	  	            	data.sensorInfo.observation.altitude,
  	  	            	data.sensorInfo.observation.altitudeUnit,
  	  	            	data.sensorInfo.observation.temperature,
  	  	            	data.sensorInfo.observation.temperatureUnit,
  	  	            	data.sensorInfo.observation.latitude,
  	  	            	data.sensorInfo.observation.longitude];
  	  	            
  	  	            	mymap.remove();
  	  	            	map_desc("go_airtemperature_1", sensorDesc, data.sensorInfo.observation.latitude, data.sensorInfo.observation.longitude,null,null);
  	            	 }
  	            
  	             
  	             },
  	             complete: function(){
  	            	    $('.ajax-loader').css("visibility", "hidden");
  	            	  }
  	       });
  	}
     
  else if($("#requests").val().includes("_series")){
   		
   		$.ajax({
   	         type: "GET",
   	         beforeSend: function(){
   	        	    $('.ajax-loader').css("visibility", "visible");
   	        	  },
   	         url:"http://localhost:8080/ndbc/observation/"+$("#stations").val()+"/"+getPropertyName($("#requests").val())+"/"+$("#beginTime").val()+"/"+$("#endTime").val(),
   	         dataType: "json",
   	         contentType:'application/json',
   	         responseType:'application/json',
   	         cors: true ,
   	         secure: true,
   	         headers: {
   	             'Access-Control-Allow-Origin': '*',
   	         },
   	         success: function (data) {
   	             var r = document.getElementById('results');
   	             
   	             r.value = data.sensorInfo.response;
   	             
   	             if(!(data.sensorInfo.observation.errorMessage ==null || data.sensorInfo.observation.errorMessage == undefined))
   	            	 {
   	            	 	alert(data.sensorInfo.observation.errorMessage);
   	            	 }
   	             else
   	            	 {
   	            	 	var sensorDesc = [data.sensorInfo.observation.description, 
   	  	            	data.sensorInfo.observation.boundedBy, 
   	  	            	data.sensorInfo.observation.stationId,
   	  	            	data.sensorInfo.observation.beginTime,
   	  	            	data.sensorInfo.observation.endTime,
   	  	            	data.sensorInfo.observation.altitude,
   	  	            	data.sensorInfo.observation.altitudeUnit,
   	  	            	//data.sensorInfo.observation.temperature,
   	  	            	data.sensorInfo.observation.temperatureUnit,
   	  	            	data.sensorInfo.observation.latitude,
   	  	            	data.sensorInfo.observation.longitude];
   	            	 	
   	            	 	
	  	            	
	  	            	var tempDates = [];
	  	            	var tempValues = [];
   	            	 $.each(data.sensorInfo.observation.airTempSeries,function(capI,capD)
   	            			 {
   	            		 			tempDates[capI] = capD.time;
   	            		 			tempValues[capI] = capD.temp;
   	            			 });
   	  	            
   	            	mymap.remove();
  	            	map_desc("go_airtemperature_series", sensorDesc, data.sensorInfo.observation.latitude, data.sensorInfo.observation.longitude,tempDates, tempValues);
   	  	            	
   	            	 }
   	            
   	             
   	             },
   	             complete: function(){
   	            	    $('.ajax-loader').css("visibility", "hidden");
   	            	  }
   	       });
   	}
     
});

$("#stations").on('change',function(){
	insertXMLRequest($("#requests").val(), $("#stations").val(),$("#property").val());
	$("#property option:selected").prop("selected", false);
	$.each(offerings,function(capI,capD)
            {
   	 			if(capD.name == $("#stations").val())
   	 				{
   	 					$("#beginTime").text(capD.beginTime);
   	 					$("#endTime").text(capD.endTime);
						$("#beginPosition").text(capD.beginTime);
   	 					$("#endPosition").text(capD.endTime);
   	 					$("#timePosition").val(capD.beginTime);
						$("#property").children('option').hide();
						$.each(capD.observedProperty,function(opI,opD) {
							if(opD == "http://mmisw.org/ont/cf/parameter/air_temperature")
							{
								$("#property").children("option[value^=airtemp1]").show();	
							}
							if(opD == "http://mmisw.org/ont/cf/parameter/air_pressure_at_sea_level")
							{
								$("#property").children("option[value^=baro1]").show();	
							}
							if(opD == "http://mmisw.org/ont/cf/parameter/sea_water_electrical_conductivity")
							{
								$("#property").children("option[value^=ct1]").show();	
							}
							if(opD == "http://mmisw.org/ont/cf/parameter/currents")
							{
								$("#property").children("option[value^=adcp0]").show();	
							}
							if(opD == "http://mmisw.org/ont/cf/parameter/sea_water_salinity")
							{
								$("#property").children("option[value^=ct1]").show();	
							}
							if(opD == "http://mmisw.org/ont/cf/parameter/sea_floor_depth_below_sea_surface")
							{
								$("#property").children("option[value^=tsunameter0]").show();	
							}
							if(opD == "http://mmisw.org/ont/cf/parameter/sea_water_temperature")
							{
								$("#property").children("option[value^=watertemp1]").show();	
							}
							if(opD == "http://mmisw.org/ont/cf/parameter/waves")
							{
								$("#property").children("option[value^=seismometer0]").show();	
							}
							if(opD == "http://mmisw.org/ont/cf/parameter/winds")
							{
								$("#property").children("option[value^=anemometer1]").show();	
							}
						});
   	 				}
            });
	
/*

	if($("#requests").val() != "gc" && $("#requests").val() != "ds"){
		$("#timeForm").show();
	
		$.each(offerings,function(capI,capD)
            {
   	 			if(capD.name == $("#stations").val())
   	 				{
   	 					$("#beginTime").text(capD.beginTime);
   	 					$("#endTime").text(capD.endTime);
						$("#beginPosition").text(capD.beginTime);
   	 					$("#endPosition").text(capD.endTime);
   	 					$("#timePosition").val(capD.beginTime);
						$("#property").children('option').hide();
						
   	 				}
            });
	
	}
	*/
});


function map_new(latlong) {
	
	mymap = L.map('map').setView(["19.076090", "72.877426"], 1);
	mapLink =
	  '<a href="http://openstreetmap.org">OpenStreetMap</a>';
	L.tileLayer(
	  'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	    attribution: '&copy; ' + mapLink + ' Contributors',
	    maxZoom: 18,
	  }).addTo(mymap);

	for (var i = 0; i < latlong.length; i++) {
		if(latlong[i]!=undefined){
	  marker = new L.marker([latlong[i][1], latlong[i][2]],{ iconOptions: { color: "rgb(0,0,100)" }})
	    .bindPopup(latlong[i][0])
	    .addTo(mymap);
		}
	}

	var polygon = L.rectangle([
		[51.509, -0.08],
		[51.503, -0.06],
		[51.51, -0.047],
		[51.61, -0.049]
	]).addTo(mymap);

}

function map_desc(requestType, latlongDetails, latitude, longitude, tempDates, tempValues) {
	
	mymap = L.map('map').setView([latitude, longitude], 1);
	mapLink =
	  '<a href="http://openstreetmap.org">OpenStreetMap</a>';
	L.tileLayer(
	  'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	    attribution: '&copy; ' + mapLink + ' Contributors',
	    maxZoom: 18,
	  }).addTo(mymap);
	
	var popMes = "";
	  for(var i=0;i<latlongDetails.length;i++)
		  {

			if(requestType == "ds")
			{
				if(i==0)
					popMes += "StationId    : <b>";
				if(i==1)
					popMes += "Description  : <b>";
				if(i==2)
					popMes += "Property     : <b>";
				if(i==3)
					popMes += "Organization : <b>";
				if(i==4)
					popMes += "Country      : <b>";
				if(i==5)
					popMes += "Address      : <b>";
				if(i==6 )
					popMes += "Latitude     : <b>";
				if(i==7 )
					popMes += "Logitude     : <b>";
					
				popMes += latlongDetails[i]+"</b><br>";
					
			}
		  	else if(requestType == "go_airtemperature_1" ){
		  		
				if(i==0)
					popMes += "Description  : <b>"+latlongDetails[i]+"</b><br>";
				//if(i==1)
				//	popMes += "Description  : <b>"
				if(i==2)
					popMes += "Station ID   : <b>"+latlongDetails[i]+"</b><br>";
				if(i==3)
					popMes += "Time         : <b>"+latlongDetails[i]+"</b><br>";
				if(i==4)
					popMes += "Altitude      : <b>"+latlongDetails[i]+" "+latlongDetails[i+1]+"</b><br>";
				if(i==6)
					popMes += "Temperature   : <b>"+latlongDetails[i]+" "+latlongDetails[i+1]+" "+cel+"</b><br>";
				if(i==8 )
					popMes += "Latitude     : <b>"+latlongDetails[i]+"</b><br>";
				if(i==9 )
					popMes += "Logitude     : <b>"+latlongDetails[i]+"</b><br>";
		  	}
			else if(requestType == "go_airtemperature_series"){
		  		
				if(i==0)
					popMes += "Description  : <b>"+latlongDetails[i]+"</b><br>";
				//if(i==1)
				//	popMes += "Description  : <b>"
				if(i==2)
					popMes += "Station ID   : <b>"+latlongDetails[i]+"</b><br>";
				if(i==3)
					popMes += "Begin Time   : <b>"+latlongDetails[i]+"</b><br>";
				if(i==4)
					popMes += "End Time     : <b>"+latlongDetails[i]+"</b><br>";
				if(i==5)
					popMes += "Altitude     : <b>"+latlongDetails[i]+" "+latlongDetails[i+1]+"</b><br>";
				if(i==8 )
					popMes += "Latitude     : <b>"+latlongDetails[i]+"</b><br>";
				if(i==9 )
					popMes += "Logitude     : <b>"+latlongDetails[i]+"</b><br>";
		  	}
		  	else
		  		{
		  			popMes += latlongDetails[i]+"<br>";
		  		}
		  }
	
	  marker = new L.marker([latitude, longitude])
	    .bindPopup(popMes)
	    .addTo(mymap);
	
	  if(requestType == "go_airtemperature_series"){
	 
	  
	  const data = {
			  labels: tempDates,
			  datasets: [{
			    label: 'Time Series',
			    backgroundColor: 'rgb(255, 99, 132)',
			    borderColor: 'rgb(255, 99, 132)',
			    data: tempValues,
			  }]
			};
	  
	  
	  
	  const config = {
			  type: 'line',
			  data,
			  options: {}
			};

	  if(myChart!=undefined && myChart!=null)
		  myChart.destroy();
		
	  myChart  = new Chart(
			  $('#myChart'),
			    config
			  );
	  $('#myChart').show();
	  }
}

function map_bb(llclat, llclong, ulclat, ulclon, lrclat, lrclon, urclat, urclon) {
	
	/*
	mymap = L.map('map').setView(["19.076090", "72.877426"], 8);
	mapLink =
	  '<a href="http://openstreetmap.org">OpenStreetMap</a>';
	L.tileLayer(
	  'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	    attribution: '&copy; ' + mapLink + ' Contributors',
	    maxZoom: 18,
	  }).addTo(mymap);*/

	  /*
	for (var i = 0; i < latlong.length; i++) {
		if(latlong[i]!=undefined){
	  marker = new L.marker([latlong[i][1], latlong[i][2]],{ iconOptions: { color: "rgb(0,0,100)" }})
	    .bindPopup(latlong[i][0])
	    .addTo(mymap);
		}
	}*/

	var polygon = L.rectangle([
		[llclat, llclong],
		[ulclat, ulclon],
		[lrclat, lrclon],
		[urclat, urclon]
	]).addTo(mymap);

	mymap.fitBounds(polygon.getBounds());

}

function insertXMLRequest(xmltype, stationId, propertyValue) {
	var pd = document.getElementById('POSTDATA');
	if (pd) {
		switch(xmltype) {
		case 'gc':
		pd.value = '<?xml version="1.0" encoding="UTF-8"?>\n\
<GetCapabilities xmlns="http://www.opengis.net/ows/1.1" xmlns:ows="http://www.opengis.net/ows/1.1" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.opengis.net/ows/1.1 fragmentGetCapabilitiesRequest.xsd" service="SOS">\n\
<AcceptVersions>\n\
<Version>1.0.0<\/Version>\n\
<\/AcceptVersions>\n\
<Sections>\n\
<Section>ServiceProvider<\/Section>\n\
<Section>ServiceIdentification<\/Section>\n\
<Section>Contents<\/Section>\n\
<\/Sections>\n\
<AcceptFormats>\n\
<OutputFormat>text/xml<\/OutputFormat>\n\
<\/AcceptFormats>\n\
<\/GetCapabilities>';
		break;
		case 'ds':
			pd.value = '<?xml version="1.0" encoding="UTF-8"?>\n\
<DescribeSensor xmlns="http://www.opengis.net/sos/1.0"\n\
xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n\
xmlns:sos="http://www.opengis.net/sos/1.0"\n\
xsi:schemaLocation="http://www.opengis.net/sos/1.0 http://schemas.opengis.net/sos/1.0.0/sosAll.xsd"\n\
service="SOS" outputFormat="text/xml;subtype=&quot;sensorML/1.0.1&quot;" version="1.0.0">\n\
<procedure>'+stationId.replace('station','sensor')+'::'+propertyValue+'<\/procedure>\n\
<\/DescribeSensor>';
			break;
		case 'go_airtemperature_1':
			pd.value = '<?xml version="1.0" encoding="UTF-8"?>\n\
<sos:GetObservation xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:om="http://www.opengis.net/om/1.0"\n\
xsi:schemaLocation="http://www.opengis.net/sos/1.0 http://schemas.opengis.net/sos/1.0.0/sosAll.xsd"\n\
xmlns:sos="http://www.opengis.net/sos/1.0" xmlns:ogc="http://www.opengis.net/ogc" xmlns:gml="http://www.opengis.net/gml/3.2"\n\
service="SOS" version="1.0.0" srsName="EPSG:4326">\n\
<sos:offering>'+stationId+'<\/sos:offering>\n\
<sos:eventTime>\n\
<ogc:TM_Equals>\n\
<ogc:PropertyName>om:samplingTime<\/ogc:PropertyName>\n\
<gml:TimeInstant>\n\
<gml:timePosition>'+$("#timePosition").val()+'<\/gml:timePosition>\n\
<\/gml:TimeInstant>\n\
<\/ogc:TM_Equals>\n\
<\/sos:eventTime>\n\
<sos:observedProperty>air_temperature<\/sos:observedProperty>\n\
<sos:responseFormat>text/xml;subtype="om/1.0.0"<\/sos:responseFormat>\n\
<sos:resultModel>om:Observation<\/sos:resultModel>\n\
<sos:responseMode>inline<\/sos:responseMode>\n\
<\/sos:GetObservation>';
			break;
		case 'go_airtemperature_series':
			pd.value = '<?xml version="1.0" encoding="UTF-8"?>\n\
<sos:GetObservation xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:om="http://www.opengis.net/om/1.0"\n\
xsi:schemaLocation="http://www.opengis.net/sos/1.0 http://schemas.opengis.net/sos/1.0.0/sosAll.xsd"\n\
xmlns:sos="http://www.opengis.net/sos/1.0" xmlns:ogc="http://www.opengis.net/ogc" xmlns:gml="http://www.opengis.net/gml/3.2"\n\
service="SOS" version="1.0.0" srsName="EPSG:4326">\n\
<sos:offering>'+stationId+'<\/sos:offering>\n\
<sos:eventTime>\n\
<ogc:TM_During>\n\
<ogc:PropertyName>om:samplingTime<\/ogc:PropertyName>\n\
<gml:TimePeriod>\n\
<gml:beginPosition>'+$("#beginTime").val()+'<\/gml:beginPosition>\n\
<gml:endPosition>'+$("#endTime").val()+'<\/gml:endPosition>\n\
<\/gml:TimePeriod>\n\
<\/ogc:TM_During>\n\
<\/sos:eventTime>\n\
<sos:observedProperty>air_temperature<\/sos:observedProperty>\n\
<sos:responseFormat>text/xml;subtype="om/1.0.0"<\/sos:responseFormat>\n\
<sos:resultModel>om:Observation<\/sos:resultModel>\n\
<sos:responseMode>inline<\/sos:responseMode>\n\
<\/sos:GetObservation>';
			break;
		case 'go_conductivity_1':
			pd.value = '<?xml version="1.0" encoding="UTF-8"?>\n\
<sos:GetObservation xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:om="http://www.opengis.net/om/1.0"\n\
xsi:schemaLocation="http://www.opengis.net/sos/1.0 http://schemas.opengis.net/sos/1.0.0/sosAll.xsd"\n\
xmlns:sos="http://www.opengis.net/sos/1.0" xmlns:ogc="http://www.opengis.net/ogc" xmlns:gml="http://www.opengis.net/gml/3.2"\n\
service="SOS" version="1.0.0" srsName="EPSG:4326">\n\
<sos:offering>urn:ioos:station:wmo:41012<\/sos:offering>\n\
<sos:eventTime>\n\
<ogc:TM_Equals>\n\
<ogc:PropertyName>om:samplingTime<\/ogc:PropertyName>\n\
<gml:TimeInstant>\n\
<gml:timePosition>'+$("#timePosition").val()+'<\/gml:timePosition>\n\
<\/gml:TimeInstant>\n\
<\/ogc:TM_Equals>\n\
<\/sos:eventTime>\n\
<sos:observedProperty>sea_water_electrical_conductivity<\/sos:observedProperty>\n\
<sos:responseFormat>text/xml;subtype="om/1.0.0"<\/sos:responseFormat>\n\
<sos:resultModel>om:Observation<\/sos:resultModel>\n\
<sos:responseMode>inline<\/sos:responseMode>\n\
<\/sos:GetObservation>';
			break;
		case 'go_conductivity_series':
			pd.value = '<?xml version="1.0" encoding="UTF-8"?>\n\
<sos:GetObservation xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:om="http://www.opengis.net/om/1.0"\n\
xsi:schemaLocation="http://www.opengis.net/sos/1.0 http://schemas.opengis.net/sos/1.0.0/sosAll.xsd"\n\
xmlns:sos="http://www.opengis.net/sos/1.0" xmlns:ogc="http://www.opengis.net/ogc" xmlns:gml="http://www.opengis.net/gml/3.2"\n\
service="SOS" version="1.0.0" srsName="EPSG:4326">\n\
<sos:offering>urn:ioos:station:wmo:41012<\/sos:offering>\n\
<sos:eventTime>\n\
<ogc:TM_During>\n\
<ogc:PropertyName>om:samplingTime<\/ogc:PropertyName>\n\
<gml:TimePeriod>\n\
<gml:beginPosition>'+$("#beginTime").val()+'<\/gml:beginPosition>\n\
<gml:endPosition>'+$("#endTime").val()+'<\/gml:endPosition>\n\
<\/gml:TimePeriod>\n\
<\/ogc:TM_During>\n\
<\/sos:eventTime>\n\
<sos:observedProperty>sea_water_electrical_conductivity<\/sos:observedProperty>\n\
<sos:responseFormat>text/xml;subtype="om/1.0.0"<\/sos:responseFormat>\n\
<sos:resultModel>om:Observation<\/sos:resultModel>\n\
<sos:responseMode>inline<\/sos:responseMode>\n\
<\/sos:GetObservation>';
			break;
			case 'go_currents_1':
				pd.value = '<?xml version="1.0" encoding="UTF-8"?>\n\
<sos:GetObservation xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:om="http://www.opengis.net/om/1.0"\n\
xsi:schemaLocation="http://www.opengis.net/sos/1.0 http://schemas.opengis.net/sos/1.0.0/sosAll.xsd"\n\
xmlns:sos="http://www.opengis.net/sos/1.0" xmlns:ogc="http://www.opengis.net/ogc" xmlns:gml="http://www.opengis.net/gml/3.2"\n\
service="SOS" version="1.0.0" srsName="EPSG:4326">\n\
<sos:offering>urn:ioos:station:wmo:41012<\/sos:offering>\n\
<sos:eventTime>\n\
<ogc:TM_Equals>\n\
<ogc:PropertyName>om:samplingTime<\/ogc:PropertyName>\n\
<gml:TimeInstant>\n\
<gml:timePosition>'+$("#timePosition").val()+'<\/gml:timePosition>\n\
<\/gml:TimeInstant>\n\
<\/ogc:TM_Equals>\n\
<\/sos:eventTime>\n\
<sos:observedProperty>currents<\/sos:observedProperty>\n\
<sos:responseFormat>text/xml;subtype="om/1.0.0"<\/sos:responseFormat>\n\
<sos:resultModel>om:Observation<\/sos:resultModel>\n\
<sos:responseMode>inline<\/sos:responseMode>\n\
<\/sos:GetObservation>';
				break;
			case 'go_currents_series':
				pd.value = '<?xml version="1.0" encoding="UTF-8"?>\n\
<sos:GetObservation xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:om="http://www.opengis.net/om/1.0"\n\
xsi:schemaLocation="http://www.opengis.net/sos/1.0 http://schemas.opengis.net/sos/1.0.0/sosAll.xsd"\n\
xmlns:sos="http://www.opengis.net/sos/1.0" xmlns:ogc="http://www.opengis.net/ogc" xmlns:gml="http://www.opengis.net/gml/3.2"\n\
service="SOS" version="1.0.0" srsName="EPSG:4326">\n\
<sos:offering>urn:ioos:station:wmo:41012<\/sos:offering>\n\
<sos:eventTime>\n\
<ogc:TM_During>\n\
<ogc:PropertyName>om:samplingTime<\/ogc:PropertyName>\n\
<gml:TimePeriod>\n\
<gml:beginPosition>'+$("#beginTime").val()+'<\/gml:beginPosition>\n\
<gml:endPosition>'+$("#endTime").val()+'<\/gml:endPosition>\n\
<\/gml:TimePeriod>\n\
<\/ogc:TM_During>\n\
<\/sos:eventTime>\n\
<sos:observedProperty>currents<\/sos:observedProperty>\n\
<sos:responseFormat>text/xml;subtype="om/1.0.0"<\/sos:responseFormat>\n\
<sos:resultModel>om:Observation<\/sos:resultModel>\n\
<sos:responseMode>inline<\/sos:responseMode>\n\
<\/sos:GetObservation>';
				break;
			case 'go_pressure_1':
				pd.value = '<?xml version="1.0" encoding="UTF-8"?>\n\
<sos:GetObservation xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:om="http://www.opengis.net/om/1.0"\n\
xsi:schemaLocation="http://www.opengis.net/sos/1.0 http://schemas.opengis.net/sos/1.0.0/sosAll.xsd"\n\
xmlns:sos="http://www.opengis.net/sos/1.0" xmlns:ogc="http://www.opengis.net/ogc" xmlns:gml="http://www.opengis.net/gml/3.2"\n\
service="SOS" version="1.0.0" srsName="EPSG:4326">\n\
<sos:offering>urn:ioos:station:wmo:41012<\/sos:offering>\n\
<sos:eventTime>\n\
<ogc:TM_Equals>\n\
<ogc:PropertyName>om:samplingTime<\/ogc:PropertyName>\n\
<gml:TimeInstant>\n\
<gml:timePosition>'+$("#timePosition").val()+'<\/gml:timePosition>\n\
<\/gml:TimeInstant>\n\
<\/ogc:TM_Equals>\n\
<\/sos:eventTime>\n\
<sos:observedProperty>air_pressure_at_sea_level<\/sos:observedProperty>\n\
<sos:responseFormat>text/xml;subtype="om/1.0.0"<\/sos:responseFormat>\n\
<sos:resultModel>om:Observation<\/sos:resultModel>\n\
<sos:responseMode>inline<\/sos:responseMode>\n\
<\/sos:GetObservation>';
				break;
			case 'go_pressure_series':
				pd.value = '<?xml version="1.0" encoding="UTF-8"?>\n\
<sos:GetObservation xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:om="http://www.opengis.net/om/1.0"\n\
xsi:schemaLocation="http://www.opengis.net/sos/1.0 http://schemas.opengis.net/sos/1.0.0/sosAll.xsd"\n\
xmlns:sos="http://www.opengis.net/sos/1.0" xmlns:ogc="http://www.opengis.net/ogc" xmlns:gml="http://www.opengis.net/gml/3.2"\n\
service="SOS" version="1.0.0" srsName="EPSG:4326">\n\
<sos:offering>urn:ioos:station:wmo:41012<\/sos:offering>\n\
<sos:eventTime>\n\
<ogc:TM_During>\n\
<ogc:PropertyName>om:samplingTime<\/ogc:PropertyName>\n\
<gml:TimePeriod>\n\
<gml:beginPosition>'+$("#beginTime").val()+'<\/gml:beginPosition>\n\
<gml:endPosition>'+$("#endTime").val()+'<\/gml:endPosition>\n\
<\/gml:TimePeriod>\n\
<\/ogc:TM_During>\n\
<\/sos:eventTime>\n\
<sos:observedProperty>air_pressure_at_sea_level<\/sos:observedProperty>\n\
<sos:responseFormat>text/xml;subtype="om/1.0.0"<\/sos:responseFormat>\n\
<sos:resultModel>om:Observation<\/sos:resultModel>\n\
<sos:responseMode>inline<\/sos:responseMode>\n\
<\/sos:GetObservation>';
				break;
			case 'go_salinity_1':
				pd.value = '<?xml version="1.0" encoding="UTF-8"?>\n\
<sos:GetObservation xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:om="http://www.opengis.net/om/1.0"\n\
xsi:schemaLocation="http://www.opengis.net/sos/1.0 http://schemas.opengis.net/sos/1.0.0/sosAll.xsd"\n\
xmlns:sos="http://www.opengis.net/sos/1.0" xmlns:ogc="http://www.opengis.net/ogc" xmlns:gml="http://www.opengis.net/gml/3.2"\n\
service="SOS" version="1.0.0" srsName="EPSG:4326">\n\
<sos:offering>urn:ioos:station:wmo:41012<\/sos:offering>\n\
<sos:eventTime>\n\
<ogc:TM_Equals>\n\
<ogc:PropertyName>om:samplingTime<\/ogc:PropertyName>\n\
<gml:TimeInstant>\n\
<gml:timePosition>'+$("#timePosition").val()+'<\/gml:timePosition>\n\
<\/gml:TimeInstant>\n\
<\/ogc:TM_Equals>\n\
<\/sos:eventTime>\n\
<sos:observedProperty>sea_water_salinity<\/sos:observedProperty>\n\
<sos:responseFormat>text/xml;subtype="om/1.0.0"<\/sos:responseFormat>\n\
<sos:resultModel>om:Observation<\/sos:resultModel>\n\
<sos:responseMode>inline<\/sos:responseMode>\n\
<\/sos:GetObservation>';
				break;
			case 'go_salinity_series':
				pd.value = '<?xml version="1.0" encoding="UTF-8"?>\n\
<sos:GetObservation xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:om="http://www.opengis.net/om/1.0"\n\
xsi:schemaLocation="http://www.opengis.net/sos/1.0 http://schemas.opengis.net/sos/1.0.0/sosAll.xsd"\n\
xmlns:sos="http://www.opengis.net/sos/1.0" xmlns:ogc="http://www.opengis.net/ogc" xmlns:gml="http://www.opengis.net/gml/3.2"\n\
service="SOS" version="1.0.0" srsName="EPSG:4326">\n\
<sos:offering>urn:ioos:station:wmo:41012<\/sos:offering>\n\
<sos:eventTime>\n\
<ogc:TM_During>\n\
<ogc:PropertyName>om:samplingTime<\/ogc:PropertyName>\n\
<gml:TimePeriod>\n\
<gml:beginPosition>'+$("#beginTime").val()+'<\/gml:beginPosition>\n\
<gml:endPosition>'+$("#endTime").val()+'<\/gml:endPosition>\n\
<\/gml:TimePeriod>\n\
<\/ogc:TM_During>\n\
<\/sos:eventTime>\n\
<sos:observedProperty>sea_water_salinity<\/sos:observedProperty>\n\
<sos:responseFormat>text/xml;subtype="om/1.0.0"<\/sos:responseFormat>\n\
<sos:resultModel>om:Observation<\/sos:resultModel>\n\
<sos:responseMode>inline<\/sos:responseMode>\n\
<\/sos:GetObservation>';
				break;
			case 'go_waterlevel_1':
				pd.value = '<?xml version="1.0" encoding="UTF-8"?>\n\
<sos:GetObservation xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:om="http://www.opengis.net/om/1.0"\n\
xsi:schemaLocation="http://www.opengis.net/sos/1.0 http://schemas.opengis.net/sos/1.0.0/sosAll.xsd"\n\
xmlns:sos="http://www.opengis.net/sos/1.0" xmlns:ogc="http://www.opengis.net/ogc" xmlns:gml="http://www.opengis.net/gml/3.2"\n\
service="SOS" version="1.0.0" srsName="EPSG:4326">\n\
<sos:offering>urn:ioos:station:wmo:46403<\/sos:offering>\n\
<sos:eventTime>\n\
<ogc:TM_Equals>\n\
<ogc:PropertyName>om:samplingTime<\/ogc:PropertyName>\n\
<gml:TimeInstant>\n\
<gml:timePosition>'+$("#timePosition").val()+'<\/gml:timePosition>\n\
<\/gml:TimeInstant>\n\
<\/ogc:TM_Equals>\n\
<\/sos:eventTime>\n\
<sos:observedProperty>sea_floor_depth_below_sea_surface<\/sos:observedProperty>\n\
<sos:responseFormat>text/xml;subtype="om/1.0.0"<\/sos:responseFormat>\n\
<sos:resultModel>om:Observation<\/sos:resultModel>\n\
<sos:responseMode>inline<\/sos:responseMode>\n\
<\/sos:GetObservation>';
				break;
			case 'go_waterlevel_series':
				pd.value = '<?xml version="1.0" encoding="UTF-8"?>\n\
<sos:GetObservation xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:om="http://www.opengis.net/om/1.0"\n\
xsi:schemaLocation="http://www.opengis.net/sos/1.0 http://schemas.opengis.net/sos/1.0.0/sosAll.xsd"\n\
xmlns:sos="http://www.opengis.net/sos/1.0" xmlns:ogc="http://www.opengis.net/ogc" xmlns:gml="http://www.opengis.net/gml/3.2"\n\
service="SOS" version="1.0.0" srsName="EPSG:4326">\n\
<sos:offering>urn:ioos:station:wmo:46403<\/sos:offering>\n\
<sos:eventTime>\n\
<ogc:TM_During>\n\
<ogc:PropertyName>om:samplingTime<\/ogc:PropertyName>\n\
<gml:TimePeriod>\n\
<gml:beginPosition>'+$("#beginTime").val()+'<\/gml:beginPosition>\n\
<gml:endPosition>'+$("#endTime").val()+'<\/gml:endPosition>\n\
<\/gml:TimePeriod>\n\
<\/ogc:TM_During>\n\
<\/sos:eventTime>\n\
<sos:observedProperty>sea_floor_depth_below_sea_surface<\/sos:observedProperty>\n\
<sos:responseFormat>text/xml;subtype="om/1.0.0"<\/sos:responseFormat>\n\
<sos:resultModel>om:Observation<\/sos:resultModel>\n\
<sos:responseMode>inline<\/sos:responseMode>\n\
<\/sos:GetObservation>';
				break;
			case 'go_watertemperature_1':
				pd.value = '<?xml version="1.0" encoding="UTF-8"?>\n\
<sos:GetObservation xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:om="http://www.opengis.net/om/1.0"\n\
xsi:schemaLocation="http://www.opengis.net/sos/1.0 http://schemas.opengis.net/sos/1.0.0/sosAll.xsd"\n\
xmlns:sos="http://www.opengis.net/sos/1.0" xmlns:ogc="http://www.opengis.net/ogc" xmlns:gml="http://www.opengis.net/gml/3.2"\n\
service="SOS" version="1.0.0" srsName="EPSG:4326">\n\
<sos:offering>urn:ioos:station:wmo:41012<\/sos:offering>\n\
<sos:eventTime>\n\
<ogc:TM_Equals>\n\
<ogc:PropertyName>om:samplingTime<\/ogc:PropertyName>\n\
<gml:TimeInstant>\n\
<gml:timePosition>'+$("#timePosition").val()+'<\/gml:timePosition>\n\
<\/gml:TimeInstant>\n\
<\/ogc:TM_Equals>\n\
<\/sos:eventTime>\n\
<sos:observedProperty>sea_water_temperature<\/sos:observedProperty>\n\
<sos:responseFormat>text/xml;subtype="om/1.0.0"<\/sos:responseFormat>\n\
<sos:resultModel>om:Observation<\/sos:resultModel>\n\
<sos:responseMode>inline<\/sos:responseMode>\n\
<\/sos:GetObservation>';
				break;
			case 'go_watertemperature_series':
				pd.value = '<?xml version="1.0" encoding="UTF-8"?>\n\
<sos:GetObservation xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:om="http://www.opengis.net/om/1.0"\n\
xsi:schemaLocation="http://www.opengis.net/sos/1.0 http://schemas.opengis.net/sos/1.0.0/sosAll.xsd"\n\
xmlns:sos="http://www.opengis.net/sos/1.0" xmlns:ogc="http://www.opengis.net/ogc" xmlns:gml="http://www.opengis.net/gml/3.2"\n\
service="SOS" version="1.0.0" srsName="EPSG:4326">\n\
<sos:offering>urn:ioos:station:wmo:41012<\/sos:offering>\n\
<sos:eventTime>\n\
<ogc:TM_During>\n\
<ogc:PropertyName>om:samplingTime<\/ogc:PropertyName>\n\
<gml:TimePeriod>\n\
<gml:beginPosition>'+$("#beginTime").val()+'<\/gml:beginPosition>\n\
<gml:endPosition>'+$("#endTime").val()+'<\/gml:endPosition>\n\
<\/gml:TimePeriod>\n\
<\/ogc:TM_During>\n\
<\/sos:eventTime>\n\
<sos:observedProperty>sea_water_temperature<\/sos:observedProperty>\n\
<sos:responseFormat>text/xml;subtype="om/1.0.0"<\/sos:responseFormat>\n\
<sos:resultModel>om:Observation<\/sos:resultModel>\n\
<sos:responseMode>inline<\/sos:responseMode>\n\
<\/sos:GetObservation>';
				break;
			case 'go_waves_1':
				pd.value = '<?xml version="1.0" encoding="UTF-8"?>\n\
<sos:GetObservation xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:om="http://www.opengis.net/om/1.0"\n\
xsi:schemaLocation="http://www.opengis.net/sos/1.0 http://schemas.opengis.net/sos/1.0.0/sosAll.xsd"\n\
xmlns:sos="http://www.opengis.net/sos/1.0" xmlns:ogc="http://www.opengis.net/ogc" xmlns:gml="http://www.opengis.net/gml/3.2"\n\
service="SOS" version="1.0.0" srsName="EPSG:4326">\n\
<sos:offering>urn:ioos:station:wmo:41012<\/sos:offering>\n\
<sos:eventTime>\n\
<ogc:TM_Equals>\n\
<ogc:PropertyName>om:samplingTime<\/ogc:PropertyName>\n\
<gml:TimeInstant>\n\
<gml:timePosition>'+$("#timePosition").val()+'<\/gml:timePosition>\n\
<\/gml:TimeInstant>\n\
<\/ogc:TM_Equals>\n\
<\/sos:eventTime>\n\
<sos:observedProperty>waves<\/sos:observedProperty>\n\
<sos:responseFormat>text/xml;subtype="om/1.0.0"<\/sos:responseFormat>\n\
<sos:resultModel>om:Observation<\/sos:resultModel>\n\
<sos:responseMode>inline<\/sos:responseMode>\n\
<\/sos:GetObservation>';
				break;
			case 'go_waves_series':
				pd.value = '<?xml version="1.0" encoding="UTF-8"?>\n\
<sos:GetObservation xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:om="http://www.opengis.net/om/1.0"\n\
xsi:schemaLocation="http://www.opengis.net/sos/1.0 http://schemas.opengis.net/sos/1.0.0/sosAll.xsd"\n\
xmlns:sos="http://www.opengis.net/sos/1.0" xmlns:ogc="http://www.opengis.net/ogc" xmlns:gml="http://www.opengis.net/gml/3.2"\n\
service="SOS" version="1.0.0" srsName="EPSG:4326">\n\
<sos:offering>urn:ioos:station:wmo:41012<\/sos:offering>\n\
<sos:eventTime>\n\
<ogc:TM_During>\n\
<ogc:PropertyName>om:samplingTime<\/ogc:PropertyName>\n\
<gml:TimePeriod>\n\
<gml:beginPosition>'+$("#beginTime").val()+'<\/gml:beginPosition>\n\
<gml:endPosition>'+$("#endTime").val()+'<\/gml:endPosition>\n\
<\/gml:TimePeriod>\n\
<\/ogc:TM_During>\n\
<\/sos:eventTime>\n\
<sos:observedProperty>waves<\/sos:observedProperty>\n\
<sos:responseFormat>text/xml;subtype="om/1.0.0"<\/sos:responseFormat>\n\
<sos:resultModel>om:Observation<\/sos:resultModel>\n\
<sos:responseMode>inline<\/sos:responseMode>\n\
<\/sos:GetObservation>';
				break;
			case 'go_winds_1':
				pd.value = '<?xml version="1.0" encoding="UTF-8"?>\n\
<sos:GetObservation xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:om="http://www.opengis.net/om/1.0"\n\
xsi:schemaLocation="http://www.opengis.net/sos/1.0 http://schemas.opengis.net/sos/1.0.0/sosAll.xsd"\n\
xmlns:sos="http://www.opengis.net/sos/1.0" xmlns:ogc="http://www.opengis.net/ogc" xmlns:gml="http://www.opengis.net/gml/3.2"\n\
service="SOS" version="1.0.0" srsName="EPSG:4326">\n\
<sos:offering>urn:ioos:station:wmo:41012<\/sos:offering>\n\
<sos:eventTime>\n\
<ogc:TM_Equals>\n\
<ogc:PropertyName>om:samplingTime<\/ogc:PropertyName>\n\
<gml:TimeInstant>\n\
<gml:timePosition>'+$("#timePosition").val()+'<\/gml:timePosition>\n\
<\/gml:TimeInstant>\n\
<\/ogc:TM_Equals>\n\
<\/sos:eventTime>\n\
<sos:observedProperty>winds<\/sos:observedProperty>\n\
<sos:responseFormat>text/xml;subtype="om/1.0.0"<\/sos:responseFormat>\n\
<sos:resultModel>om:Observation<\/sos:resultModel>\n\
<sos:responseMode>inline<\/sos:responseMode>\n\
<\/sos:GetObservation>';
				break;
			case 'go_winds_series':
				pd.value = '<?xml version="1.0" encoding="UTF-8"?>\n\
<sos:GetObservation xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:om="http://www.opengis.net/om/1.0"\n\
xsi:schemaLocation="http://www.opengis.net/sos/1.0 http://schemas.opengis.net/sos/1.0.0/sosAll.xsd"\n\
xmlns:sos="http://www.opengis.net/sos/1.0" xmlns:ogc="http://www.opengis.net/ogc" xmlns:gml="http://www.opengis.net/gml/3.2"\n\
service="SOS" version="1.0.0" srsName="EPSG:4326">\n\
<sos:offering>urn:ioos:station:wmo:41012<\/sos:offering>\n\
<sos:eventTime>\n\
<ogc:TM_During>\n\
<ogc:PropertyName>om:samplingTime<\/ogc:PropertyName>\n\
<gml:TimePeriod>\n\
<gml:beginPosition>'+$("#beginTime").val()+'<\/gml:beginPosition>\n\
<gml:endPosition>'+$("#endTime").val()+'<\/gml:endPosition>\n\
<\/gml:TimePeriod>\n\
<\/ogc:TM_During>\n\
<\/sos:eventTime>\n\
<sos:observedProperty>winds<\/sos:observedProperty>\n\
<sos:responseFormat>text/xml;subtype="om/1.0.0"<\/sos:responseFormat>\n\
<sos:resultModel>om:Observation<\/sos:resultModel>\n\
<sos:responseMode>inline<\/sos:responseMode>\n\
<\/sos:GetObservation>';
				break;
			default:
				pd.value = '';
				break;
		}
	}
}

