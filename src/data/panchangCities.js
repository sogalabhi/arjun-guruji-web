// Indian city coordinates; all calendar dates and times use IST.
export const CITIES = {
  "Delhi": [
    28.6,
    77.2
  ],
  "Mumbai": [
    19.1,
    72.9
  ],
  "Kolkata": [
    22.6,
    88.4
  ],
  "Chennai": [
    13.1,
    80.3
  ],
  "Srinagar": [
    34.1,
    74.8
  ],
  "Bangalore": [
    12.9,
    77.6
  ],
  "Hyderabad": [
    17.4,
    78.5
  ],
  "Pune": [
    18.5,
    73.9
  ],
  "Ahmedabad": [
    23.0,
    72.6
  ],
  "Jaipur": [
    26.9,
    75.8
  ],
  "Lucknow": [
    26.8,
    81.0
  ],
  "Chandigarh": [
    30.7,
    76.8
  ],
  "Jammu": [
    32.7,
    74.9
  ],
  "Indore": [
    22.7,
    75.9
  ],
  "Ujjain": [
    23.2,
    75.8
  ],
  "Bhopal": [
    23.3,
    77.4
  ],
  "Nagpur": [
    21.1,
    79.1
  ],
  "Patna": [
    25.6,
    85.1
  ],
  "Kochi": [
    10.0,
    76.3
  ],
  "Guwahati": [
    26.1,
    91.7
  ],
  "Varanasi": [
    25.3,
    83.0
  ],
  "Amritsar": [
    31.6,
    74.9
  ],
  "Dehradun": [
    30.3,
    78.0
  ],
  "Thiruvananthapuram": [
    8.5,
    76.9
  ],
  "Coimbatore": [
    11.0,
    76.9
  ],
  "Visakhapatnam": [
    17.7,
    83.3
  ],
  "Mangalore": [
    12.9,
    74.9
  ],
  "Mysore": [
    12.3,
    76.7
  ],
  "Noida": [
    28.6,
    77.3
  ],
  "Gurgaon": [
    28.5,
    77.0
  ],
  "Agra": [
    27.2,
    78.0
  ],
  "Allahabad": [
    25.4,
    81.8
  ],
  "Aurangabad": [
    19.9,
    75.3
  ],
  "Bhubaneswar": [
    20.3,
    85.8
  ],
  "Faridabad": [
    28.4,
    77.3
  ],
  "Ghaziabad": [
    28.7,
    77.4
  ],
  "Gorakhpur": [
    26.8,
    83.4
  ],
  "Gwalior": [
    26.2,
    78.2
  ],
  "Hubli": [
    15.4,
    75.1
  ],
  "Jabalpur": [
    23.2,
    79.9
  ],
  "Jalandhar": [
    31.3,
    75.6
  ],
  "Jodhpur": [
    26.3,
    73.0
  ],
  "Kanpur": [
    26.4,
    80.3
  ],
  "Kota": [
    25.2,
    75.9
  ],
  "Ludhiana": [
    30.9,
    75.9
  ],
  "Madurai": [
    9.9,
    78.1
  ],
  "Meerut": [
    29.0,
    77.7
  ],
  "Nashik": [
    20.0,
    73.8
  ],
  "Raipur": [
    21.3,
    81.6
  ],
  "Rajkot": [
    22.3,
    70.8
  ],
  "Ranchi": [
    23.3,
    85.3
  ],
  "Salem": [
    11.7,
    78.2
  ],
  "Surat": [
    21.2,
    72.8
  ],
  "Thane": [
    19.2,
    73.0
  ],
  "Tiruchirappalli": [
    10.8,
    78.7
  ],
  "Tirupati": [
    13.6,
    79.4
  ],
  "Udaipur": [
    24.6,
    73.7
  ],
  "Vadodara": [
    22.3,
    73.2
  ],
  "Vijayawada": [
    16.5,
    80.6
  ],
  "Warangal": [
    18.0,
    79.6
  ],
  "Mussoorie": [
    30.5,
    78.1
  ],
  "Rishikesh": [
    30.1,
    78.3
  ],
  "Haridwar": [
    29.9,
    78.2
  ],
  "Mathura": [
    27.5,
    77.7
  ],
  "Vrindavan": [
    27.6,
    77.7
  ],
  "Ayodhya": [
    26.8,
    82.2
  ],
  "Prayagraj": [
    25.4,
    81.8
  ],
  "Dwarka": [
    22.2,
    69.0
  ],
  "Shirdi": [
    19.8,
    74.5
  ]
};

export const normalizeCity = (name) => ({ mysuru: "Mysore", bengaluru: "Bangalore" })[name.trim().toLowerCase()] ?? Object.keys(CITIES).find((city) => city.toLowerCase() === name.trim().toLowerCase());
