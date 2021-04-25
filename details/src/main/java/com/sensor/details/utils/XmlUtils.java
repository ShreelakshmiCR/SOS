package com.sensor.details.utils;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.DataOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.StringWriter;
import java.util.Collections;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;

import org.apache.xerces.jaxp.DocumentBuilderFactoryImpl;
import org.apache.xml.serialize.OutputFormat;
import org.apache.xml.serialize.XMLSerializer;
import org.w3c.dom.Attr;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NamedNodeMap;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;


public class XmlUtils {
	/**
	 * Checks if node name equals given string
	 *
	 * @param inputNode
	 *            Input Node
	 * @param inputName
	 *            String value that needs to be compared with node name
	 * @return <code>true</code> If node name equals given string; <code>false</code>
	 *         otherwise
	 * @throws IllegalArgumentException
	 *             If input is invalid
	 */
	public static boolean isSameName(Node inputNode, String inputName)
		throws IllegalArgumentException {
		//Validate input node name
		if (StringUtils.isNullOrEmpty(inputName)) {
			throw new IllegalArgumentException(
				"Input node name cannot be null or empty"
					+ " XmlUtils.isSameName method");
		}

		//Validate input node
		if (inputNode == null) {
			throw new IllegalArgumentException(
				"Input node cannot be null in "
					+ "XmlUtils.isSameName method "
					+ "for input name:"
					+ inputName);
		}

		//Validate input node name
		if (inputNode.getNodeName() == null) {
			throw new IllegalArgumentException(
				"Input node does not have a name in "
					+ "XmlUtils.isSameName method "
					+ "for input name:"
					+ inputName);
		}
		System.out.println("Child node name is "+inputNode.getNodeName());

		return (inputNode.getNodeName().equals(inputName));
	}

	/**
	 * Constructs XML String from given document object.
	 * This method returns null if document is empty
	 *
	 * @param inputDocument
	 *            Input XML Document
	 * @return XML String. Returns null if input document
	 * 				does not have any root element
	 * @throws IllegalArgumentException
	 *             If input is invalid
	 * @throws Exception
	 *             incase of any other exceptions
	 */
	public static String getXmlString(Document inputDocument, String dtdString)
		throws IllegalArgumentException, Exception {
		//Root node
		Node rootNode = null;
		//Output format
		OutputFormat outputFormat = null;
		//String Writer
		StringWriter stringWriter = new StringWriter();
		//XML Serializer
		XMLSerializer xmlSerializer = null;

		//Validate input document
		if (inputDocument == null) {
			throw new IllegalArgumentException(
				"Input Document cannot be null in "
					+ "XmlUtils.getXMLString method");
		}
		//Get root element
		rootNode = inputDocument.getDocumentElement();

		//If root element does not exist returns null
		if (rootNode == null) {
			return null;
		}
		//Set the document to output format
		outputFormat = new OutputFormat(inputDocument);
		if (dtdString != null) {
			outputFormat.setDoctype(null, dtdString);
		}
		//Set output format and string writer to XML Serializer
		xmlSerializer = new XMLSerializer(stringWriter, outputFormat);
		xmlSerializer.asDOMSerializer();
		//Serialize document
		xmlSerializer.serialize(inputDocument.getDocumentElement());
		//Return output
		return stringWriter.toString();
	}

	/**
	 * Constructs XML String from given document object.
	 * This method returns null if document is empty
	 *
	 * @param inputDocument
	 *            Input XML Document
	 * @return XML String. Returns null if input document does not have any
	 *         root element
	 * @throws IllegalArgumentException
	 *             If input is invalid
	 * @throws Exception
	 *             incase of any other exceptions
	 */
	public static String getXmlString(Document inputDocument)
		throws IllegalArgumentException, Exception {
		return getXmlString(inputDocument, null);
	}

	/**
	 * Constructs XML String from given element object
	 *
	 * @param inputElement
	 *            Input element
	 * @return XML String
	 * @throws IllegalArgumentException
	 *             for Invalid input
	 * @throws Exception
	 *             incase of any other exception
	 */
	public static String getElementString(Element inputElement)
		throws IllegalArgumentException, Exception {
		//Validate input element
		if (inputElement == null) {
			throw new IllegalArgumentException(
				"Input element cannot be null in "
					+ "XmlUtils.getElementString method");
		}

		//Import element content and construct Document
		Document document = getDocument(inputElement, true);

		//Convert document as element string
		String xmlString = getXmlString(document);

		//Remove Processing Instruction from xml string if exists
		xmlString = removeProcessingInstruction(xmlString);

		//Return result XML string
		return xmlString;
	}

	/**
	 * Removes processing instruction from input XML String. Requirement is
	 * that input XML string should be a valid XML.
	 *
	 * @param xmlString
	 *            XML String thay may contain processing instruction
	 * @throws IllegalArgumentException
	 *             for Invalid input
	 * @return XML String
	 */
	public static String removeProcessingInstruction(String xmlString)
		throws IllegalArgumentException {
		//Validate input XML string
		if (xmlString == null) {
			throw new IllegalArgumentException(
				"Input XML string cannot be null in "
					+ "XmlUtils.removeProcessingInstruction method");
		}

		//Is input contains processing instruction
		if ((xmlString.toLowerCase().trim().startsWith("<?xml"))) {
			//Get the ending index of processing instruction
			int processInstructionEndIndex = xmlString.indexOf("?>");

			//If processing instruction ending found,
			if (processInstructionEndIndex != -1) {
				//Remove processing instruction
				xmlString = xmlString.substring(processInstructionEndIndex + 2);
			}
		}

		//Return XML string after update
		return xmlString;
	}

	/**
	 * Creates and empty Document object
	 *
	 * @throws Exception
	 *             incase of any exception
	 */
	public static Document getDocument() throws Exception {
		//Create a new Document Bilder Factory instance
		DocumentBuilderFactory documentBuilderFactory =
			new DocumentBuilderFactoryImpl();

		//Create new document builder
		DocumentBuilder documentBuilder =
			documentBuilderFactory.newDocumentBuilder();

		//Create and return document object
		return documentBuilder.newDocument();
	}

	/**
	 * Constructs Document object from XML String. This method uses DOMParser
	 * to generate a document from a string coded as a well-formed XML. This
	 * method should be sparingly used to build XMLs as all XMLs should be
	 * attempted to be built using Nodes and elements from scratch. The
	 * advantage of this is that all encoding of special characters is
	 * automatically taken care of, and is also the recommended way of building
	 * XML.
	 *
	 * @param inputXMLString
	 *            Input XML String
	 * @return XML Document object
	 * @throws IllegalArgumentException
	 *             if input is invalid
	 * @throws Exception
	 *             incase of any other exception
	 */
	public static Document getDocument(String inputXMLString)
		throws IllegalArgumentException, Exception {
		//Validate input XML string
		if (inputXMLString == null) {
			throw new IllegalArgumentException(
				"Input XML string"
					+ " cannot be null in XmlUtils.getDocument method");
		}

		//Create a new Document Bilder Factory instance
		DocumentBuilderFactory documentBuilderFactory =
			new DocumentBuilderFactoryImpl();

		//Create document builder
		DocumentBuilder documentBuilder =
			documentBuilderFactory.newDocumentBuilder();

		//Convert input XML as a document object
		Document resultDocument =
			documentBuilder.parse(
				new InputSource(
					new BufferedReader(
						new InputStreamReader(
							new ByteArrayInputStream(
								inputXMLString.getBytes())))));

		//Return result document
		return resultDocument;
	}

	/**
	 * Finds all elements with specified tag name and returns node list. Do not
	 * use this method if you have to access parent elements using the result
	 * node.
	 *
	 * @param inputElement
	 *            Input Element object
	 * @param inputElementName
	 *            Input Element name to search for
	 * @return NodeList List of nodes matching given name
	 * @throws IllegalArgumentException
	 *             if input is invalid
	 * @throws Exception
	 *             incase of any other exception
	 */
	public static NodeList getElementsByTagName(
		Element inputElement,
		String inputElementName)
		throws IllegalArgumentException, Exception {
		//Document
		Document document = null;

		//Validate child element name
		if (StringUtils.isNullOrEmpty(inputElementName)) {
			throw new IllegalArgumentException(
				"Input Element name cannot null or empty"
					+ " XmlUtils.getElementsByTagName method");
		}

		//Validate input element
		if (inputElement == null) {
			throw new IllegalArgumentException(
				"Input element cannot be null in "
					+ "XmlUtils.getElementsByTagName for "
					+ "input element name:"
					+ inputElementName);
		}

		//Create a document with input element as root element
		document = getDocument(inputElement, true);

		//Search all elements by input tag name
		return document.getElementsByTagName(inputElementName);
	}

	/**
	 * Create a new document object with input element as the root.
	 *
	 * @param inputElement
	 *            Input Element object
	 * @param deep
	 *            Include child nodes of this element true/false
	 * @return XML Document object
	 * @throws IllegalArgumentException
	 *             if input is invalid
	 * @throws Exception
	 *             incase of any other exception
	 */
	public static Document getDocument(Element inputElement, boolean deep)
		throws IllegalArgumentException, Exception {
		//Validate input element
		if (inputElement == null) {
			throw new IllegalArgumentException(
				"Input element cannot be null in "
					+ "XmlUtils.getDocument method");
		}

		//Create a new document
		Document outputDocument = getDocument();

		//Import data from input element and
		//set as root element for output document
		outputDocument.appendChild(
			outputDocument.importNode(inputElement, deep));

		//return output document
		return outputDocument;
	}

	/**
	 * Loads and constructs XML Document object from input file name
	 *
	 * @param inputFileName
	 *            XML Filename with path
	 * @return XML Document object
	 * @throws IllegalArgumentException
	 *             if input is invalid
	 * @throws Exception
	 *             incase of any other exception
	 */
	public static Document getXmlFromFile(String inputFileName)
		throws IllegalArgumentException, Exception {
		//Validate input file name
		if (StringUtils.isNullOrEmpty(inputFileName)) {
			throw new IllegalArgumentException(
				"Input Filename cannot be null or empty "
					+ " in XmlUtils.getXMLfromfile method");
		}

		//Create an instance of document builder factory
		DocumentBuilderFactory documentBuilderFactory =
			DocumentBuilderFactory.newInstance();

		//Create document builder
		DocumentBuilder documentBuilder =
			documentBuilderFactory.newDocumentBuilder();

		//load XML document from file
		Document resultDocument =
			documentBuilder.parse(new File(inputFileName));

		//return result document
		return resultDocument;
	}

	/**
	 * Writes content of XML Document to a file
	 *
	 * @param inputDocument
	 *            XML Document Object
	 * @param targetFileName
	 *            Target filename with path
	 * @throws IllegalArgumentException
	 *             if input is not valid
	 * @throws Exception
	 *             incase of any exception
	 */
	public static void writeXmlToFile(
		Document inputDocument,
		String targetFileName)
		throws IllegalArgumentException, Exception {
		//Validate target file name
		if (StringUtils.isNullOrEmpty(targetFileName)) {
			throw new IllegalArgumentException(
				"Target filename cannot be null or empty "
					+ "in XmlUtils.writeXMLtofile method");
		}

		//Validate input document
		if (inputDocument == null) {
			throw new IllegalArgumentException(
				"Input document cannot be null in "
					+ "XmlUtils.writeXMLtofile method where fileName:"
					+ targetFileName);
		}

		//Convert document as a string
		String xmlString = getXmlString(inputDocument);

		//Create output file
		DataOutputStream dataOutputStream =
			new DataOutputStream(new FileOutputStream(targetFileName));

		//Write XML string to file
		dataOutputStream.writeBytes(xmlString);

		//Close file
		dataOutputStream.close();
	}

	/** ***************************************************************** */
	/**
	 * Sets a new attribute to element
	 *
	 * @param element
	 *            Element Object
	 * @param attributeName
	 *            Attribute Name
	 * @param attributeValue
	 *            Attribute Value
	 * @return Element object after adding new attribute
	 * @throws IllegalArgumentException
	 *             for Invalid input
	 * @throws Exception
	 *             for all others
	 */
	public static Element setAttribute(
		Element element,
		String attributeName,
		String attributeValue)
		throws IllegalArgumentException, Exception {
		//Validate element
		if (element == null) {
			throw new IllegalArgumentException(
				"Element cannot " + " be null in XmlUtils.setAttribute method");
		}

		//Validate attribute name
		if (attributeName == null) {
			throw new IllegalArgumentException(
				"Attribute Name "
					+ " cannot be null in XmlUtils.setAttribute method");
		}

		element.setAttribute(attributeName, attributeValue);
		return element;
	}

	/**
	 * Gets value of an attribute from node
	 *
	 * @param node
	 *            Node Object
	 * @param attributeName
	 *            Attribute Name
	 * @return Attribute Value
	 * @throws IllegalArgumentException
	 *             for Invalid input
	 * @throws Exception
	 *             for all others
	 */
	public static String getAttribute(Node node, String attributeName)
		throws IllegalArgumentException, Exception {
		//Validate attribute name
		if (attributeName == null) {
			throw new IllegalArgumentException(
				"Attribute Name "
					+ " cannot be null in XmlUtils.getAttribute method");
		}

		//Validate node
		if (node == null) {
			throw new IllegalArgumentException(
				"Node cannot "
					+ " be null in XmlUtils.getAttribute method for"
					+ " attribute name:"
					+ attributeName);
		}

		NamedNodeMap attributeList = node.getAttributes();
		Node attribute = attributeList.getNamedItem(attributeName);

		//Validate attribute name
		if (attribute == null) {
			return "";
		}

		return ((Attr) attribute).getValue();
	}

	/**
	 * Gets value of an attribute from node. Returns default value if attribute
	 * not found.
	 *
	 * @param node
	 *            Node Object
	 * @param attributeName
	 *            Attribute Name
	 * @param defaultValue
	 *            Default value if attribute not found
	 * @return Attribute Value
	 * @throws IllegalArgumentException
	 *             for Invalid input
	 * @throws Exception
	 *             for all others
	 */
	public static String getAttribute(
		Node node,
		String attributeName,
		String defaultValue)
		throws IllegalArgumentException, Exception {
		//Validate attribute name
		if (attributeName == null) {
			throw new IllegalArgumentException(
				"Attribute Name "
					+ " cannot be null in XmlUtils.getAttribute method");
		}

		//Validate node
		if (node == null) {
			throw new IllegalArgumentException(
				"Node cannot "
					+ " be null in XmlUtils.getAttribute method for "
					+ "Attribute Name:"
					+ attributeName);
		}

		NamedNodeMap attributeList = node.getAttributes();
		Node attribute = attributeList.getNamedItem(attributeName);

		//Validate attribute name
		if (attribute == null) {
			return defaultValue;
		}

		return ((Attr) attribute).getValue();
	}


	/**
	 * Calls setAttribute for all enumerations in the map. This way multiple
	 * attributes can be set in one go.
	 *
	 * @param element
	 *            Element
	 * @param attribute
	 *            Map Set of attributes to be set
	 * @return Element object after attribute setting
	 * @throws IllegalArgumentException
	 *             for Invalid input
	 * @throws Exception
	 *             for all others
	 */
	public static Element setManyAttributes(Element element, Map attributeMap)
		throws IllegalArgumentException, Exception {
		//Validate element
		if (element == null) {
			throw new IllegalArgumentException(
				"Element cannot "
					+ " be null in XmlUtils.setManyAttributes method");
		}

		//Validate attribute map
		if (attributeMap == null) {
			throw new IllegalArgumentException(
				"Attribute map "
					+ "cannot be null in XmlUtils.setManyAttributes method");
		}

		Iterator iterator = attributeMap.keySet().iterator();
		String key = null;
		String value = null;
		while (iterator.hasNext()) {
			key = StringUtils.getStringValue(iterator.next());
			value = StringUtils.getStringValue(attributeMap.get(key));
			element = setAttribute(element, key, value);
		}
		return element;
	}

	/**
	 * Loads all attributes in given element to a Map
	 *
	 * @param element
	 *            Element
	 * @return Map object containing all attributes of given element
	 * @throws IllegalArgumentException
	 *             for Invalid input
	 * @throws Exception
	 *             for all others
	 */
	public static Map getManyAttributes(Element element)
		throws IllegalArgumentException, Exception {
		//Validate element
		if (element == null) {
			throw new IllegalArgumentException(
				"Element cannot "
					+ " be null in XmlUtils.getManyAttributes method");
		}

		NamedNodeMap attributeList = element.getAttributes();
		Map map = Collections.synchronizedMap(new HashMap());
		Node attributeNode = null;
		Attr attribute = null;
		for (int index = 0; index < attributeList.getLength(); index++) {
			attributeNode = attributeList.item(index);
			if (attributeNode == null) {
				continue;
			}
			attribute = (Attr) attributeNode;
			map.put(attribute.getName(), attribute.getValue());
		}
		return map;
	}

	/**
	 * Goes through the first child and its siblings, till the name of the node
	 * matches the name of the childName passed as input, when it returns the
	 * current node. When constructing an XML, you may like to check if the XML
	 * already has the child node you are trying to construct or if you would
	 * like to create the node and return it in the event that you do not have
	 * the node.( For example, lets say you have to add an element to the
	 * Orderlines node which is a child of the order node. You are currently at
	 * the order node. So when you ask for the child node - Orderlines from
	 * this function you ask him to create one in the event that it did not
	 * already have one)
	 *
	 * @param node
	 *            Node object
	 * @param childName
	 *            Name of child node looking for
	 * @param createNode
	 *            If true, appends a child node with given name when not found
	 * @return Node Child Node
	 * @throws IllegalArgumentException
	 *             for Invalid input
	 * @throws Exception
	 *             if node not found and createNode is false; and all others
	 */
	public static Node getChildNodeByName(
		Node node,
		String childName,
		boolean createNode)
		throws IllegalArgumentException, Exception {
		//Validate node
		if (node == null) {
			throw new IllegalArgumentException(
				"Node cannot "
					+ "be null in XmlUtils.getChildNodebyName method");
		}

		//Validate child name
		if (childName == null) {
			throw new IllegalArgumentException(
				"Child name cannot"
					+ " be null in XmlUtils.getChildNodebyName method");
		}

		NodeList childList = node.getChildNodes();
		System.out.println("child names is "+childList.getLength());

		if (childList != null) {
			for (int childIndex = 0;
				childIndex < childList.getLength();
				childIndex++) {
				System.out.println("");
				if (isSameName(childList.item(childIndex), childName)) {
					return childList.item(childIndex);
				}
			}
		}

		if (createNode) {
			Node newNode = node.getOwnerDocument().createElement(childName);
			node.appendChild(newNode);
			return newNode;
		}
		throw new Exception(
			"Node "
				+ childName
				+ " not found in "
				+ "XmlUtils.getChildNodebyName method");
	}

	/**
	 * Goes through each sibling of node, till the name of the node matches the
	 * siblingName passed as input,
	 *
	 * @param node
	 *            Node object
	 * @param siblingName
	 *            Name of sibling node looking for
	 * @param createNode
	 *            If true, adds a sibling with given sibling name when not
	 *            found
	 * @return Node Sibling Node
	 * @throws IllegalArgumentException
	 *             for Invalid input
	 * @throws Exception
	 *             if node not found and createNode is false; and all others
	 */
	public static Node getNextSiblingByName(
		Node node,
		String siblingName,
		boolean createNode)
		throws IllegalArgumentException, Exception {
		//Validate node
		if (node == null)
			throw new IllegalArgumentException(
				"Node cannot be "
					+ " null in XmlUtils.getChildNodebyName method");

		//Validate sibling name
		if (siblingName == null)
			throw new IllegalArgumentException(
				"Sibling name cannot"
					+ " be null in XmlUtils.getChildNodebyName method");

		Node siblingNode = node.getNextSibling();
		if (siblingNode == null) {
			if (createNode) {
				Node newNode =
					node.getOwnerDocument().createElement(siblingName);
				node.getParentNode().appendChild(newNode);
				return newNode;
			} else {
				throw new Exception(
					"Node "
						+ siblingName
						+ "not  "
						+ "found in XmlUtils.getNextSiblingbyName method");
			}
		}
		if (isSameName(siblingNode, siblingName))
			return siblingNode;
		return getNextSiblingByName(siblingNode, siblingName, createNode);
	}

	/**
	 * Determines if a child exists with given name
	 *
	 * @throws IllegalArgumentException
	 *             if input is invalid
	 * @throws Exception
	 *             for all errors
	 */
	public static boolean hasChildNode(Node node, String inputChildNodeName)
		throws IllegalArgumentException, Exception {
		//Validate node
		if (node == null) {
			throw new IllegalArgumentException(
				"Node cannot be " + " null in XmlUtils.hasChildNode method");
		}

		//Validate Child node name
		if (inputChildNodeName == null) {
			throw new IllegalArgumentException(
				"Input Child Node "
					+ " name cannot be null in XmlUtils.hasChildNode method");
		}

		NodeList nodeList = node.getChildNodes();
		if ((nodeList == null) || (nodeList.getLength() < 1)) {
			return false;
		}

		//Compare each child name and return true if match found
		Node childNode = null;
		String childNodeName = null;
		for (int index = 0; index < nodeList.getLength(); index++) {
			childNode = nodeList.item(index);
			childNodeName = childNode.getNodeName();
			if (StringUtils.isSame(childNodeName, inputChildNodeName)) {
				return true;
			}
		}
		//If no children found with given name then return false
		return false;
	}

	/**
	 * This method converts input stream as an XML document
	 *
	 * @param inputStream
	 *            Input Stream
	 * @return Content of input stream as an XML Document object
	 * @throws IllegalArgumentException
	 *             if input is not valid
	 * @throws Exception
	 *             incase of any exceptions
	 */
	public static Document getDocument(InputStream inputStream)
		throws IllegalArgumentException, Exception {
		//Validate input stream
		if (inputStream == null) {
			throw new IllegalArgumentException(
				"Input Stream cannot be null in " + "XmlUtils.getDocument");
		}

		//Create a new Document Bilder Factory instance
		DocumentBuilderFactory factory = new DocumentBuilderFactoryImpl();

		//Create document builder
		DocumentBuilder builder = factory.newDocumentBuilder();

		//Parse input stream as document
		Document document = builder.parse(inputStream);

		//return output document
		return document;
	}

	/**
	 * This method returns node value for given child. If there is no text
	 * available for given node, then this method returns null
	 *
	 * @return Node value of input node
	 * @throws IllegalArgumentException
	 *             if input is invalid
	 * @throws Exception
	 *             incase of any other exceptions
	 */
	public static String getNodeValue(Node inputNode)
		throws IllegalArgumentException, Exception {
		//Child count
		int childCount = 0;

		//Validate input stream
		if (inputNode == null) {
			throw new IllegalArgumentException(
				"Input Node cannot be null in " + "XmlUtils.getNodeValue");
		}

		//Return null if child not found
		NodeList childList = inputNode.getChildNodes();
		if ((childList == null) || (childList.getLength() < 1)) {
			return null;
		}

		//Get child count
		childCount = childList.getLength();

		//For each child
		Node childNode = null;
		for (int childIndex = 0; childIndex < childCount; childIndex++) {
			//Get each child
			childNode = childList.item(childIndex);
			//Check if text node
			if (childNode.getNodeType() == Node.TEXT_NODE) {
				//Return node value
				return childNode.getNodeValue();
			}
		}
		//If no text node found return null
		return null;
	}
	
	public static String getNodeCDataValue(Node inputNode)
			throws IllegalArgumentException, Exception {
			//Child count
			int childCount = 0;

			//Validate input stream
			if (inputNode == null) {
				throw new IllegalArgumentException(
					"Input Node cannot be null in " + "XmlUtils.getNodeCDataValue");
			}

			//Return null if child not found
			NodeList childList = inputNode.getChildNodes();
			if ((childList == null) || (childList.getLength() < 1)) {
				return null;
			}

			//Get child count
			childCount = childList.getLength();

			//For each child
			Node childNode = null;
			for (int childIndex = 0; childIndex < childCount; childIndex++) {
				//Get each child
				childNode = childList.item(childIndex);
				//Check if text node
				if (childNode.getNodeType() == Node.CDATA_SECTION_NODE) {
					//Return node value
					return childNode.getNodeValue();
				}
			}
			//If no text node found return null
			return null;
		}	

	/**
	 * This method sets value to given node
	 *
	 * @param inputNode
	 *            Node to which value needs to be set
	 * @param nodeValue
	 *            Value to set
	 * @throws IllegalArgumentException
	 *             if input is invalid
	 * @throws Exception
	 *             incase of any other exceptions
	 */
	public static void setNodeValue(Node inputNode, String nodeValue)
		throws IllegalArgumentException, Exception {
		//Child list
		NodeList childList = null;

		//Validate input stream
		if (inputNode == null) {
			throw new IllegalArgumentException(
				"Input Node cannot be null in " + "XmlUtils.setNodeValue");
		}

		//Get child list
		childList = inputNode.getChildNodes();

		//If child nodes found
		if ((childList != null) && (childList.getLength() > 0)) {
			//Get child count
			int childCount = childList.getLength();

			//For each child
			for (int childIndex = 0; childIndex < childCount; childIndex++) {
				//Check if text node
				if (childList.item(childIndex).getNodeType()
					== Node.TEXT_NODE) {
					//Set value to text node
					childList.item(childIndex).setNodeValue(nodeValue);
					return;
				}
			}
		}

		//Create text node and set node value
		inputNode.appendChild(
			inputNode.getOwnerDocument().createTextNode(nodeValue));
	}

	/**
	 * This method imports specified child node for target document and returns
	 * reference to Node
	 *
	 * @param targetDocument
	 *            Target document for which the child node needs to be imported
	 * @param inputNode
	 *            Source Node whose child node needs to be imported
	 * @param childNodeName
	 *            Name of child
	 * @param deep
	 *            Include nodes while importing true/false
	 * @return Reference to imported child node
	 * @throws Exception
	 *             incase of any exception
	 */
	public static Node importChildNode(
		Document targetDocument,
		Node inputNode,
		String childNodeName,
		boolean deep)
		throws IllegalArgumentException, Exception {
		//Validate target document
		if (targetDocument == null) {
			throw new IllegalArgumentException(
				"Target document cannot be null"
					+ " in XmlUtils.importChildNode method");
		}

		//Validate input node
		if (inputNode == null) {
			throw new IllegalArgumentException(
				"Input node cannot be null"
					+ " in XmlUtils.importChildNode method");
		}

		//Validate child name
		if (StringUtils.isNullOrEmpty(childNodeName)) {
			throw new IllegalArgumentException(
				"Child node namecannot be null"
					+ " in XmlUtils.importChildNode method");
		}

		//Get child node
		Node childNode =
			XmlUtils.getChildNodeByName(inputNode, childNodeName, false);

		//Import child
		Node resultNode = targetDocument.importNode(childNode, deep);

		//Return reference to imported child
		return resultNode;
	}

	/**
	 * Creates a copy of element with attributes(not deep) with given name
	 *
	 * @param elementName
	 *            Element Name
	 * @param newElementName
	 *            New name for element
	 * @throws Exception
	 *             incase of any exception
	 */
	public static Element prepareElement(
		Element elementName,
		String newElementName)
		throws IllegalArgumentException, Exception {
		//Validate element name
		if (elementName == null) {
			throw new IllegalArgumentException(
				"Input node cannot be null"
					+ " in XmlUtils.prepareElement method");
		}

		//Create an element with given name
		Element resultElement =
			elementName.getOwnerDocument().createElement(newElementName);

		//Import all attributes to new element
		XmlUtils.setManyAttributes(
			resultElement,
			XmlUtils.getManyAttributes(elementName));

		//Return result element
		return resultElement;
	}

	/**
	* This method is used to get the value of the tag.
	* By passing the xmlString and XML Tag name we can get
	* the tag value.
	* @param  inputValue XML String
	* @return XML Document object
	* @throws IllegalArgumentException for Invalid input
	* @throws Exception for all others
	*/
	public static String getXMLValue(String inXmlString, String inXmlTag)
		throws IllegalArgumentException, Exception {
		if (inXmlString == null || inXmlTag == null) {
			throw new IllegalArgumentException(
				"Input string" + " cannot be null in getXMLValue method");
		}

		String XmlValue = new String();
		String tagStart = "<" + inXmlTag + ">";
		String tagEnd = "</" + inXmlTag + ">";
		int liStartPlace = 0;
		int liEndPlace = 0;
		try {
			liStartPlace = inXmlString.indexOf(tagStart);

			if (liStartPlace == -1) {
				return null;
			}
			liEndPlace = inXmlString.indexOf(tagEnd);
			if (liEndPlace == -1) {
				return null;
			}
			liStartPlace += tagStart.length();
			XmlValue = inXmlString.substring(liStartPlace, liEndPlace);
		} catch (Exception e) {
			return null;
		}
		return XmlValue;
	}

	/**
	 * Renames the attribute with the new name
	 *
	 * @param elementObject
	 *            the element object
	 * @param oldName
	 *            Old name of the attribute
	 * @param newName
	 *            New name of the attribute
	 * @throws Exception
	 *             incase of any exception
	 */
	public static void renameAttribute(
		Element elementObject,
		String oldName,
		String newName)
		throws IllegalArgumentException, Exception {
		//Validate element Object
		if (elementObject == null) {
			throw new IllegalArgumentException(
				"Element object cannot be null"
					+ " in XmlUtils.renameAttribute method");
		}

		//Validate old name
		if (oldName == null) {
			throw new IllegalArgumentException(
				"Old name cannot be null"
					+ " in XmlUtils.renameAttribute method");
		}

		//Validate new name
		if (newName == null) {
			throw new IllegalArgumentException(
				"New name cannot be null"
					+ " in XmlUtils.renameAttribute method");
		}

		//the attribute value
		String attributeValue = null;

		//get the value of the attribute
		attributeValue = XmlUtils.getAttribute(elementObject, oldName, null);

		//remove the old attribute
		elementObject.removeAttribute(oldName);

		//if the attribute value is not null then set the attribute
		if (attributeValue != null) {
			XmlUtils.setAttribute(elementObject, newName, attributeValue);
		}
	}

	/**
	 * This method iterates through all the ChildNodes of a ParentNode and returns
	 * the ChildNode if present. Returns null when the child node is not
	 * present
	 *
	 * @param parentNode
	 * @param childNodeName
	 * @return
	 */
	public static Node getChildNode(Node parentNode, String childNodeName)
	{
		//if parent is null
		if(parentNode==null)
		{
			return null;
		}

		//Node for the CurrentChildNode
		Node currentChildNode = null;

		//Get the list of ChildNodes for the Parent Node
		NodeList childNodeList = parentNode.getChildNodes();

		//Fetch the length of the NodeList
		int childNodeListLength = childNodeList.getLength();

		//Iterate through all the ChildNodes.If the ChildNode is present
		//then retrun it,else return null
		for (int count = 0; count < childNodeListLength; count++) {

			currentChildNode = childNodeList.item(count);

			if (currentChildNode.getNodeName().equals(childNodeName)) {
				return currentChildNode;
			}
		}

		return null;
	}
}
