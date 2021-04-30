package com.sensor.details.pojo;

public class CapbalitiesStationInfo {

	private String sensorId;
	private String latitude;
	private String longitude;
	
	public CapbalitiesStationInfo() {
		super();
	}

	public CapbalitiesStationInfo(String sensorId, String latitude, String longitude) {
		super();
		this.sensorId = sensorId;
		this.latitude = latitude;
		this.longitude = longitude;
	}

	public String getSensorId() {
		return sensorId;
	}

	public void setSensorId(String sensorId) {
		this.sensorId = sensorId;
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
}
