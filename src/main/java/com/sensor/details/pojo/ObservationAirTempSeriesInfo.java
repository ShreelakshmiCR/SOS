package com.sensor.details.pojo;

import java.util.List;

public class ObservationAirTempSeriesInfo {

	private String description;
	private String latitude;
	private String longitude;
	private String stationId;
	private String beginTime;
	private String endTime;
	private String altitude;
	private String altitudeUnit;
	private String temperatureUnit;
	private List<AirTempSeriesInfo> airTempSeries;
	private String errorCode;
	private String errorMessage;
	
	public ObservationAirTempSeriesInfo() {
		super();
	}

	public ObservationAirTempSeriesInfo(String description, String latitude, String longitude, String stationId,
			String beginTime, String endTime, String altitude, String altitudeUnit, String temperatureUnit,
			List<AirTempSeriesInfo> airTempSeries, String errorCode, String errorMessage) {
		super();
		this.description = description;
		this.latitude = latitude;
		this.longitude = longitude;
		this.stationId = stationId;
		this.beginTime = beginTime;
		this.endTime = endTime;
		this.altitude = altitude;
		this.altitudeUnit = altitudeUnit;
		this.temperatureUnit = temperatureUnit;
		this.airTempSeries = airTempSeries;
		this.errorCode = errorCode;
		this.errorMessage = errorMessage;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
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

	public String getBeginTime() {
		return beginTime;
	}

	public void setBeginTime(String beginTime) {
		this.beginTime = beginTime;
	}

	public String getEndTime() {
		return endTime;
	}

	public void setEndTime(String endTime) {
		this.endTime = endTime;
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

	public String getTemperatureUnit() {
		return temperatureUnit;
	}

	public void setTemperatureUnit(String temperatureUnit) {
		this.temperatureUnit = temperatureUnit;
	}

	public List<AirTempSeriesInfo> getAirTempSeries() {
		return airTempSeries;
	}

	public void setAirTempSeries(List<AirTempSeriesInfo> airTempSeries) {
		this.airTempSeries = airTempSeries;
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
		return "ObservationAirTempSeriesInfo [description=" + description + ", latitude=" + latitude + ", longitude="
				+ longitude + ", stationId=" + stationId + ", beginTime=" + beginTime + ", endTime=" + endTime
				+ ", altitude=" + altitude + ", altitudeUnit=" + altitudeUnit + ", temperatureUnit=" + temperatureUnit
				+ ", airTempSeries=" + airTempSeries + ", errorCode=" + errorCode + ", errorMessage=" + errorMessage
				+ "]";
	}
}
