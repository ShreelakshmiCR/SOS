/* Fetching the xml from the given URL,
It will call when value of URL select box change */
var capabilites;
var offerings;
var features = [];
var vector;
var arrayOfLatLong= [];
var mymap;
$("#provider").click(function(){
  
	var div_data="<option value=\"gc\">GetCapabilities</option><option value=\"ds\">DescribeSensor</option><option value=\"go_airtemperature_1\">GetObservation Air Temperature</option><option value=\"go_pressure_1\">GetObservation Atmospheric Pressure</option>";
     $(div_data).appendTo('#requests'); 
	
});

function storeCoordinate(xVal, yVal, array) {
    array.push({xVal, yVal});
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
             var sations = data.capabilities.sensorIds;
             //var respXML = data.capabilities.responseXML;
             var r = document.getElementById('results');
             
             r.value = data.capabilities.responseXML;
             $.each(sations,function(i,data)
             {
              //alert(data.value+":"+data.text);
              var div_data="<option value="+data+">"+data+"</option>";
            // alert(div_data);
             $(div_data).appendTo('#stations'); 
             }); 
             
             offerings= data.capabilities.observationOfferings;
             $('#map').children().remove();
             var latitudeLongArray = new Array(offerings.length);

             $.each(offerings,function(capI,capD)
                     {
             			//console.log(capD.latitude+" "+capD.longitude
            	 			if(capD.latitude!=null && capD.longitude != null){
            	 				var name = capD.description;
            	 				if(name==null)
            	 					name = capD.name;
            	 			var latLong = [name, capD.latitude, capD.longitude];
            	 			latitudeLongArray[capI] = latLong;
            	 			}
            	 			//arrayOfLatLong.push(latLong);
             					//storeCoordinate(capD.latitude, capD.longitude, arrayOfLatLong);
                     });
             mymap.remove();
             map_new(latitudeLongArray);
            // map_init(offerings);
             
            // vector.addFeatures(features);
             
             },
             complete: function(){
            	    $('.ajax-loader').css("visibility", "hidden");
            	  }
       });
     }
     
     if($("#requests").val()=="ds"){
 		
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
 	             if(data.sensorInfo.sensorDesc.errorCode=="001")
 	             {
					alert(data.sensorInfo.sensorDesc.errorMessage);
	
}
else{
 	             r.value = data.sensorInfo.response;
 	            var sensorDesc = [data.sensorInfo.sensorDesc.name, 
 	            	data.sensorInfo.sensorDesc.description, 
 	            	data.sensorInfo.sensorDesc.propertyName,
 	            	data.sensorInfo.sensorDesc.classifierPublisher,
 	            	data.sensorInfo.sensorDesc.country,
 	            	data.sensorInfo.sensorDesc.address,
 	            	data.sensorInfo.sensorDesc.latitude,
 	            	data.sensorInfo.sensorDesc.longitude
 	            	];
 	            	
 	            
 	           mymap.remove();
 	           map_desc(sensorDesc);
 	           }
 	             
 	         /*   $.each(capabilites,function(capI,capD)
 	                     {
 	             			console.log("hi");
 	                     });*/
 	             
 	             },
 	             complete: function(){
 	            	    $('.ajax-loader').css("visibility", "hidden");
 	            	  }
 	       });
 	}
});


$("#station-btn").click(function(){
	console.log("station btn");
	
});


/*$('#requests').on('change', function(){
    
    });*/
/*
    $.ajax(
        {
            url:request_url,
            type:"GET",
            dataType: 'text',
            success:function(data, status,jqXHR ){
                xml_string = data;
                wms_xmlParser()
                wms_populateForm()
            },
            error: function(data) {
                alert('Error occured!')
            }

        }
    ) 
    */

/* XML parser */
function wms_xmlParser() {
    var domparser = new DOMParser();
    var xmldoc = domparser.parseFromString(xml_string,"text/xml");
    available_requests = [];
    spatial_info = [];
    layers = [];
    var request_nodes = xmldoc.getElementsByTagName('Request')[0].childNodes;
    for(j=0;j<request_nodes.length; j++){
        if(request_nodes[j].nodeType == 1 ) {
            available_requests.push(request_nodes[j].nodeName);
        }
    }

    var layer_nodes = xmldoc.getElementsByTagName('Layer')[0].childNodes
    for(i=0; i<layer_nodes.length; i++)
    {
        if (layer_nodes[i].nodeName == 'BoundingBox'){
            spatial_info.push({
                'CRS':layer_nodes[i].getAttribute('CRS'),
                'minx':layer_nodes[i].getAttribute('minx'),
                'miny':layer_nodes[i].getAttribute('miny'),
                'maxx':layer_nodes[i].getAttribute('maxx'),
                'maxy':layer_nodes[i].getAttribute('maxy'),
            });
        } else if(layer_nodes[i].nodeName == 'Layer'){
            layers.push({
                'name':layer_nodes[i].getElementsByTagName('Name')[0].childNodes[0].data,
                'title':layer_nodes[i].getElementsByTagName('Title')[0].childNodes[0].data
            });
        }
    }
}
function myMap() {
	var mapProp= {
	  center:new google.maps.LatLng(51.508742,-0.120850),
	  zoom:5,
	};
	var map = new google.maps.Map(document.getElementById("googleMap"),mapProp);
	}

var map;

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

function map_desc(latlong) {
	
	
	mymap = L.map('map').setView([latlong[6], latlong[7]], 3);
	mapLink =
	  '<a href="http://openstreetmap.org">OpenStreetMap</a>';
	L.tileLayer(
	  'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	    attribution: '&copy; ' + mapLink + ' Contributors',
	    maxZoom: 18,
	  }).addTo(mymap);
	
	  marker = new L.marker([latlong[6], latlong[7]])
	    .bindPopup(latlong[0]+" "+latlong[1]+" "+latlong[2]+" "+latlong[3]+" "+latlong[4]+" "+latlong[5])
	    .addTo(mymap);
	

}
function map_init(latlong) {
    map = new OpenLayers.Map("map");

    var osm = new OpenLayers.Layer.OSM();
    var toMercator = OpenLayers.Projection.transforms['EPSG:4326']['EPSG:3857'];
    var center = toMercator({x:-0.05,y:51.5});
    
    /**
     * Create 5 random vector features.  Your features would typically be fetched
     * from the server. The features are given an attribute named "foo".
     * The value of this attribute is an integer that ranges from 0 to 100.
     */   
    
    if(latlong == null){
    	console.log("Inside latlong null");
    for(var i = 0; i < i; i++) {
        features[i] = new OpenLayers.Feature.Vector(
                toMercator(new OpenLayers.Geometry.Point(
                    -0.040 - 0.05*Math.random(),
                    51.49 + 0.02*Math.random())), 
                {
                    foo : 100 * Math.random() | 0
                }, {
                    fillColor : '#008040',
                    fillOpacity : 0.8,                    
                    strokeColor : "#ee9900",
                    strokeOpacity : 1,
                    strokeWidth : 1,
                    pointRadius : 8
                });
    }
    }
    else
    	{
    	  $.each(latlong,function(capI,capD)
                  {
          			console.log(capD.latitude+" "+capD.longitude+"\n");
         	 
         	 features[capI] = new OpenLayers.Feature.Vector(
                      toMercator(new OpenLayers.Geometry.Point(
                     		 capD.latitude,
                     		 capD.longitude)), 
                      {
                         // foo : 100 * Math.random() | 0
                      }, {
                          fillColor : '#008040',
                          fillOpacity : 0.1,                    
                          strokeColor : "#ee9900",
                          strokeOpacity : 1,
                          strokeWidth : 1,
                          pointRadius : 2
                      });
                  });
    	}
        
    // create the layer with listeners to create and destroy popups
    vector = new OpenLayers.Layer.Vector("Points",{
        eventListeners:{
            'featureselected':function(evt){
                var feature = evt.feature;
                var popup = new OpenLayers.Popup.FramedCloud("popup",
                    OpenLayers.LonLat.fromString(feature.geometry.toShortString()),
                    null,
                    "<div style='font-size:.8em'>Feature: " + feature.id +"<br>Foo: " + feature.attributes.foo+"</div>",
                    null,
                    true
                );
                feature.popup = popup;
                map.addPopup(popup);
            },
            'featureunselected':function(evt){
                var feature = evt.feature;
                map.removePopup(feature.popup);
                feature.popup.destroy();
                feature.popup = null;
            }
        }
    });
    vector.addFeatures(features);

    // create the select feature control
    var selector = new OpenLayers.Control.SelectFeature(vector,{
        hover:true,
        autoActivate:true
    }); 
    
    map.addLayers([osm, vector]);
    map.addControl(selector);
    map.setCenter(new OpenLayers.LonLat(center.x,center.y), 13);
}




/* Initialize the values */
function wms_init(){
    xml_string = '';    
    available_requests = []
    spatial_info = [];
    layers = [];
    map = new ol.Map({
        target: 'wms_map',
        layers: [
          new ol.layer.Tile({
            source: new ol.source.OSM()
          })
        ],
        view: new ol.View({
          center: ol.proj.fromLonLat([19.07283, 72.88261]),
          zoom: 6
        })
      });
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

/* Function used to popup the form with XML values */
function wms_populateForm() {
    var new_options = '';
    var new_srs = '';
    var new_layers = '';

    $.each(available_requests, function(i){
        if(available_requests[i]!='GetMap') {
            new_options += '<option disabled value="' + available_requests[i] + '">' + available_requests[i] + '</option>'
        } else {
            new_options += '<option value="' + available_requests[i] + '">' + available_requests[i] + '</option>'
        }
        
    });
    $('#requests option:gt(0)').remove();
    $('#requests').append(new_options);

    $.each(layers, function(i){
        new_layers += '<option value="' + layers[i]['name'] + '">' + layers[i]['title'] + '</option>'
    })
    $('#layers option:gt(0)').remove();
    $('#layers').append(new_layers);

    
    $.each(spatial_info, function(i){
        new_srs += '<option value="' + spatial_info[i]['CRS'] + '">' + spatial_info[i]["CRS"] + '</option>' 
    })
    $('#srs option:gt(0)').remove();
    $('#srs').append(new_srs);
}


$(document).ready(function(){
    wms_init();
    var latlong;
    map_new(["19.076090", "72.877426"]);
});

$('#srs').on('change', function(){
    current_value = this.value;
    var i = spatial_info.length;
    while(i-- >0){
        if(spatial_info[i]['CRS'] == current_value){
            $('#minx').val(spatial_info[i]['minx']);
            $('#miny').val(spatial_info[i]['miny']);
            $('#maxx').val(spatial_info[i]['maxx']);
            $('#maxy').val(spatial_info[i]['maxy']);
        }
    }
});

/* Submit action */
$('#wmsform').on('submit', function(e){
    e.preventDefault();
    url = $('#urls').val();
    request = $('#requests').val();
    srs = $('#srs').val();
    layer = $('#layers').val();
    minx = $('#minx').val();
    miny = $('#miny').val();
    maxx = $('#maxx').val();
    maxy = $('#maxy').val();    

    $('#wms_map').children().remove();

    var map_layers = [
        new ol.layer.Tile({
            source: new ol.source.OSM(),
           }
        ),
        new ol.layer.Tile({
            source: new ol.source.TileWMS({
                url: url,
                params: {
                    'LAYERS': layer,
                    'FORMAT': 'image/png',
                    'TILED': true,
                    'ratio':1
                },
            }),
        })
    ];
    
    var extent = [minx, miny, maxx, maxy];
    var map_prop = ol.proj.get(srs);
    // var extent_new = ol.proj.transform(extent, 'EPSG:4326', srs)
    try{
        map_prop.setExtent(extent);
    } catch(err) {
        alert("There is some issue related to SRS, Try with other SRS");
    }
    var mousecontrol = new ol.control.MousePosition({
        coordinateFormat: ol.coordinate.createStringXY(4),
        projection: map_prop
    })
    
    map = new ol.Map({
        projection: map_prop,
        layers: map_layers,
        controls: ol.control.defaults().extend([mousecontrol]),
        target: 'wms_map',
        view: new ol.View({
          center: ol.proj.transform([0,0], 'EPSG:4326', srs),
          zoom: 7,
        }),
    });
    
   

});
