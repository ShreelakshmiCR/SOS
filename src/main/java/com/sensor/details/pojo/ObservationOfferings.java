package com.sensor.details.pojo;

import java.util.List;

public class ObservationOfferings
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
