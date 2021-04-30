package com.sensor.details.controller;

import java.util.UUID;

import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import com.sensor.details.service.NdbcService;

@RestController
public class NdbcController {

	@Autowired
	NdbcService ndbcService;
	
	
	
	@GetMapping("/ndbc/allstations")
	public JSONObject getCapabilities() {
		
		JSONObject allStations = new JSONObject();
		allStations.put("requestId", UUID.randomUUID().toString());
		try
		{
			allStations.put("code", "000");
			allStations.put("message", "Success");
			allStations.put("capabilities", ndbcService.getAllStations());
		}
		catch(Exception e)
		{
			e.printStackTrace();
			allStations.put("code", "999");
			allStations.put("status", false);
			allStations.put("message", "Request Failed");
		}
		
		return allStations;
	}
	
	@GetMapping("/ndbc/describesensor/{id}")
	public JSONObject describeSensor(@PathVariable String id) {
		
		System.out.println("ID:"+id);
		JSONObject sensorInfo = new JSONObject();
		sensorInfo.put("requestId", UUID.randomUUID().toString());
		try
		{
			sensorInfo.put("code", "000");
			sensorInfo.put("message", "Success");
			sensorInfo.put("sensorInfo", ndbcService.descirbeSensor(id));
		}
		catch(Exception e)
		{
			e.printStackTrace();
			sensorInfo.put("code", "999");
			sensorInfo.put("status", false);
			sensorInfo.put("message", "Request Failed");
		}
		
		return sensorInfo;
	}
	
	@GetMapping("/ndbc/observation/airtemp/{stationId}")
	public JSONObject getObservationAirTemp(@PathVariable String stationId)
	{
		System.out.println("ID:"+stationId);
		JSONObject sensorInfo = new JSONObject();
		sensorInfo.put("requestId", UUID.randomUUID().toString());
		try
		{
			sensorInfo.put("code", "000");
			sensorInfo.put("message", "Success");
			sensorInfo.put("sensorInfo", ndbcService.getObservationAirTemp(stationId));
		}
		catch(Exception e)
		{
			e.printStackTrace();
			sensorInfo.put("code", "999");
			sensorInfo.put("status", false);
			sensorInfo.put("message", "Request Failed");
		}
		return sensorInfo;
	
	}
}
