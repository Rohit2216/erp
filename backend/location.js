const axios = require('axios');

// Function to get location name using latitude and longitude
const getLocationName = async (latitude, longitude) => {
  try {
    const apiKey = 'AIzaSyCXBAr6z6GezzSQqNwcRJ1qWRftJtE41TA'; // Replace with your API key
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;

    console.log("url", url)
    const response = await axios.get(url);

    if (response.data.status === 'OK') {
      const results = response.data.results;
      if (results.length > 0) {
        return results[0].formatted_address; // Get the formatted address
      } else {
        throw new Error('No results found for the given coordinates.');
      }
    } else {
      throw new Error(`Geocoding API error: ${response.data.status}`);
    }
  } catch (error) {
    console.error('Error getting location name:', error.message);
    return null;
  }
};

// Example usage
(async () => {
  const latitude = 28.4208; // Example latitude
  const longitude = 77.0383; // Example longitude
  const locationName = await getLocationName(latitude, longitude);
  console.log('Location Name:', locationName);
})();
