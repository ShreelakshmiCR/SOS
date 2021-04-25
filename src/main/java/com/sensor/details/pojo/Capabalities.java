package com.sensor.details.pojo;

import java.util.List;

public class Capabalities {

	private String providerName;
	private String providerSite;
	private String phone;
	private String address;
	private List<String> sensorIds;
	private List<ObservationOfferings> observationOfferings;
	private String responseXML;
	
	public Capabalities() {
		super();
	}

	public Capabalities(String providerName, String providerSite, String phone, String address, List<String> sensorIds,
			List<ObservationOfferings> observationOfferings, String responseXML) {
		super();
		this.providerName = providerName;
		this.providerSite = providerSite;
		this.phone = phone;
		this.address = address;
		this.sensorIds = sensorIds;
		this.observationOfferings = observationOfferings;
		this.responseXML = responseXML;
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

	public String getResponseXML() {
		return responseXML;
	}

	public void setResponseXML(String responseXML) {
		this.responseXML = responseXML;
	}
	
}
