package com.sensor.details;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.Unmarshaller;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.xpath.XPath;
import javax.xml.xpath.XPathConstants;
import javax.xml.xpath.XPathFactory;

import com.sun.org.apache.xerces.internal.jaxp.DocumentBuilderFactoryImpl;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NamedNodeMap;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

//import com.sensor.details.pojo.Capabilities;
import com.sensor.details.utils.XmlUtils;

public class SensorDataParser {

	public static void main(String[] args) throws IllegalArgumentException, Exception {

		
		Document doc = getDocumentFromFile("E:\\ndbc.xml");
		
		NodeList observationsNodeList = doc.getElementsByTagName("sos:ObservationOffering");
		
		Capabalities capabalities = new Capabalities();
		
		NodeList acctdetails = doc.getElementsByTagName("sos:procedure");
		
		 List<String> stationIds = new ArrayList<String>();
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
	           // System.out.println("Sensor ID:"+firstElements.getAttribute("gml:id")+"\n-----");
	            observationOfferings.setSensorId(firstElements.getAttribute("gml:id"));
	            
	            NodeList childNodesList = firstElements.getChildNodes();
	            
	            for(int ch=0;ch<childNodesList.getLength();ch++)
	            {
	            	 Node cardelems = childNodesList.item(ch);
	             	// System.out.println("Sensor Name:"+cardelems.getNodeName());
	             	// System.out.println("Sensor Value::"+cardelems.getTextContent());
	             	  
	             	if(cardelems.getNodeName().equals("name"))
	             	  {
	             		 observationOfferings.setName(cardelems.getNodeName());
	             	  }
	             	
	             	  if(cardelems.getNodeName().equals("gml:description"))
	             	  {
	             		 observationOfferings.setDescription(cardelems.getNodeName());
	             	  }
	             	 if(cardelems.getNodeName().equals("gml:srsName"))
	             	  {
	             		 observationOfferings.setSrsName(cardelems.getNodeName());
	             	  }
	             	  if(cardelems.getNodeName().equals("gml:boundedBy"))
	             	  {
	             		 String latLong = cardelems.getTextContent().trim();
	             		 String[] latLongArr = latLong.split(" ");
	             		 //System.out.println("PRINT:Lat:"+latLongArr[0]+" Long "+latLongArr[1]);
	             		observationOfferings.setLatitude(latLongArr[0]);
	             		observationOfferings.setLongitude(latLongArr[1]);
	             	  }
	             	  
	             	  if(cardelems.getNodeName().equals("sos:observedProperty"))
	             	  {
	             		System.out.println("property:"+cardelems.getAttributes().getNamedItem("xlink:href").getTextContent());
	             		observedProperty.add(cardelems.getAttributes().getNamedItem("xlink:href").getTextContent());
	             	  }
	             	  
	             	  //if(cardelems.getNodeName()args.e)
	             	 observationOfferings.setObservedProperty(observedProperty);
	             	observationOfferingsList.add(observationOfferings);
	            }
	         }
	          
	          capabalities.setObservationOfferings(observationOfferingsList);
        }
		
		//System.out.println(capabalities);
		
		// NodeList acctdetails = doc.getElementsByTagName("AcctDtls");
		
		/*
		for (int i = 0; i < acctdetails.getLength(); i++) {
			Node nNode = acctdetails.item(i);
			NamedNodeMap nMap = nNode.getAttributes();
			
			//System.out.println("Node name:"+nNode.getNodeName());
			//System.out.println("Node value:"+nNode.getNodeValue());
			
			for (int j = 0; j < nMap.getLength(); j++) {
				Node mNode = nMap.item(j);
				//stationIds.add(mNode.getNodeValue());
				System.out.println("Node value:"+mNode.getNodeValue());
				NodeList childList = mNode.getChildNodes();
				
				
				System.out.println(" Child nodes length:"+childList.getLength());
				for (int k = 0; k < childList.getLength(); k++) {
		            Node childNode = childList.item(k);
		            
		            NamedNodeMap attrs = childNode.getAttributes();
		            Node comp = attrs.getNamedItem("compression");
		            
		            System.out.println("Name:"+childNode.getNodeName());
		            //if ("TaskID".equals(childNode.getNodeName())) {
		               // System.out.println("Text:"+childList.item(k).getTextContent().trim());
		           // }
		            System.out.println("Text:"+childNode.getTextContent());
		            
		            System.out.println(childNode.getChildNodes().getLength());
		            
		           
		           
		             
		        }
			}
			
		}
		*/
		
		/*
		
		 NodeList feeds = doc.getElementsByTagName("sos:ObservationOfferingList");
		 
		 System.out.println("List length:"+feeds.getLength());
		 
		    for (int i = 0; i < feeds.getLength(); i++) {
		        Node mainNode = feeds.item(i);
		        System.out.println("is Node:"+(mainNode.getNodeType() == Node.ELEMENT_NODE));
		        if (mainNode.getNodeType() == Node.ELEMENT_NODE) {
		        	
		            Element firstElement = (Element) mainNode;
		            System.out.println("First element "
		                    + firstElement.getTagName());
		            NodeList forumidNameList = firstElement
		                    .getElementsByTagName("sos:ObservationOffering");

		            System.out.println("Ob Off length:"+feeds.getLength());
		            
		            for (int j = 0; j < forumidNameList.getLength(); ++j) {
		                Element value = (Element) forumidNameList.item(j);

		                NodeList conditionList = value
		                        .getElementsByTagName("description");
		                for (int k = 0; k < conditionList.getLength(); ++k) {
		                    Element condition = (Element) conditionList.item(k);
		                    if (condition.getParentNode().getNodeName()
		                            .equals("ObservationOffering")) {
		                        String conditionText = condition
		                                .getFirstChild().getNodeValue();
		                        System.out.println("description " + conditionText);

		                    }
		                }
		                NodeList conditionList1 = value
		                        .getElementsByTagName("name");
		                for (int k = 0; k < conditionList1.getLength(); ++k) {
		                    Element condition = (Element) conditionList1
		                            .item(k);
		                    String conditionText = condition.getFirstChild()
		                            .getNodeValue();
		                    System.out.println("name " + conditionText);
		                }
		                NodeList conditionList2 = value
		                        .getElementsByTagName("srsName");
		                for (int k = 0; k < conditionList2.getLength(); ++k) {
		                    Element condition = (Element) conditionList2
		                            .item(k);
		                    for (int l = 0; l < condition.getChildNodes()
		                            .getLength(); ++l) {
		                        Element condition2 = (Element) condition
		                                .getChildNodes().item(l);
		                        String conditionText = condition2
		                                .getFirstChild().getNodeValue();
		                        System.out
		                                .println("srsName " + conditionText);
		                    }
		                }
		                NodeList conditionList3 = value
		                        .getElementsByTagName("procedure");
		                for (int k = 0; k < conditionList3.getLength(); ++k) {
		                    Element condition = (Element) conditionList3
		                            .item(k);
		                    String conditionText = condition.getFirstChild()
		                            .getNodeValue();
		                    System.out.println("procedure " + conditionText);
		                }
		                NodeList conditionList4 = value
		                        .getElementsByTagName("responseMode");
		                for (int k = 0; k < conditionList4.getLength(); ++k) {
		                    Element condition = (Element) conditionList4
		                            .item(k);
		                    String conditionText = condition.getFirstChild()
		                            .getNodeValue();
		                    System.out.println("responseMode " + conditionText);
		                }
		            }
		        }
		    }
			*/
		
			/*
			
			XPath xPath = XPathFactory.newInstance().newXPath();
	        Document doc = getDocumentFromFile("E:\\ndbc.xml");
			
	        String expression = "//Capabilities//Contents//ObservationOfferingList//ObservationOffering";	        
		      
	         
	         NodeList nodeList = (NodeList) xPath.compile(expression).evaluate(
	            doc, XPathConstants.NODESET);
	         
	         for (int i = 0; i < nodeList.getLength(); i++) {
	             Node nNode = nodeList.item(i);
	             System.out.println("\nCurrent Element :" + nNode.toString());
	             System.out.println("\nCurrent Element :" + nNode.getNodeName());
	             System.out.println("\nCurrent Element attributes :" + nNode.getAttributes().item(0));
	             System.out.println("\nCurrent Element Value :" + nNode.getNodeValue());
	         }
		*/
		
		/*
		 File file = new File("E:\\ndbc.xml");  
	        JAXBContext jaxbContext = JAXBContext.newInstance(Capabilities.class);  
	   
	        Unmarshaller jaxbUnmarshaller = jaxbContext.createUnmarshaller();  
	        Capabilities que= (Capabilities) jaxbUnmarshaller.unmarshal(file);
	        System.out.println(que.toString());
	        
	        */
	}

	public static Document getDocumentFromFile(String filepath) throws IllegalArgumentException, Exception {
		
		DocumentBuilderFactory documentBuilderFactory = new DocumentBuilderFactoryImpl();

		DocumentBuilder documentBuilder = documentBuilderFactory.newDocumentBuilder();

		Document resultDocument = documentBuilder
				.parse(new File(filepath));

		return resultDocument;
	}
	
	public static List<Element> getElements(final NodeList nodeList) {
	    final int len = nodeList.getLength();
	    final List<Element> elements = new ArrayList<>(len);
	    for (int i = 0; i < len; i++) {
	      final Node node = nodeList.item(i);
	      if (node.getNodeType() == Node.ELEMENT_NODE) {
	        elements.add((Element) node);
	      }
	      // Ignore other node types.
	    }
	    return elements;
	  }
}

class Capabalities
{
	private String providerName;
	private String providerSite;
	private String phone;
	private String address;
	private List<String> sensorIds;
	private List<ObservationOfferings> observationOfferings;
	
	public Capabalities() {
		super();
	}

	public Capabalities(String providerName, String providerSite, String phone, String address, List<String> sensorIds,
			List<ObservationOfferings> observationOfferings) {
		super();
		this.providerName = providerName;
		this.providerSite = providerSite;
		this.phone = phone;
		this.address = address;
		this.sensorIds = sensorIds;
		this.observationOfferings = observationOfferings;
	}

	public String getProviderName() {
		return providerName;
	}

	public void setProviderName(String providerName) {
		this.providerName = providerName;
	}

	public String getProviderSite() {
		return providerSite;
	}

	public void setProviderSite(String providerSite) {
		this.providerSite = providerSite;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public List<String> getSensorIds() {
		return sensorIds;
	}

	public void setSensorIds(List<String> sensorIds) {
		this.sensorIds = sensorIds;
	}

	public List<ObservationOfferings> getObservationOfferings() {
		return observationOfferings;
	}

	public void setObservationOfferings(List<ObservationOfferings> observationOfferings) {
		this.observationOfferings = observationOfferings;
	}

	@Override
	public String toString() {
		return "Capabalities [providerName=" + providerName + ", providerSite=" + providerSite + ", phone=" + phone
				+ ", address=" + address + ", sensorIds=" + sensorIds + ", observationOfferings=" + observationOfferings
				+ "]";
	}
	
}

class ObservationOfferings
{
	private String sensorId;
	private String description;
	private String name;
	private String srsName;
	private String latitude;
	private String longitude;
	private String procedure;
	private List<String> observedProperty;
	
	public ObservationOfferings()
	{
		
	}

	public ObservationOfferings(String sensorId, String description, String name, String srsName, String latitude,
			String longitude, String procedure, List<String> observedProperty) {
		super();
		this.sensorId = sensorId;
		this.description = description;
		this.name = name;
		this.srsName = srsName;
		this.latitude = latitude;
		this.longitude = longitude;
		this.procedure = procedure;
		this.observedProperty = observedProperty;
	}

	public String getSensorId() {
		return sensorId;
	}

	public void setSensorId(String sensorId) {
		this.sensorId = sensorId;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getSrsName() {
		return srsName;
	}

	public void setSrsName(String srsName) {
		this.srsName = srsName;
	}

	public String getLatitude() {
		return latitude;
	}

	public void setLatitude(String latitude) {
		this.latitude = latitude;
	}

	public String getLongitude() {
		return longitude;
	}

	public void setLongitude(String longitude) {
		this.longitude = longitude;
	}

	public String getProcedure() {
		return procedure;
	}

	public void setProcedure(String procedure) {
		this.procedure = procedure;
	}

	public List<String> getObservedProperty() {
		return observedProperty;
	}

	public void setObservedProperty(List<String> observedProperty) {
		this.observedProperty = observedProperty;
	}

	@Override
	public String toString() {
		return "ObservationOfferings [sensorId=" + sensorId + ", description=" + description + ", name=" + name
				+ ", srsName=" + srsName + ", latitude=" + latitude + ", longitude=" + longitude + ", procedure="
				+ procedure + ", observedProperty=" + observedProperty + "]";
	}
	
	
}
