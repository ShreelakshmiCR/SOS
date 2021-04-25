package com.sensor.details.utils;


import java.io.BufferedReader;
import java.io.DataInputStream;
import java.io.DataOutputStream;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintStream;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.io.Writer;
import java.net.URL;
import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Random;
import java.util.Set;
import java.util.StringTokenizer;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;

public class StringUtils {
	public static String getStringValue(boolean flag) {
		if (flag) {
			return "Y";
		}
		return "N";
	}

	public static boolean stringEquals(String oldS, String newS) {
		oldS = noNull(oldS);
		newS = noNull(newS);
		return oldS.equals(newS);
	}

	public static boolean stringEqualsIC(String oldS, String newS) {
		oldS = noNull(oldS);
		newS = noNull(newS);
		return oldS.equalsIgnoreCase(newS);
	}

	public static boolean isNonNullStringInRange(String value, int min, int max) throws Exception {
		if (isNullOrEmpty(value)) {
			return false;
		}
		if (value.length() < min) {
			return false;
		}
		if (value.length() > max) {
			return false;
		}
		return true;
	}

	public static boolean hasDigits(String message) {
		message = noNull(message);
		boolean hasDigitInOutput = false;
		char[] messageChars = message.toCharArray();
		for (int index = 0; index < messageChars.length; index++) {
			if (Character.isDigit(messageChars[index])) {
				return true;
			}
		}
		return false;
	}

	public static boolean isAlphanumeric(String str) {
		for (int i = 0; i < str.length(); i++) {
			char c = str.charAt(i);
			if ((c < '0') || ((c >= ':') && (c <= '@')) || ((c > 'Z') && (c <= '`')) || (c > 'z')) {
				return false;
			}
		}
		return true;
	}

	public static boolean getBooleanValue(String inputValue, boolean nullOK) throws Exception {
		if (isNullOrEmpty(inputValue)) {
			if (!nullOK) {
				throw new Exception("Input value cannot be empty in StringUtils.getBooleanValue");
			}
			return false;
		}
		inputValue = inputValue.toUpperCase();
		if (isSame(inputValue, "Y")) {
			return true;
		}
		if (isSame(inputValue, "N")) {
			return false;
		}
		throw new Exception("Invalid input value:" + inputValue + "in StringUtils.getBooleanValue");
	}

	public static boolean isSame(String firstValue, String secondValue) {
		if (firstValue == null) {
			firstValue = "";
		}
		if (secondValue == null) {
			secondValue = "";
		}
		return firstValue.equals(secondValue);
	}

	public static String getStringValue(Object object, String defaultValue) {
		if (object == null) {
			return defaultValue;
		}
		return object.toString();
	}

	public static int getIntegerValue(Object object, int defaultValue) {
		String stringValue = getStringValue(object, "");
		try {
			return Integer.parseInt(stringValue);
		} catch (Exception exception) {
		}
		return defaultValue;
	}

	public static String appendSpaces(String inputValue, int maxLength) throws IllegalArgumentException {
		int spacesToAdd = 0;
		if (inputValue == null) {
			throw new IllegalArgumentException("Input value cannot be null in StringUtils.appendSpace method");
		}
		if (maxLength < 0) {
			throw new IllegalArgumentException("Invalid maximum length be null in StringUtils.appendSpace method");
		}
		spacesToAdd = maxLength - inputValue.length();
		if (spacesToAdd <= 0) {
			return inputValue;
		}
		for (int spaceIndex = 0; spaceIndex < spacesToAdd; spaceIndex++) {
			inputValue = inputValue + " ";
		}
		return inputValue;
	}

	public static boolean isNullOrEmpty(String inputValue) {
		if (inputValue == null) {
			return true;
		}
		if (inputValue.trim().length() < 1) {
			return true;
		}
		return false;
	}

	public static String getStringValue(Object inputObject) {
		if (inputObject == null) {
			return null;
		}
		return (String) inputObject;
	}

	public static String getToken(String inputValue, String delimiter, int tokenNumber)
			throws IllegalArgumentException, Exception {
		String resultValue = null;
		if (inputValue == null) {
			throw new IllegalArgumentException("Input value cannotbe null in StringUtils.getToken method");
		}
		if (delimiter == null) {
			throw new IllegalArgumentException("Delimiter cannot be null in StringUtils.getToken method");
		}
		if (tokenNumber < 0) {
			throw new IllegalArgumentException("Invalid token number in StringUtils.getToken method");
		}
		StringTokenizer st = new StringTokenizer(inputValue, delimiter);
		for (int tokenIndex = 0; tokenIndex < tokenNumber; tokenIndex++) {
			st.nextToken();
		}
		if (st.hasMoreTokens()) {
			resultValue = st.nextToken();
		}
		return resultValue;
	}

	public static String convertFirstCharacterToUpperCase(String inputValue) {
		char[] inputValueCharArray = inputValue.toCharArray();

		inputValueCharArray[0] = Character.toUpperCase(inputValueCharArray[0]);

		return String.copyValueOf(inputValueCharArray);
	}

	public static String[] parseString(String inputValue, String delimiter) throws IllegalArgumentException, Exception {
		if (inputValue == null) {
			throw new IllegalArgumentException("Input value cannotbe null in StringUtils.parseString method");
		}
		if (delimiter == null) {
			throw new IllegalArgumentException("Delimiter cannotbe null in StringUtils.parseString method");
		}
		if (delimiter.length() < 1) {
			throw new IllegalArgumentException("Invalid Delimiter  in StringUtils.parseString method");
		}
		StringTokenizer tokenizer = new StringTokenizer(inputValue, delimiter);

		String[] result = new String[tokenizer.countTokens()];

		int tokenIndex = 0;
		while (tokenizer.hasMoreTokens()) {
			result[tokenIndex] = tokenizer.nextToken();
			tokenIndex++;
		}
		return result;
	}

	public static Map getMap(String inputValue) throws IllegalArgumentException, Exception {
		if (inputValue == null) {
			throw new IllegalArgumentException("Input value cannotbe null in StringUtils.getMap method");
		}
		if (inputValue.indexOf("&") <= -1) {
			throw new IllegalArgumentException("Invalid Input value in StringUtils.getMap method");
		}
		if (inputValue.indexOf("=") <= -1) {
			throw new IllegalArgumentException("Invalid Input value in StringUtils.getMap method");
		}
		Map map = Collections.synchronizedMap(new HashMap());
		StringTokenizer st = new StringTokenizer(inputValue, "&");
		while (st.hasMoreTokens()) {
			String nameValuePair = st.nextToken();
			map.put(getToken(nameValuePair, "=", 0), getToken(nameValuePair, "=", 1));
		}
		return map;
	}

	public static String getMapContent(Map map) throws IllegalArgumentException, Exception {
		if (map == null) {
			throw new IllegalArgumentException("Input value cannot be null in StringUtils.getMap method");
		}
		String result = "";
		Object[] keyList = map.keySet().toArray();
		for (int index = 0; index < keyList.length; index++) {
			String name = getStringValue(keyList[index]);
			String value = getStringValue(map.get(keyList[index]));
			if (result.length() > 1) {
				result = result + "&";
			}
			result = result + name + "=" + value;
		}
		return result;
	}

	public static String toInitCap(String value) {
		char[] cArray = value.toCharArray();
		cArray[0] = ("" + cArray[0]).toUpperCase().charAt(0);
		return new String(cArray);
	}

	public static String loadFileToString(String FileName) throws IOException {
		StringBuffer sb = new StringBuffer("");

		FileInputStream fis = new FileInputStream(FileName);
		BufferedReader br = new BufferedReader(new InputStreamReader(fis));
		for (;;) {
			String line = br.readLine();
			if (line == null) {
				break;
			}
			sb.append(line + "\n");
		}
		br.close();
		fis.close();
		return sb.toString();
	}

	public static ArrayList loadFileAsArrayList(String FileName) throws IOException {
		ArrayList arrayList = new ArrayList();
		FileInputStream fis = new FileInputStream(FileName);
		BufferedReader br = new BufferedReader(new InputStreamReader(fis));
		for (;;) {
			String line = br.readLine();
			if (line == null) {
				break;
			}
			arrayList.add(line);
		}
		br.close();
		fis.close();
		return arrayList;
	}

	public static void writeStringToFile(String Data, String FileName) throws IOException {
		FileOutputStream fos = new FileOutputStream(FileName);
		DataOutputStream dos = new DataOutputStream(fos);
		dos.writeBytes(Data);
		dos.close();
		fos.close();
	}

	public static void appendStringToFile(String Data, String FileName) throws IOException {
		FileOutputStream fos = new FileOutputStream(FileName, true);
		DataOutputStream dos = new DataOutputStream(fos);
		dos.writeBytes(Data);
		dos.close();
		fos.close();
	}

	public static String replaceString(String Source, String Old, String New, boolean repeat) {
		if (Source == null) {
			return "";
		}
		if (Old == null) {
			return Source;
		}
		if (New == null) {
			return Source;
		}
		if (Old.equals(New)) {
			return Source;
		}
		int index = Source.indexOf(Old);
		if (index < 0) {
			return Source;
		}
		String firstPart = Source.substring(0, index);
		String finalPart = Source.substring(index + Old.length());
		if (repeat) {
			if ((finalPart != null) && (finalPart.length() > 0)) {
				return firstPart + New + replaceString(finalPart, Old, New, repeat);
			}
		}
		return firstPart + New + finalPart;
	}

	public static String stripEnd(String value, String stripValue) {
		if (value.endsWith(stripValue)) {
			return value.substring(0, value.lastIndexOf(stripValue) + 1);
		}
		return value;
	}

	public static String noNull(Object value) {
		if (value == null) {
			return "";
		}
		return value.toString();
	}

	public static String noNullForHTML(Object value) {
		return noNull(value, "&nbsp;");
	}

	public static String noNull(Object value, String defaultValue) {
		if (value == null) {
			return defaultValue;
		}
		if (value.toString().trim().length() < 1) {
			return defaultValue;
		}
		return value.toString();
	}

	public static String noNullString(String value) {
		if (value == null) {
			return "";
		}
		return value.toString();
	}

	public static boolean isNull(String value) {
		if (value == null) {
			return true;
		}
		if (value.length() < 1) {
			return true;
		}
		if (value.trim().length() < 1) {
			return true;
		}
		return false;
	}

	public static String getValueFromJSONObject(JSONObject obj, String attributeName) throws Exception {
		if (obj == null) {
			return "";
		}
		if (attributeName == null) {
			return "";
		}
		try {
			return obj.get(attributeName).toString();
		} catch (Exception e) {
		}
		return "";
	}

	public static String trimSize(String mesg, int maxSize) {
		if (mesg == null) {
			return mesg;
		}
		if (mesg.length() < maxSize) {
			return mesg;
		}
		return mesg.substring(0, maxSize);
	}

	public static String getStackTrace(Throwable aThrowable) {
		Writer result = new StringWriter();
		PrintWriter printWriter = new PrintWriter(result);
		aThrowable.printStackTrace(printWriter);
		return result.toString();
	}

	public static String getProcessedErrorMessage(Throwable aThrowable) {
		String errorMessage = getStackTrace(aThrowable);
		if (errorMessage.contains("CIF_UNIQUE")) {
			return "Duplicate Customer ID";
		}
		if (errorMessage.contains("EMAIL_UNIQUE")) {
			return "Duplicate EMail ID";
		}
		if (errorMessage.contains("ACC_NUM_UNIQUE")) {
			return "Duplicate Account Number";
		}
		if (errorMessage.contains("MOBILE_UNIQUE")) {
			return "Duplicate Mobile Number";
		}
		return errorMessage;
	}

	public static String trimLeadingSize(String value, int size) {
		if (value == null) {
			return value;
		}
		value = "0000000" + value;
		value = value.substring(value.length() - size);
		return value;
	}

	public static String trimLeadingMaxSize(String value, int size, String prefix) {
		if (value == null) {
			return value;
		}
		if (value.trim().length() > size) {
			return value;
		}
		value = "0000000000000000" + value;
		value = value.substring(value.length() - size);
		return prefix + value;
	}

	public static int getRandomNumber(int Low, int High) {
		Random r = new Random();
		int R = r.nextInt(High - Low) + Low;
		return R;
	}

	public static String getCurrencyEquivalent(String inputAmount) throws Exception {
		try {
			double amount = Double.parseDouble(inputAmount);
			DecimalFormat df = new DecimalFormat("#############.00");
			return df.format(amount);
		} catch (Exception exception) {
		}
		return inputAmount;
	}

	public static boolean isValidPhoneNumber(String phoneNumber) {
		phoneNumber = noNull(phoneNumber);
		if (phoneNumber.trim().length() < 8) {
			return false;
		}
		for (int index = 0; index < phoneNumber.length(); index++) {
			if (!Character.isDigit(phoneNumber.charAt(index))) {
				return false;
			}
		}
		return true;
	}

	public static boolean isValidNumber(String inputNumber) {
		inputNumber = noNull(inputNumber);
		if (inputNumber.trim().length() < 5) {
			return false;
		}
		for (int index = 0; index < inputNumber.length(); index++) {
			if (!Character.isDigit(inputNumber.charAt(index))) {
				return false;
			}
		}
		return true;
	}

	public static boolean isValidAmount(String inputNumber) {
		try {
			double amount = Double.parseDouble(inputNumber);
			return true;
		} catch (Exception exception) {
		}
		return false;
	}

	public static String getLastCharacters(String inputValue, int last) {
		inputValue = noNull(inputValue).trim();
		int len = inputValue.length();
		int idx = len - last;
		if (idx < 0) {
			return inputValue;
		}
		String result = inputValue.substring(idx);
		return result;
	}

	public static String getMapValue(HashMap map, String inputKey) {
		if (map == null) {
			return "";
		}
		if (inputKey == null) {
			return "";
		}
		if (!map.containsKey(inputKey)) {
			return "";
		}
		if (map.get(inputKey) == null) {
			return "";
		}
		return map.get(inputKey).toString();
	}

	public static String getMapValueWT(HashMap map, String inputKey) {
		String result = getMapValue(map, inputKey);
		result = noNull(result).trim();
		return result;
	}

	public static String getMapValue(Map map, String inputKey) {
		if (map == null) {
			return "";
		}
		if (inputKey == null) {
			return "";
		}
		if (!map.containsKey(inputKey)) {
			return "";
		}
		if (map.get(inputKey) == null) {
			return "";
		}
		return map.get(inputKey).toString();
	}

	public static boolean isValidEMail(String email) {
		if (email == null) {
			return false;
		}
		if (!email.contains("@")) {
			return false;
		}
		return true;
	}

	public static String loadFileAsString(String fileName) throws Exception {
		FileInputStream fis = new FileInputStream(fileName);
		DataInputStream dis = new DataInputStream(fis);
		String content = "";
		for (;;) {
			String line = dis.readLine();
			if (line == null) {
				break;
			}
			content = content + line + "\n";
		}
		dis.close();
		fis.close();
		return content;
	}

	public static String loadURLContent(String inputURL) throws Exception {
		URL url = new URL(inputURL);
		BufferedReader in = new BufferedReader(new InputStreamReader(url.openStream()));

		StringBuffer sb = new StringBuffer();
		String inputLine;
		while ((inputLine = in.readLine()) != null) {
			sb.append(inputLine + "\n");
		}
		in.close();

		return sb.toString();
	}

	public static String[] parseStringOwn(String inputValue, String delimiter)
			throws IllegalArgumentException, Exception {
		StringTokenizer tokenizer = new StringTokenizer(inputValue, delimiter);

		String[] result = new String[tokenizer.countTokens()];

		int tokenIndex = 0;
		while (tokenizer.hasMoreTokens()) {
			result[tokenIndex] = tokenizer.nextToken();
			tokenIndex++;
		}
		return result;
	}

	public static String getNextToken(String inputValue, String delimiter) {
		int index = inputValue.indexOf(delimiter);
		if (index == -1) {
			return inputValue;
		}
		if (index == 0) {
			return "";
		}
		return inputValue.substring(0, index + delimiter.length() - 1);
	}

	public static String clearNextToken(String inputValue, String delimiter) {
		int index = inputValue.indexOf(delimiter);
		if (index == -1) {
			return "";
		}
		return inputValue.substring(index + delimiter.length());
	}

	public static String[] parseToTokens(String data, String delimiter) {
		ArrayList tokenList = new ArrayList();
		for (;;) {
			String token = getNextToken(data, delimiter);
			tokenList.add(token);

			data = clearNextToken(data, delimiter);
			if (isNullOrEmpty(data)) {
				break;
			}
		}
		String[] tokenArray = new String[tokenList.size()];
		for (int index = 0; index < tokenList.size(); index++) {
			tokenArray[index] = tokenList.get(index).toString();
		}
		return tokenArray;
	}

	public static String pushToStack(String currentStack, String newElement) {
		if (isNullOrEmpty(currentStack)) {
			currentStack = newElement;
			return currentStack;
		}
		currentStack = newElement + "," + currentStack;
		return currentStack;
	}

	public static String peekFromStack(String currentStack) {
		if (isNullOrEmpty(currentStack)) {
			return "";
		}
		int commaIndex = currentStack.indexOf(",");
		if (commaIndex == -1) {
			return currentStack;
		}
		String peekElement = currentStack.substring(0, commaIndex);
		return peekElement;
	}

	public static String popFromStack(String currentStack) {
		if (isNullOrEmpty(currentStack)) {
			return "";
		}
		int commaIndex = currentStack.indexOf(",");
		if (commaIndex == -1) {
			return "";
		}
		String popElement = currentStack.substring(commaIndex + 1);
		return popElement;
	}

	public static boolean inStack(String currentStack, String element) throws Exception {
		if (isNullOrEmpty(currentStack)) {
			return false;
		}
		String[] tokens = parseString(currentStack, ",");
		for (int index = 0; index < tokens.length; index++) {
			if (tokens[index].equals(element)) {
				return true;
			}
		}
		return false;
	}

	public static boolean hasChanged(String s1, String s2) {
		s1 = noNull(s1);
		s2 = noNull(s2);
		if (!isNullOrEmpty(s1)) {
			if (isNullOrEmpty(s2)) {
				return false;
			}
		}
		return !s1.equals(s2);
	}


	public static HashMap convertJSONToMap(String jsonInput) throws Exception {
		if (isNullOrEmpty(jsonInput)) {
			return new HashMap();
		}
		JSONParser parser = new JSONParser();
		JSONObject jsonObject = (JSONObject) parser.parse(jsonInput);
		return convertJSONToMap(jsonObject);
	}

	public static HashMap convertUSSDDATAToMap(String ussdInput) throws Exception {
		if (isNullOrEmpty(ussdInput)) {
			return new HashMap();
		}
		StringTokenizer st = new StringTokenizer(ussdInput, "*");
		int tokenNumber = st.countTokens();
		System.out.println("tokenNumber is " + tokenNumber);
		HashMap map = new HashMap();
		for (int tokenIndex = 0; tokenIndex < tokenNumber; tokenIndex++) {
			if (tokenIndex == 0) {
				map.put("shortcode", st.nextToken());
			} else if (tokenIndex == 1) {
				map.put("servicecode", st.nextToken());
			} else if (tokenIndex == 2) {
				map.put("mobile", st.nextToken());
			} else if (tokenIndex == 3) {
				map.put("pin", st.nextToken());
			} else {
				map.put("param" + (tokenIndex - 3), st.nextToken());
			}
		}
		System.out.println("map is " + map);

		String lastParam = noNull(map.get("param" + (tokenNumber - 4)));
		System.out.println("lastParam1 is " + lastParam);
		lastParam = lastParam.replace("#", "");
		System.out.println("lastParam2 is " + lastParam);

		map.put("param" + tokenNumber, lastParam);
		System.out.println("map2 is " + map);
		return map;
	}

	public static HashMap convertJSONToMap(JSONObject jsonObject) throws Exception {
		HashMap resultMap = new HashMap();
		Iterator iterator = jsonObject.keySet().iterator();
		while (iterator.hasNext()) {
			String key = noNull(iterator.next());
			String value = noNull(jsonObject.get(key));
			resultMap.put(key, value);
		}
		return resultMap;
	}

	public static JSONArray convertToJSONArray(ArrayList arrayList) throws Exception {
		JSONArray jsonArray = new JSONArray();

		Iterator iterator = arrayList.iterator();
		while (iterator.hasNext()) {
			String value = noNull(iterator.next());
			jsonArray.add(value);
		}
		return jsonArray;
	}

	public static String convertMapToJSONString(HashMap map) throws Exception {
		JSONObject json = new JSONObject(map);
		return json.toJSONString();
	}

	public static String rpHash(String value) {
		int hash = 5381;
		value = value.toUpperCase();
		for (int i = 0; i < value.length(); i++) {
			hash = (hash << 5) + hash + value.charAt(i);
		}
		return String.valueOf(hash);
	}

	public static String getConditionValue(String inputValue, String checkValue, String trueValue, String falseValue) {
		inputValue = noNull(inputValue);
		checkValue = noNull(checkValue);
		if (inputValue.equals(checkValue)) {
			return trueValue;
		}
		return falseValue;
	}

	public static boolean isValueIncreased(String inputValue1, String inputValue2) {
		try {
			double value = getPercentageDifference(inputValue1, inputValue2);
			return value >= 0.0D;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return false;
	}

	public static double getPercentageDifference(String inputValue1, String inputValue2) {
		try {
			inputValue1 = replaceString(inputValue1, ",", "", true);
			inputValue2 = replaceString(inputValue2, ",", "", true);
			double dmin = 1.0D;
			if (!isNullOrEmpty(inputValue1)) {
				dmin = Double.parseDouble(inputValue1);
			}
			double dmax = 1.0D;
			if (!isNullOrEmpty(inputValue2)) {
				dmax = Double.parseDouble(inputValue2);
			}
			double result = dmax * 100.0D / dmin;
			return result - 100.0D;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return 0.0D;
	}

	public static String maskString(String input, int startIndex, int endIndex) {
		char[] inputArr = input.toCharArray();
		StringBuilder ouput = new StringBuilder("");
		for (int i = 0; i < inputArr.length; i++) {
			if ((i == startIndex) && (startIndex <= endIndex)) {
				ouput = ouput.append("X");
				startIndex++;
			} else {
				ouput = ouput.append(String.valueOf(inputArr[i]));
			}
		}
		return ouput.toString();
	}

	public static String maskAllZeros(String input, int startIndex) {
		char[] inputArr = input.toCharArray();
		StringBuilder ouput = new StringBuilder("");
		for (int i = 0; i < inputArr.length; i++) {
			if ((i == startIndex) && (inputArr[i] == '0')) {
				ouput = ouput.append("X");
				startIndex++;
			} else if ((i == startIndex) && (inputArr[i] != '0')) {
				ouput = ouput.append(String.valueOf(inputArr[i]));
				startIndex++;
			} else {
				ouput = ouput.append(String.valueOf(inputArr[i]));
			}
		}
		return ouput.toString();
	}
}
