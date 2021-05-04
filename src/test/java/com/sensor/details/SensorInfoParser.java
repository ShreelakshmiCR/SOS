package com.sensor.details;

import javax.xml.xpath.XPath;
import javax.xml.xpath.XPathFactory;

import org.w3c.dom.Document;

import com.sensor.details.pojo.SensorDescription;
import com.sensor.details.utils.XmlUtils;

public class SensorInfoParser {

	public static void main(String[] args) throws IllegalArgumentException, Exception {
		
		String response = "<?xml version=\"1.0\" encoding=\"UTF-8\"?><sml:SensorML xmlns:sml=\"http://www.opengis.net/sensorML/1.0.1\" xmlns:gml=\"http://www.opengis.net/gml\" xmlns:swe=\"http://www.opengis.net/swe/1.0.1\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xsi:schemaLocation=\"http://www.opengis.net/sensorML/1.0.1 http://schemas.opengis.net/sensorML/1.0.1/sensorML.xsd\" version=\"1.0.1\"><sml:member><sml:System><gml:description>Sensor metadata for airtemp1 on 14043 - </gml:description><gml:name>urn:ioos:sensor:wmo:14043::airtemp1</gml:name><sml:identification><sml:IdentifierList><sml:identifier name=\"sensorId\"><sml:Term definition=\"http://mmisw.org/ont/ioos/definition/sensorID\"><sml:value>urn:ioos:sensor:wmo:14043::airtemp1</sml:value></sml:Term></sml:identifier><sml:identifier name=\"shortName\"><sml:Term definition=\"http://mmisw.org/ont/ioos/definition/shortName\"><sml:value>airtemp1</sml:value></sml:Term></sml:identifier><sml:identifier name=\"longName\"><sml:Term definition=\"http://mmisw.org/ont/ioos/definition/longName\"><sml:value>AirTemperature</sml:value></sml:Term></sml:identifier></sml:IdentifierList></sml:identification><sml:classification><sml:ClassifierList><sml:classifier name=\"platformType\"><sml:Term definition=\"http://mmisw.org/ont/ioos/definition/platformType\"><sml:codeSpace xlink:href=\"http://mmisw.org/ont/ioos/platform\"/><sml:value>MOORED BUOY</sml:value></sml:Term></sml:classifier><sml:classifier name=\"publisher\"><sml:Term definition=\"http://mmisw.org/ont/ioos/definition/publisher\"><sml:codeSpace xlink:href=\"http://mmisw.org/ont/ioos/organization\"/><sml:value>NDBC</sml:value></sml:Term></sml:classifier></sml:ClassifierList></sml:classification><sml:capabilities name=\"ioosServiceMetadata\"><swe:SimpleDataRecord><gml:metaDataProperty xlink:title=\"ioosTemplateVersion\" xlink:href=\"https://code.google.com/p/ioostech/source/browse/#svn%2Ftrunk%2Ftemplates%2FMilestone1.0\"><gml:version>1.0</gml:version></gml:metaDataProperty></swe:SimpleDataRecord></sml:capabilities><sml:contact xlink:role=\"http://mmisw.org/ont/ioos/definition/operator\"><sml:ResponsibleParty><sml:organizationName>Research Moored Array for African-Asian-Australian Monsoon Analysis and Prediction</sml:organizationName><sml:contactInfo><sml:address><sml:country>US</sml:country></sml:address></sml:contactInfo></sml:ResponsibleParty></sml:contact><sml:contact xlink:role=\"http://mmisw.org/ont/ioos/definition/publisher\" xlink:href=\"https://sdf.ndbc.noaa.gov/\"><sml:ResponsibleParty><sml:organizationName>National Data Buoy Center</sml:organizationName><sml:contactInfo><sml:phone><sml:voice>228-688-2805</sml:voice></sml:phone><sml:address><sml:deliveryPoint>Bldg. 3205</sml:deliveryPoint><sml:city>Stennis Space Center</sml:city><sml:administrativeArea>MS</sml:administrativeArea><sml:postalCode>39529</sml:postalCode><sml:country>USA</sml:country><sml:electronicMailAddress>webmaster.ndbc@noaa.gov</sml:electronicMailAddress></sml:address></sml:contactInfo></sml:ResponsibleParty></sml:contact><sml:documentation xlink:arcrole=\"qualityControlDocument\"><sml:Document><gml:description>Handbook of Automated Data Quality Control Checks and Procedures, National Data Buoy Center, August 2009</gml:description><sml:format>pdf</sml:format><sml:onlineResource xlink:href=\"http://www.ndbc.noaa.gov/NDBCHandbookofAutomatedDataQualityControl2009.pdf\"/></sml:Document></sml:documentation><sml:location><gml:Point gml:id=\"stationLocation14043\" srsName=\"http://www.opengis.net/def/crs/EPSG/0/4326\"><gml:coordinates>-12 67</gml:coordinates></gml:Point></sml:location></sml:System></sml:member></sml:SensorML>";
		Document document = XmlUtils.getDocument(response);
		XPath xpath = XPathFactory.newInstance().newXPath();
		
		SensorDescription sensorDesc = new SensorDescription();
		
		sensorDesc.setName(xpath.evaluate("//SensorML//member//System//name", document));
		sensorDesc.setDescription(xpath.evaluate("//SensorML//member//System//description", document));
		sensorDesc.setPropertyName(xpath.evaluate("//SensorML//member//System//identification//IdentifierList//identifier[@name='longName']//Term//value", document));
		sensorDesc.setClassifierPlatform(xpath.evaluate("//SensorML//member//System//classification//ClassifierList//classifier[@name='platformType']//Term//value", document));
		sensorDesc.setClassifierPublisher(xpath.evaluate("//SensorML//member//System//classification//ClassifierList//classifier[@name='publisher']//Term//value", document));
		sensorDesc.setOrganizationName(xpath.evaluate("//SensorML//member//System//contact[contains(@xlink:role,'operator')]//ResponsibleParty//organizationName", document));
		sensorDesc.setCountry(xpath.evaluate("//SensorML//member//System//contact//ResponsibleParty//contactInfo//address//country", document));
		sensorDesc.setAddress(xpath.evaluate("//SensorML//member//System//contact//ResponsibleParty//contactInfo//address//deliveryPoint", document)
				+" "+xpath.evaluate("//SensorML//member//System//contact//ResponsibleParty//contactInfo//address//city", document)
				+" "+xpath.evaluate("//SensorML//member//System//contact//ResponsibleParty//contactInfo//address//administrativeArea", document)
				+" "+xpath.evaluate("//SensorML//member//System//contact//ResponsibleParty//contactInfo//address//postalCode", document)
				+" "+xpath.evaluate("//SensorML//member//System//contact//ResponsibleParty//contactInfo//address//electronicMailAddress", document));
		
		sensorDesc.setLatitude(xpath.evaluate("//SensorML//member//System//location//Point//coordinates", document).split(" ")[0]);
		sensorDesc.setLongitude(xpath.evaluate("//SensorML//member//System//location//Point//coordinates", document).split(" ")[1].replace("\n", ""));
		System.out.println(sensorDesc.toString());
	}
}
