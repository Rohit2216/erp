const axios = require('axios');

const fetchLocationName = async () => {
  try {
    const response = await axios.get(
      `https://maps.google.com/maps?q=${29.6386837},${77.0794705}&z=15&output=embed`
    );
    console.log("response", response)
    if (response.data.status === "OK") {
      const address = response.data.results[0]?.formatted_address;
      console.log("Location Name:", address);
      return address; // Returns full address
    } else {
      console.error("Geocoding API Error:", response.data.status);
      return "Unknown Location";
    }
  } catch (error) {
    console.error("Error fetching location name:", error);
    return "Error fetching location";
  }
};

// Call this function with the latitude and longitude:
fetchLocationName();
