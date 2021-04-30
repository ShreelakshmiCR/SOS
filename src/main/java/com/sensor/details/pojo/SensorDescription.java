package com.sensor.details.pojo;

public class SensorDescription {

	private String name;
	private String description;
	private String propertyName;
	private String classifierPlatform;
	private String classifierPublisher;
	private String organizationName;
	private String country;
	private String address;
	private String latitude;
	private String longitude;
	private String errorCode;
	private String errorMessage;
	
	public SensorDescription() {
		super();
		// TODO Auto-generated constructor stub
	}

	public SensorDescription(String name, String description, String propertyName, String classifierPlatform,
			String classifierPublisher, String organizationName, String country, String address, String latitude,
			String longitude, String errorCode, String errorMessage) {
		super();
		this.name = name;
		this.description = description;
		this.propertyName = propertyName;
		this.classifierPlatform = classifierPlatform;
		this.classifierPublisher = classifierPublisher;
		this.organizationName = organizationName;
		this.country = country;
		this.address = address;
		this.latitude = latitude;
		this.longitude = longitude;
		this.errorCode = errorCode;
		this.errorMessage = errorMessage;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getPropertyName() {
		return propertyName;
	}

	public void setPropertyName(String propertyName) {
		this.propertyName = propertyName;
	}

	public String getClassifierPlatform() {
		return classifierPlatform;
	}

	public void setClassifierPlatform(String classifierPlatform) {
		this.classifierPlatform = classifierPlatform;
	}

	public String getClassifierPublisher() {
		return classifierPublisher;
	}

	public void setClassifierPublisher(String classifierPublisher) {
		this.classifierPublisher = classifierPublisher;
	}

	public String getOrganizationName() {
		return organizationName;
	}

	public void setOrganizationName(String organizationName) {
		this.organizationName = organizationName;
	}

	public String getCountry() {
		return country;
	}

	public void setCountry(String country) {
		this.country = country;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
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

	public String getErrorCode() {
		return errorCode;
	}

	public void setErrorCode(String errorCode) {
		this.errorCode = errorCode;
	}

	public String getErrorMessage() {
		return errorMessage;
	}

	public void setErrorMessage(String errorMessage) {
		this.errorMessage = errorMessage;
	}

	@Override
	public String toString() {
		return "SensorDescription [name=" + name + ", description=" + description + ", propertyName=" + propertyName
				+ ", classifierPlatform=" + classifierPlatform + ", classifierPublisher=" + classifierPublisher
				+ ", organizationName=" + organizationName + ", country=" + country + ", address=" + address
				+ ", latitude=" + latitude + ", longitude=" + longitude + ", errorCode=" + errorCode + ", errorMessage="
				+ errorMessage + "]";
	}
	
	
	
	
	
}