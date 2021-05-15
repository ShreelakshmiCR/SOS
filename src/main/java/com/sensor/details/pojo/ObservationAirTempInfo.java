package com.sensor.details.pojo;

public class ObservationAirTempInfo {

	private String propertyName;
	private String description;
	private String boundedBy;
	private String latitude;
	public String getLatitudeUnit() {
		return latitudeUnit;
	}

	public void setLatitudeUnit(String latitudeUnit) {
		this.latitudeUnit = latitudeUnit;
	}

	public String getLongitudeUnit() {
		return longitudeUnit;
	}

	public void setLongitudeUnit(String longitudeUnit) {
		this.longitudeUnit = longitudeUnit;
	}

	private String latitudeUnit;
	private String longitude;
	private String longitudeUnit;
	private String stationId;
	private String time;
	private String altitude;
	private String altitudeUnit;
	private String temperature;
	private String temperatureUnit;
	private String errorCode;
	private String errorMessage;

	public ObservationAirTempInfo() {
		super();
	}

	public ObservationAirTempInfo(String description, String boundedBy, String latitude, String longitude,
			String stationId, String time, String altitude, String altitudeUnit, String temperature,
			String temperatureUnit) {
		super();
		this.description = description;
		this.boundedBy = boundedBy;
		this.latitude = latitude;
		this.longitude = longitude;
		this.stationId = stationId;
		this.time = time;
		this.altitude = altitude;
		this.altitudeUnit = altitudeUnit;
		this.temperature = temperature;
		this.temperatureUnit = temperatureUnit;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getBoundedBy() {
		return boundedBy;
	}

	public void setBoundedBy(String boundedBy) {
		this.boundedBy = boundedBy;
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

	public String getStationId() {
		return stationId;
	}

	public void setStationId(String stationId) {
		this.stationId = stationId;
	}

	public String getTime() {
		return time;
	}

	public void setTime(String time) {
		this.time = time;
	}

	public String getAltitude() {
		return altitude;
	}

	public void setAltitude(String altitude) {
		this.altitude = altitude;
	}

	public String getAltitudeUnit() {
		return altitudeUnit;
	}

	public void setAltitudeUnit(String altitudeUnit) {
		this.altitudeUnit = altitudeUnit;
	}

	public String getTemperature() {
		return temperature;
	}

	public void setTemperature(String temperature) {
		this.temperature = temperature;
	}

	public String getTemperatureUnit() {
		return temperatureUnit;
	}

	public void setTemperatureUnit(String temperatureUnit) {
		this.temperatureUnit = temperatureUnit;
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

	/**
	 * @return String return the propertyName
	 */
	public String getPropertyName() {
		return propertyName;
	}

	/**
	 * @param propertyName the propertyName to set
	 */
	public void setPropertyName(String propertyName) {
		this.propertyName = propertyName;
	}

	@Override
	public String toString() {
		return "ObservationAirTempInfo [description=" + description + ", boundedBy=" + boundedBy + ", latitude="
				+ latitude + ", longitude=" + longitude + ", stationId=" + stationId + ", time=" + time + ", altitude="
				+ altitude + ", altitudeUnit=" + altitudeUnit + ", temperature=" + temperature + ", temperatureUnit="
				+ temperatureUnit + ", errorCode=" + errorCode + ", errorMessage=" + errorMessage + "]";
	}

}
