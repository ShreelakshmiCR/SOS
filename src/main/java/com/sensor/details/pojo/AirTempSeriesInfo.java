package com.sensor.details.pojo;

public class AirTempSeriesInfo {

	private String time;
	private String temp;
	
	public AirTempSeriesInfo() {
		super();
	}

	public AirTempSeriesInfo(String time, String temp) {
		super();
		this.time = time;
		this.temp = temp;
	}

	public String getTime() {
		return time;
	}

	public void setTime(String time) {
		this.time = time;
	}

	public String getTemp() {
		return temp;
	}

	public void setTemp(String temp) {
		this.temp = temp;
	}

	@Override
	public String toString() {
		return "AirTempSeriesInfo [time=" + time + ", temp=" + temp + "]";
	}
	
}
