package com.sensor.details.service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.xml.xpath.XPath;
import javax.xml.xpath.XPathFactory;

import org.json.simple.JSONObject;
import org.springframework.stereotype.Service;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NamedNodeMap;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import com.sensor.details.pojo.AirTempSeriesInfo;
import com.sensor.details.pojo.Capabalities;
import com.sensor.details.pojo.CapbalitiesStationInfo;
import com.sensor.details.pojo.ObservationAirTempInfo;
import com.sensor.details.pojo.ObservationAirTempSeriesInfo;
import com.sensor.details.pojo.ObservationOfferings;
import com.sensor.details.pojo.SensorDescription;
import com.sensor.details.utils.XmlUtils;

import kong.unirest.HttpResponse;
import kong.unirest.Unirest;

@Service
public class NdbcService {

	public Capabalities getAllStations() throws Exception {
		List<String> stationIds = new ArrayList<String>();
		Map<String,Object> stationsMap = new HashMap<String,Object>();
		Capabalities capabalities = new Capabalities();
		
		List<CapbalitiesStationInfo> capStationIds = new ArrayList<CapbalitiesStationInfo>();
		try {
			HttpResponse<String> response = Unirest.post("https://sdf.ndbc.noaa.gov/sos/server.php")
					.header("Content-type", "text/xml")
					.body("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\r\n"
							+ "<GetCapabilities xmlns=\"http://www.opengis.net/ows/1.1\" xmlns:ows=\"http://www.opengis.net/ows/1.1\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xsi:schemaLocation=\"http://www.opengis.net/ows/1.1 fragmentGetCapabilitiesRequest.xsd\" service=\"SOS\">\r\n"
							+ "  <AcceptVersions>\r\n" + "    <Version>1.0.0</Version>\r\n" + "  </AcceptVersions>\r\n"
							+ "  <Sections>\r\n" + "    <Section>ServiceProvider</Section>\r\n"
							+ "    <Section>ServiceIdentification</Section>\r\n" + "    <Section>Contents</Section>\r\n"
							+ "  </Sections>\r\n" + "  <AcceptFormats>\r\n"
							+ "    <OutputFormat>text/xml</OutputFormat>\r\n" + "  </AcceptFormats>\r\n"
							+ "</GetCapabilities>")

					.asString();

			Document document = XmlUtils.getDocument(response.getBody());
			
			//Start of XML parsing
			NodeList acctdetails = document.getElementsByTagName("sos:procedure");
			capabalities.setResponseXML("");//response.getBody()
			
			NodeList observationsNodeList = document.getElementsByTagName("sos:ObservationOffering");
			
			NodeList procedures = document.getElementsByTagName("sos:procedure");
			
			for (int i = 0; i < acctdetails.getLength(); i++) {
				Node nNode = acctdetails.item(i);
				NamedNodeMap nMap = nNode.getAttributes();

				for (int j = 0; j < nMap.getLength(); j++) {
					Node mNode = nMap.item(j);
					stationIds.add(mNode.getNodeValue());
				}
			}
			
			 Set set = new LinkedHashSet();
			 set.addAll(stationIds);
			 stationIds.clear();
			 stationIds.addAll(set);
			 
			capabalities.setSensorIds(stationIds);
			List<ObservationOfferings> observationOfferingsList = new ArrayList<ObservationOfferings>();
			
			for(int i=0;i<observationsNodeList.getLength();i++)
	        {
				ObservationOfferings observationOfferings = new ObservationOfferings();
				CapbalitiesStationInfo capInfo = new CapbalitiesStationInfo();
				List<String> observedProperty = new ArrayList<String>();
				
	      	  	  Node cardelem = observationsNodeList.item(i);
	      	  
		          if(cardelem.getNodeType() == Node.ELEMENT_NODE) {
		        	  
		            Element firstElements = (Element)cardelem;
		            observationOfferings.setSensorId(firstElements.getAttribute("gml:id"));
		            
		            NodeList childNodesList = firstElements.getChildNodes();
		            if(!firstElements.getAttribute("gml:id").equals("network-all")) {
		            for(int ch=0;ch<childNodesList.getLength();ch++)
		            {
		            	 Node cardelems = childNodesList.item(ch);
		             	
		             	if(cardelems.getNodeName().equals("gml:name"))
		             	  {
		             		 observationOfferings.setName(cardelems.getTextContent());
		             		capInfo.setSensorId(cardelems.getTextContent());
		             	  }
		             	
		             	  if(cardelems.getNodeName().equals("gml:description"))
		             	  {
		             		 observationOfferings.setDescription(cardelems.getTextContent());
		             	  }
		             	 if(cardelems.getNodeName().equals("gml:srsName"))
		             	  {
		             		 observationOfferings.setSrsName(cardelems.getTextContent());
		             	  }
		             	  if(cardelems.getNodeName().equals("gml:boundedBy"))
		             	  {
		             		String latLong = cardelems.getTextContent().trim();
		             		String[] latLongArr = latLong.split(" ");
		             		observationOfferings.setLatitude(latLongArr[0]);
		             		observationOfferings.setLongitude(latLongArr[1].replace("\n", ""));
		             		capInfo.setLatitude(latLongArr[0]);
		             		capInfo.setLongitude(latLongArr[1].replace("\n", ""));
		             	  }
		             	 if(cardelems.getNodeName().equals("sos:time"))
		             	  {
		             		NodeList timeChildNodesList = cardelems.getChildNodes();
		             		for(int chI =0 ;chI<timeChildNodesList.getLength();chI++)
		             		{
		             			Node timeChildNode = timeChildNodesList.item(chI);
		             			//System.out.println(timeChildNode.getNodeName());
		             			if(timeChildNode.getNodeName().equals("gml:TimePeriod"))
		             			{
		             				NodeList timeInnerChildNodesList = timeChildNode.getChildNodes();
				             		for(int chJ =0 ;chJ<timeInnerChildNodesList.getLength();chJ++)
				             		{
				             			Node timeInnerChildNode = timeInnerChildNodesList.item(chJ);
				             			//System.out.println(timeInnerChildNode.getNodeName());
				             			if(timeInnerChildNode.getNodeName().equals("gml:beginPosition")) {
				             				//System.out.println("Begin Time:"+timeInnerChildNode.getTextContent());
				             				observationOfferings.setBeginTime(timeInnerChildNode.getTextContent());
				             			}
				             			if(timeInnerChildNode.getNodeName().equals("gml:endPosition")) {
				             				//System.out.println("End Time:"+timeInnerChildNode.getTextContent());
				             				observationOfferings.setEndTime(timeInnerChildNode.getTextContent());
				             			}
				             		}
		             			}
		             		}
		             		//String latLong = cardelems.getTextContent().trim();
		             		//String[] latLongArr = latLong.split(" ");
		             		//System.out.println("begin time:"+Arrays.toString(latLongArr));
		             		//observationOfferings.setLatitude(latLongArr[0]);
		             		//observationOfferings.setLongitude(latLongArr[1].replace("\n", ""));
		             		//capInfo.setLatitude(latLongArr[0]);
		             		//capInfo.setLongitude(latLongArr[1].replace("\n", ""));
		             	  }
		             	 if(cardelems.getNodeName().equals("sos:procedure"))
		             	  {
		             		observationOfferings.setProcedure(cardelems.getAttributes().getNamedItem("xlink:href").getTextContent());
		             	  }
		             	  if(cardelems.getNodeName().equals("sos:observedProperty"))
		             	  {
		             		observedProperty.add(cardelems.getAttributes().getNamedItem("xlink:href").getTextContent());
		             	  }
		             	  
		             	 
		            }
		            
		            observationOfferings.setObservedProperty(observedProperty);
	             	observationOfferingsList.add(observationOfferings);
		            
		            capStationIds.add(capInfo);
		          }
		         }
		          
		          capabalities.setObservationOfferings(observationOfferingsList);
		          //end of xml parsing
		          
	        }
		} catch (Exception e) {
			e.printStackTrace();
			throw e;
		}
		return capabalities;
	}

	public Map<String,Object> descirbeSensor(String sensorId) throws Exception {
		Map<String,Object> sensorInfo = new HashMap<String,Object>();
		try {
			
			sensorId = sensorId.replace("station", "sensor");
			
			System.out.println("Request:<?xml version=\\\"1.0\\\" encoding=\\\"UTF-8\\\"?>\\r\\n\" + \r\n" + 
					"							\"<DescribeSensor xmlns=\\\"http://www.opengis.net/sos/1.0\\\"\\r\\n\" + \r\n" + 
					"							\"xmlns:xsi=\\\"http://www.w3.org/2001/XMLSchema-instance\\\"\\r\\n\" + \r\n" + 
					"							\"xmlns:sos=\\\"http://www.opengis.net/sos/1.0\\\"\\r\\n\" + \r\n" + 
					"							\"xsi:schemaLocation=\\\"http://www.opengis.net/sos/1.0 http://schemas.opengis.net/sos/1.0.0/sosAll.xsd\\\"\\r\\n\" + \r\n" + 
					"							\"service=\\\"SOS\\\" outputFormat=\\\"text/xml;subtype=&quot;sensorML/1.0.1&quot;\\\" version=\\\"1.0.0\\\">\\r\\n\" + \r\n" + 
					"							\"<procedure>\\"+sensorId+"</procedure>\\r\\n\" + \r\n" + 
					"							\"</DescribeSensor>");
			
			HttpResponse<String> response = Unirest.post("https://sdf.ndbc.noaa.gov/sos/server.php")
					.header("Content-type", "text/xml")
					.body("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\r\n" + 
							"<DescribeSensor xmlns=\"http://www.opengis.net/sos/1.0\"\r\n" + 
							"xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\"\r\n" + 
							"xmlns:sos=\"http://www.opengis.net/sos/1.0\"\r\n" + 
							"xsi:schemaLocation=\"http://www.opengis.net/sos/1.0 http://schemas.opengis.net/sos/1.0.0/sosAll.xsd\"\r\n" + 
							"service=\"SOS\" outputFormat=\"text/xml;subtype=&quot;sensorML/1.0.1&quot;\" version=\"1.0.0\">\r\n" + 
							"<procedure>"+sensorId+"</procedure>\r\n" + 
							"</DescribeSensor>")

					.asString();

			System.out.println("Response:"+response.getBody());
			Document document = XmlUtils.getDocument(response.getBody());
			XPath xpath = XPathFactory.newInstance().newXPath();
			
			SensorDescription sensorDesc = new SensorDescription();
			
			String errorMessage=xpath.evaluate("//ExceptionReport//Exception//ExceptionText", document);
			if(!(errorMessage==null || errorMessage.isEmpty()))
			{
				sensorDesc.setErrorCode("001");
				sensorDesc.setErrorMessage(errorMessage);
				
			}
			else
			{
				sensorDesc.setName(xpath.evaluate("//SensorML//member//System//name", document)+"\n");
				sensorDesc.setDescription(xpath.evaluate("//SensorML//member//System//description", document)+"\n");
				sensorDesc.setPropertyName(xpath.evaluate("//SensorML//member//System//identification//IdentifierList//identifier[@name='longName']//Term//value", document)+"\n");
				sensorDesc.setClassifierPlatform(xpath.evaluate("//SensorML//member//System//classification//ClassifierList//classifier[@name='platformType']//Term//value", document)+"\n");
				sensorDesc.setClassifierPublisher(xpath.evaluate("//SensorML//member//System//classification//ClassifierList//classifier[@name='publisher']//Term//value", document)+"\n");
				sensorDesc.setOrganizationName(xpath.evaluate("//SensorML//member//System//contact[contains(@xlink:role,'operator')]//ResponsibleParty//organizationName", document)+"\n");
				sensorDesc.setCountry(xpath.evaluate("//SensorML//member//System//contact//ResponsibleParty//contactInfo//address//country", document)+"\n");
				sensorDesc.setAddress(xpath.evaluate("//SensorML//member//System//contact//ResponsibleParty//contactInfo//address//deliveryPoint", document)
						+"\n"+xpath.evaluate("//SensorML//member//System//contact//ResponsibleParty//contactInfo//address//city", document)
						+"\n"+xpath.evaluate("//SensorML//member//System//contact//ResponsibleParty//contactInfo//address//administrativeArea", document)
						+"\n"+xpath.evaluate("//SensorML//member//System//contact//ResponsibleParty//contactInfo//address//postalCode", document)
						+"\n"+xpath.evaluate("//SensorML//member//System//contact//ResponsibleParty//contactInfo//address//electronicMailAddress", document));
				
				sensorDesc.setLatitude(xpath.evaluate("//SensorML//member//System//location//Point//coordinates", document).split(" ")[0]);
				sensorDesc.setLongitude(xpath.evaluate("//SensorML//member//System//location//Point//coordinates", document).split(" ")[1].replace("\n", ""));;
			}
			sensorInfo.put("response", response.getBody());
			sensorInfo.put("sensorDesc",sensorDesc);
		}
		catch(Exception e) {
			e.printStackTrace();
			throw e;
		}
		
		return sensorInfo;
	}

	public Map<String,Object> getObservationAirTemp(String stationId, String time)
	{
		Map<String,Object> resultMap = new HashMap<String,Object>();
		try
		{
			
			System.out.println("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\r\n" + 
					"<sos:GetObservation xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:om=\"http://www.opengis.net/om/1.0\"\r\n" + 
					"xsi:schemaLocation=\"http://www.opengis.net/sos/1.0 http://schemas.opengis.net/sos/1.0.0/sosAll.xsd\"\r\n" + 
					"xmlns:sos=\"http://www.opengis.net/sos/1.0\" xmlns:ogc=\"http://www.opengis.net/ogc\" xmlns:gml=\"http://www.opengis.net/gml/3.2\"\r\n" + 
					"service=\"SOS\" version=\"1.0.0\" srsName=\"EPSG:4326\">\r\n" + 
					"  <sos:offering>"+stationId+"</sos:offering>\r\n" + 
					"  <sos:eventTime>\r\n" + 
					"    <ogc:TM_Equals>\r\n" + 
					"      <ogc:PropertyName>om:samplingTime</ogc:PropertyName>\r\n" + 
					"      <gml:TimeInstant>\r\n" + 
					"        <gml:timePosition>"+time+"</gml:timePosition>\r\n" + 
					"      </gml:TimeInstant>\r\n" + 
					"    </ogc:TM_Equals>\r\n" + 
					"  </sos:eventTime>\r\n" + 
					"  <sos:observedProperty>air_temperature</sos:observedProperty>\r\n" + 
					"  <sos:responseFormat>text/xml;subtype=\"om/1.0.0\"</sos:responseFormat>\r\n" + 
					"  <sos:resultModel>om:Observation</sos:resultModel>\r\n" + 
					"  <sos:responseMode>inline</sos:responseMode>\r\n" + 
					"</sos:GetObservation>");
			
			HttpResponse<String> response = Unirest.post("https://sdf.ndbc.noaa.gov/sos/server.php")
					.header("Content-type", "text/xml")
					.body("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\r\n" + 
							"<sos:GetObservation xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:om=\"http://www.opengis.net/om/1.0\"\r\n" + 
							"xsi:schemaLocation=\"http://www.opengis.net/sos/1.0 http://schemas.opengis.net/sos/1.0.0/sosAll.xsd\"\r\n" + 
							"xmlns:sos=\"http://www.opengis.net/sos/1.0\" xmlns:ogc=\"http://www.opengis.net/ogc\" xmlns:gml=\"http://www.opengis.net/gml/3.2\"\r\n" + 
							"service=\"SOS\" version=\"1.0.0\" srsName=\"EPSG:4326\">\r\n" + 
							"  <sos:offering>"+stationId+"</sos:offering>\r\n" + 
							"  <sos:eventTime>\r\n" + 
							"    <ogc:TM_Equals>\r\n" + 
							"      <ogc:PropertyName>om:samplingTime</ogc:PropertyName>\r\n" + 
							"      <gml:TimeInstant>\r\n" + 
							"        <gml:timePosition>"+time+"</gml:timePosition>\r\n" + 
							"      </gml:TimeInstant>\r\n" + 
							"    </ogc:TM_Equals>\r\n" + 
							"  </sos:eventTime>\r\n" + 
							"  <sos:observedProperty>air_temperature</sos:observedProperty>\r\n" + 
							"  <sos:responseFormat>text/xml;subtype=\"om/1.0.0\"</sos:responseFormat>\r\n" + 
							"  <sos:resultModel>om:Observation</sos:resultModel>\r\n" + 
							"  <sos:responseMode>inline</sos:responseMode>\r\n" + 
							"</sos:GetObservation>")

					.asString();
			
			System.out.println(response.getBody());
			
			Document document = XmlUtils.getDocument(response.getBody());
			
			XPath xpath = XPathFactory.newInstance().newXPath();
			
			ObservationAirTempInfo observationAirTemp = new ObservationAirTempInfo();
			
			String errorMessage=xpath.evaluate("//ExceptionReport//Exception//ExceptionText", document);
			if(!(errorMessage==null || errorMessage.isEmpty()))
			{
				observationAirTemp.setErrorCode("001");
				observationAirTemp.setErrorMessage(errorMessage);
				
			}
			else
			{
				observationAirTemp.setDescription(xpath.evaluate("//ObservationCollection//member//Observation//description", document));
				observationAirTemp.setBoundedBy(xpath.evaluate("//ObservationCollection//boundedBy//Envelope//lowerCorner", document));
				observationAirTemp.setLatitude(xpath.evaluate("//ObservationCollection//result//DataStream//elementType//DataRecord//field[@name='location']//Vector//coordinate[@name='latitude']//Quantity//value", document));
				observationAirTemp.setLongitude(xpath.evaluate("//ObservationCollection//result//DataStream//elementType//DataRecord//field[@name='location']//Vector//coordinate[@name='longitude']//Quantity//value", document));
				observationAirTemp.setStationId(xpath.evaluate("//ObservationCollection//result//DataStream//elementType//DataRecord//field[@name='stationID']//Text//value", document));
				observationAirTemp.setTime(xpath.evaluate("//ObservationCollection//result//DataStream//elementType//DataRecord//field[@name='time']//Time//value", document));
				observationAirTemp.setAltitude(xpath.evaluate("//ObservationCollection//result//DataStream//elementType//DataRecord//field[@name='altitude']//Quantity//value", document));
				observationAirTemp.setAltitudeUnit(xpath.evaluate("//ObservationCollection//result//DataStream//elementType//DataRecord//field[@name='altitude']//Quantity//uom//@code", document));
				observationAirTemp.setTemperature(xpath.evaluate("//ObservationCollection//result//DataStream//values", document).split(",")[1]);
				observationAirTemp.setTemperatureUnit(xpath.evaluate("//ObservationCollection//result//DataStream//elementType//DataRecord//field[@name='air_temperature']//Quantity//uom//@code", document));
			}
			
			resultMap.put("response", response.getBody());
			resultMap.put("observation",observationAirTemp);
		}
		catch(Exception e)
		{
			e.printStackTrace();
		}
		
		return resultMap;
	}
	
	public Map<String,Object> getObservationAirTempSeries(String stationId, String beginTime, String endTime)
	{
		Map<String,Object> resultMap = new HashMap<String,Object>();
		try
		{
			
			System.out.println("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\r\n" + 
					"<sos:GetObservation xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:om=\"http://www.opengis.net/om/1.0\"\r\n" + 
					"xsi:schemaLocation=\"http://www.opengis.net/sos/1.0 http://schemas.opengis.net/sos/1.0.0/sosAll.xsd\"\r\n" + 
					"xmlns:sos=\"http://www.opengis.net/sos/1.0\" xmlns:ogc=\"http://www.opengis.net/ogc\" xmlns:gml=\"http://www.opengis.net/gml/3.2\"\r\n" + 
					"service=\"SOS\" version=\"1.0.0\" srsName=\"EPSG:4326\">\r\n" + 
					"  <sos:offering>"+stationId+"</sos:offering>\r\n" + 
					"  <sos:eventTime>\r\n" + 
					"    <ogc:TM_During>\r\n" + 
					"      <ogc:PropertyName>om:samplingTime</ogc:PropertyName>\r\n" + 
					"      <gml:TimePeriod>\r\n" + 
					"        <gml:beginPosition>"+beginTime+"</gml:beginPosition>\r\n" + 
					"        <gml:endPosition>"+endTime+"</gml:endPosition>\r\n" + 
					"      </gml:TimePeriod>\r\n" + 
					"    </ogc:TM_During>\r\n" + 
					"  </sos:eventTime>\r\n" + 
					"  <sos:observedProperty>air_temperature</sos:observedProperty>\r\n" + 
					"  <sos:responseFormat>text/xml;subtype=\"om/1.0.0\"</sos:responseFormat>\r\n" + 
					"  <sos:resultModel>om:Observation</sos:resultModel>\r\n" + 
					"  <sos:responseMode>inline</sos:responseMode>\r\n" + 
					"</sos:GetObservation>");
			
			HttpResponse<String> response = Unirest.post("https://sdf.ndbc.noaa.gov/sos/server.php")
					.header("Content-type", "text/xml")
					.body("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\r\n" + 
							"<sos:GetObservation xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:om=\"http://www.opengis.net/om/1.0\"\r\n" + 
							"xsi:schemaLocation=\"http://www.opengis.net/sos/1.0 http://schemas.opengis.net/sos/1.0.0/sosAll.xsd\"\r\n" + 
							"xmlns:sos=\"http://www.opengis.net/sos/1.0\" xmlns:ogc=\"http://www.opengis.net/ogc\" xmlns:gml=\"http://www.opengis.net/gml/3.2\"\r\n" + 
							"service=\"SOS\" version=\"1.0.0\" srsName=\"EPSG:4326\">\r\n" + 
							"  <sos:offering>"+stationId+"</sos:offering>\r\n" + 
							"  <sos:eventTime>\r\n" + 
							"    <ogc:TM_During>\r\n" + 
							"      <ogc:PropertyName>om:samplingTime</ogc:PropertyName>\r\n" + 
							"      <gml:TimePeriod>\r\n" + 
							"        <gml:beginPosition>"+beginTime+"</gml:beginPosition>\r\n" + 
							"        <gml:endPosition>"+endTime+"</gml:endPosition>\r\n" + 
							"      </gml:TimePeriod>\r\n" + 
							"    </ogc:TM_During>\r\n" + 
							"  </sos:eventTime>\r\n" + 
							"  <sos:observedProperty>air_temperature</sos:observedProperty>\r\n" + 
							"  <sos:responseFormat>text/xml;subtype=\"om/1.0.0\"</sos:responseFormat>\r\n" + 
							"  <sos:resultModel>om:Observation</sos:resultModel>\r\n" + 
							"  <sos:responseMode>inline</sos:responseMode>\r\n" + 
							"</sos:GetObservation>")

					.asString();
			
			System.out.println(response.getBody());
			
			Document document = XmlUtils.getDocument(response.getBody());
			
			XPath xpath = XPathFactory.newInstance().newXPath();
			
			ObservationAirTempSeriesInfo observationAirTempSeriesInfo = new ObservationAirTempSeriesInfo();
			
			String errorMessage=xpath.evaluate("//ExceptionReport//Exception//ExceptionText", document);
			if(!(errorMessage==null || errorMessage.isEmpty()))
			{
				observationAirTempSeriesInfo.setErrorCode("001");
				observationAirTempSeriesInfo.setErrorMessage(errorMessage);
				
			}
			else
			{
				observationAirTempSeriesInfo.setDescription(xpath.evaluate("//ObservationCollection//member//Observation//description", document));
				observationAirTempSeriesInfo.setLatitude(xpath.evaluate("//ObservationCollection//result//DataStream//elementType//DataRecord//field[@name='location']//Vector//coordinate[@name='latitude']//Quantity//value", document));
				observationAirTempSeriesInfo.setLongitude(xpath.evaluate("//ObservationCollection//result//DataStream//elementType//DataRecord//field[@name='location']//Vector//coordinate[@name='longitude']//Quantity//value", document));
				observationAirTempSeriesInfo.setStationId(xpath.evaluate("//ObservationCollection//result//DataStream//elementType//DataRecord//field[@name='stationID']//Text//value", document));
				observationAirTempSeriesInfo.setBeginTime(xpath.evaluate("//ObservationCollection//member//Observation//samplingTime//TimePeriod//beginPosition", document));
				observationAirTempSeriesInfo.setEndTime(xpath.evaluate("//ObservationCollection//member//Observation//samplingTime//TimePeriod//endPosition", document));
				observationAirTempSeriesInfo.setAltitude(xpath.evaluate("//ObservationCollection//result//DataStream//elementType//DataRecord//field[@name='altitude']//Quantity//value", document));
				observationAirTempSeriesInfo.setAltitudeUnit(xpath.evaluate("//ObservationCollection//result//DataStream//elementType//DataRecord//field[@name='altitude']//Quantity//uom//@code", document));
				observationAirTempSeriesInfo.setTemperatureUnit(xpath.evaluate("//ObservationCollection//result//DataStream//elementType//DataRecord//field[@name='air_temperature']//Quantity//uom//@code", document));
				
				String[] tempArray = xpath.evaluate("//ObservationCollection//result//DataStream//values", document).split("\n");
				List<AirTempSeriesInfo> tempSeriesInfo = new ArrayList<AirTempSeriesInfo>();
				for(String each : tempArray) {
					AirTempSeriesInfo obj = new AirTempSeriesInfo();
					String[] tempDetail = each.split(",");
					obj.setTemp(tempDetail[2]);
					obj.setTime(tempDetail[0]);
					tempSeriesInfo.add(obj);
					
				}
				observationAirTempSeriesInfo.setAirTempSeries(tempSeriesInfo);
			}
			resultMap.put("response", response.getBody());
			resultMap.put("observation",observationAirTempSeriesInfo);
		}
		catch(Exception e)
		{
			e.printStackTrace();
		}
		
		return resultMap;
	}
}
