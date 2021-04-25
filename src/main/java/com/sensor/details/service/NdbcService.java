package com.sensor.details.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.xml.xpath.XPath;
import javax.xml.xpath.XPathFactory;

import org.json.simple.JSONObject;
import org.springframework.stereotype.Service;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NamedNodeMap;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import com.sensor.details.pojo.Capabalities;
import com.sensor.details.pojo.ObservationOfferings;
import com.sensor.details.utils.XmlUtils;

import kong.unirest.HttpResponse;
import kong.unirest.Unirest;

@Service
public class NdbcService {

	public Capabalities getAllStations() throws Exception {
		List<String> stationIds = new ArrayList<String>();
		Map<String,Object> stationsMap = new HashMap<String,Object>();
		Capabalities capabalities = new Capabalities();
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
			capabalities.setResponseXML(response.getBody());
			
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
			capabalities.setSensorIds(stationIds);
			List<ObservationOfferings> observationOfferingsList = new ArrayList<ObservationOfferings>();
			
			for(int i=0;i<observationsNodeList.getLength();i++)
	        {
				ObservationOfferings observationOfferings = new ObservationOfferings();
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
		             	  }
		             	 if(cardelems.getNodeName().equals("sos:procedure"))
		             	  {
		             		observationOfferings.setProcedure(cardelems.getAttributes().getNamedItem("xlink:href").getTextContent());
		             	  }
		             	  if(cardelems.getNodeName().equals("sos:observedProperty"))
		             	  {
		             		observedProperty.add(cardelems.getAttributes().getNamedItem("xlink:href").getTextContent());
		             	  }
		             	  
		             	 observationOfferings.setObservedProperty(observedProperty);
		             	observationOfferingsList.add(observationOfferings);
		            }
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

			Document document = XmlUtils.getDocument(response.getBody());
			XPath xpath = XPathFactory.newInstance().newXPath();
			
			
			sensorInfo.put("response", response.getBody());
			
		}
		catch(Exception e) {
			e.printStackTrace();
			throw e;
		}
		
		return sensorInfo;
	}
}
