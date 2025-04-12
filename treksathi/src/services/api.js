// Service to handle API calls
const API_BASE_URL = '/api';

// Function to get location data
export const getLocationData = async (locationParams) => {
  try {
    const response = await fetch(`${API_BASE_URL}/LocationDetection`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(locationParams),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'API request failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Error in getLocationData:', error);
    throw error;
  }
};

// Add more API functions as needed
export const getWeatherData = async (lat, lon) => {
  try {
    const response = await fetch(`${API_BASE_URL}/Weather?lat=${lat}&lon=${lon}`);
    
    if (!response.ok) {
      throw new Error('Weather API request failed');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error in getWeatherData:', error);
    throw error;
  }
};