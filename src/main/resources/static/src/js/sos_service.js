
var capabilites;
var offerings;
var mymap;
var myChart;

$(document).ready(function(){
    
    $("#timeForm").hide();
    $("#availProp").hide();
    $("#availStn").hide();
    $('#timeSeries').hide();
    map_new(["19.076090", "72.877426"]);
});


$("#provider").click(function(){
  
	var div_data="<option value=\"gc\">GetCapabilities</option><option value=\"ds\">DescribeSensor</option><option value=\"go_airtemperature_1\">GetObservation Air Temperature</option><option value=\"go_pressure_1\">GetObservation Atmospheric Pressure</option>";
     $(div_data).appendTo('#requests'); 
	
});

$("#requests").on('change', function(){
	
	if($("#requests").val() == "gc"){
		$("#availProp").hide();
		$('#myChart').hide();
		$('#timeSeries').hide();
		
	}
	
	else if($("#requests").val() == "go_airtemperature_1"){
		$("#availProp").hide();
		$('#myChart').hide();
		  $("#availStn").show();
		  $('#timeSeries').hide();
		  $("#inTimeForm").show();
		  $("#timeForm").show();
	}
	
	else if( $("#requests").val() == "ds"){
		$("#availProp").show();
		$('#myChart').hide();
		  $("#availStn").show();
		  $('#timeSeries').hide();
		  $("#timeForm").hide();
	}
	else if( $("#requests").val() == "go_airtemperature_series"){
		$("#availProp").show();
		 $("#availStn").show();
		$('#myChart').show();
		$('#timeSeries').show();
		$("#inTimeForm").hide();
	}
	else {
		
		}
	 
});

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
             var sations = data.capabilities.sensorIds;
             // var respXML = data.capabilities.responseXML;
             var r = document.getElementById('results');
             
             r.value = data.capabilities.responseXML;
             $.each(sations,function(i,data)
             {
              // alert(data.value+":"+data.text);
              var div_data="<option value="+data+">"+data+"</option>";
            // alert(div_data);
             $(div_data).appendTo('#stations'); 
             }); 
             
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
 	             var r = document.getElementById('results');
 	             
 	             r.value = data.sensorInfo.response;
 	             
 	            if(!(data.sensorInfo.sensorDesc.errorMessage ==null || data.sensorInfo.sensorDesc.errorMessage == undefined))
	            	 {
	            	 	alert(data.sensorInfo.sensorDesc.errorMessage);
	            	 }
 	            else
 	            	{
 	            		var sensorDesc = [data.sensorInfo.sensorDesc.name+"\n", 
 	 	            	data.sensorInfo.sensorDesc.description+"\n", 
 	 	            	data.sensorInfo.sensorDesc.propertyName+"\n",
 	 	            	data.sensorInfo.sensorDesc.classifierPublisher+"\n",
 	 	            	data.sensorInfo.sensorDesc.country+"\n",
 	 	            	data.sensorInfo.sensorDesc.address+"\n",
 	 	            	data.sensorInfo.sensorDesc.latitude,
 	 	            	data.sensorInfo.sensorDesc.longitude];
 	 	            
 	 	           		mymap.remove();
 	 	           		map_desc("ds",sensorDesc, data.sensorInfo.sensorDesc.latitude, data.sensorInfo.sensorDesc.longitude,null,null);
 	 	             
 	            	}
 	             
 	             },
 	             complete: function(){
 	            	    $('.ajax-loader').css("visibility", "hidden");
 	            	  }
 	       });
 	}
    
     if($("#requests").val()=="go_airtemperature_1"){
  		
  		$.ajax({
  	         type: "GET",
  	         beforeSend: function(){
  	        	    $('.ajax-loader').css("visibility", "visible");
  	        	  },
  	         url:"http://localhost:8080/ndbc/observation/airtemp/"+$("#stations").val()+"/"+$("#timePosition").val(),
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
  	            	 	var sensorDesc = [data.sensorInfo.observation.description+"\n", 
  	  	            	data.sensorInfo.observation.boundedBy+"\n", 
  	  	            	data.sensorInfo.observation.stationId+"\n",
  	  	            	data.sensorInfo.observation.time+"\n",
  	  	            	data.sensorInfo.observation.altitude+"\n",
  	  	            	data.sensorInfo.observation.altitudeUnit+"\n",
  	  	            	data.sensorInfo.observation.temperature+"\n",
  	  	            	data.sensorInfo.observation.temperatureUnit+"\n",
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
     
     if($("#requests").val()=="go_airtemperature_series"){
   		
   		$.ajax({
   	         type: "GET",
   	         beforeSend: function(){
   	        	    $('.ajax-loader').css("visibility", "visible");
   	        	  },
   	         url:"http://localhost:8080/ndbc/observation/airtemp/"+$("#stations").val()+"/"+$("#beginTime").val()+"/"+$("#endTime").val(),
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
   	            	 	var sensorDesc = [data.sensorInfo.observation.description+"\n", 
   	  	            	data.sensorInfo.observation.boundedBy+"\n", 
   	  	            	data.sensorInfo.observation.stationId+"\n",
   	  	            	data.sensorInfo.observation.beginTime+"\n",
   	  	            	data.sensorInfo.observation.endTime+"\n",
   	  	            	data.sensorInfo.observation.altitude+"\n",
   	  	            	data.sensorInfo.observation.altitudeUnit+"\n",
   	  	            	//data.sensorInfo.observation.temperature+"\n",
   	  	            	data.sensorInfo.observation.temperatureUnit+"\n",
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
	if($("#requests").val() != "gc" && $("#requests").val() != "ds"){
	$("#timeForm").show();
	
	$.each(offerings,function(capI,capD)
            {
   	 			if(capD.name == $("#stations").val())
   	 				{
   	 					$("#beginTime").text(capD.beginTime);
   	 					$("#endTime").text(capD.endTime);
   	 					$("#timePosition").val(capD.beginTime);
   	 				}
            });
	
	}
});


function map_new(latlong) {
	
	mymap = L.map('map').setView(["19.076090", "72.877426"], 3);
	mapLink =
	  '<a href="http://openstreetmap.org">OpenStreetMap</a>';
	L.tileLayer(
	  'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	    attribution: '&copy; ' + mapLink + ' Contributors',
	    maxZoom: 18,
	  }).addTo(mymap);

	for (var i = 0; i < latlong.length; i++) {
	  marker = new L.marker([latlong[i][1], latlong[i][2]],{ iconOptions: { color: "rgb(0,0,100)" }})
	    .bindPopup(latlong[i][0])
	    .addTo(mymap);
	}

}

function map_desc(requestType, latlongDetails, latitude, longitude, tempDates, tempValues) {
	
	mymap = L.map('map').setView([latitude, longitude], 3);
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
		  	if(requestType == "go_airtemperature_1"){
		  		
		  		if( (i>3&&i<6)){
		  			popMes +="<h5>"
		  		}
		  		popMes += latlongDetails[i]+"<br>";
		  		if( (i>3&&i<6)){
		  			popMes +="</h5>"
		  		}
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
			    label: 'Airtemp',
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
<sos:offering>urn:ioos:station:wmo:41012<\/sos:offering>\n\
<sos:eventTime>\n\
<ogc:TM_Equals>\n\
<ogc:PropertyName>om:samplingTime<\/ogc:PropertyName>\n\
<gml:TimeInstant>\n\
<gml:timePosition>2012-11-01T00:50:00Z<\/gml:timePosition>\n\
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
<sos:offering>urn:ioos:station:wmo:41012<\/sos:offering>\n\
<sos:eventTime>\n\
<ogc:TM_During>\n\
<ogc:PropertyName>om:samplingTime<\/ogc:PropertyName>\n\
<gml:TimePeriod>\n\
<gml:beginPosition>2012-11-01T00:00:00Z<\/gml:beginPosition>\n\
<gml:endPosition>2012-11-02T00:00:00Z<\/gml:endPosition>\n\
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
<gml:timePosition>2012-07-01T01:50:00Z<\/gml:timePosition>\n\
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
<gml:beginPosition>2012-07-01T00:00:00Z<\/gml:beginPosition>\n\
<gml:endPosition>2012-07-02T00:00:00Z<\/gml:endPosition>\n\
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
<gml:timePosition>2012-11-01T00:50:00Z<\/gml:timePosition>\n\
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
<gml:beginPosition>2012-11-01T00:00:00Z<\/gml:beginPosition>\n\
<gml:endPosition>2012-11-02T00:00:00Z<\/gml:endPosition>\n\
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
<gml:timePosition>2012-11-01T00:50:00Z<\/gml:timePosition>\n\
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
<gml:beginPosition>2012-11-01T00:00:00Z<\/gml:beginPosition>\n\
<gml:endPosition>2012-11-02T00:00:00Z<\/gml:endPosition>\n\
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
<gml:timePosition>2012-07-01T00:50:00Z<\/gml:timePosition>\n\
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
<gml:beginPosition>2012-07-01T00:00:00Z<\/gml:beginPosition>\n\
<gml:endPosition>2012-07-02T00:00:00Z<\/gml:endPosition>\n\
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
<gml:timePosition>2012-11-01T00:00:00Z<\/gml:timePosition>\n\
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
<gml:beginPosition>2012-11-01T00:00:00Z<\/gml:beginPosition>\n\
<gml:endPosition>2012-11-02T00:00:00Z<\/gml:endPosition>\n\
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
<gml:timePosition>2012-11-01T00:50:00Z<\/gml:timePosition>\n\
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
<gml:beginPosition>2012-11-01T00:00:00Z<\/gml:beginPosition>\n\
<gml:endPosition>2012-11-02T00:00:00Z<\/gml:endPosition>\n\
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
<gml:timePosition>2012-11-01T00:50:00Z<\/gml:timePosition>\n\
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
<gml:beginPosition>2012-11-01T00:00:00Z<\/gml:beginPosition>\n\
<gml:endPosition>2012-11-02T00:00:00Z<\/gml:endPosition>\n\
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
<gml:timePosition>2012-11-01T00:50:00Z<\/gml:timePosition>\n\
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
<gml:beginPosition>2012-11-01T00:00:00Z<\/gml:beginPosition>\n\
<gml:endPosition>2012-11-02T00:00:00Z<\/gml:endPosition>\n\
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

