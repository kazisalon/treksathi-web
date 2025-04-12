import { useState, useEffect } from 'react';
import { getLocationData } from '../services/api';

const LocationDetection = () => {
  const [loading, setLoading] = useState(false);
  const [geoLoading, setGeoLoading] = useState(true);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);
  
  // Categories for dropdown
  const categories = ["restaurant", "hotel", "attraction", "shopping", "nature"];
  
  // Location data state
  const [locationData, setLocationData] = useState({
    latitude: 27.7172, // Default to Kathmandu
    longitude: 85.3240, // Default to Kathmandu
    radiusInKm: 5,
    category: "restaurant",
    minRating: 3,
    maxDistance: 10
  });

  // Popular locations in Nepal
  const popularLocations = [
    { name: "Kathmandu", lat: 27.7172, lng: 85.3240 },
    { name: "Pokhara", lat: 28.2096, lng: 83.9856 },
    { name: "Bhaktapur", lat: 27.6710, lng: 85.4298 },
    { name: "Lalitpur", lat: 27.6588, lng: 85.3247 },
    { name: "Chitwan", lat: 27.5291, lng: 84.3542 },
    { name: "Lumbini", lat: 27.4833, lng: 83.2767 }
  ];

  // Get user's current location on component mount
  useEffect(() => {
    setGeoLoading(true);
    
    const fetchLocationByIP = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        
        const lat = data.latitude;
        const lng = data.longitude;
        const isInNepal = data.country === 'NP';
        
        if (isInNepal) {
          setLocationData(prev => ({
            ...prev,
            latitude: lat,
            longitude: lng
          }));
        } else {
          // Default to Kathmandu coordinates
          console.log("IP location not in Nepal, using default Kathmandu location");
        }
      } catch (err) {
        console.error("IP geolocation failed:", err);
      } finally {
        setGeoLoading(false);
      }
    };

    if (navigator.geolocation) {
      const options = {
        enableHighAccuracy: true,
        timeout: 10000, // 10 seconds is usually sufficient
        maximumAge: 0  // Don't use cached positions
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          
          // Validate coordinates are within Nepal's approximate bounds
          const isInNepal = lat >= 26 && lat <= 31 && lng >= 80 && lng <= 89;
          
          if (lat && lng) {
            if (isInNepal) {
              setLocationData(prev => ({
                ...prev,
                latitude: lat,
                longitude: lng
              }));
            } else {
              // Location is outside Nepal, no need to show error, just use default
              console.log("Browser location outside Nepal, using default");
            }
            setGeoLoading(false);
          } else {
            console.log("Invalid coordinates, falling back to IP location");
            fetchLocationByIP();
          }
        },
        (err) => {
          console.error("Geolocation error:", err);
          fetchLocationByIP();
        },
        options
      );
    } else {
      setError("Geolocation is not supported by your browser.");
      fetchLocationByIP();
    }
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocationData(prev => ({
      ...prev,
      [name]: name === "category" ? value : Number(value)
    }));
  };

  // Handle location select change
  const handleLocationSelect = (e) => {
    const selectedLocation = popularLocations.find(loc => loc.name === e.target.value);
    if (selectedLocation) {
      setLocationData(prev => ({
        ...prev,
        latitude: selectedLocation.lat,
        longitude: selectedLocation.lng
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = await getLocationData(locationData);
      setResults(data);
    } catch (err) {
      setError("Failed to fetch location data. Please try again.");
      console.error("API error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-blue-700 mb-6">Location Detection</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {geoLoading ? (
        <div className="text-center p-4">
          <p className="text-gray-600">Detecting your location...</p>
          <div className="mt-3 w-full max-w-xs mx-auto bg-gray-200 rounded-full h-2.5">
            <div className="bg-blue-600 h-2.5 rounded-full animate-pulse w-full"></div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit}>
            {/* Location selector */}
            <div className="mb-6">
              <label className="block text-gray-700 mb-2">Select a location in Nepal</label>
              <select 
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                onChange={handleLocationSelect}
                defaultValue=""
              >
                <option value="" disabled>Choose a popular location</option>
                {popularLocations.map(location => (
                  <option key={location.name} value={location.name}>
                    {location.name}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-sm text-gray-500">
                Or manually enter coordinates below
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 mb-2">Latitude</label>
                <input
                  type="number"
                  name="latitude"
                  value={locationData.latitude}
                  onChange={handleChange}
                  step="any"
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2">Longitude</label>
                <input
                  type="number"
                  name="longitude"
                  value={locationData.longitude}
                  onChange={handleChange}
                  step="any"
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2">Radius (km)</label>
                <input
                  type="number"
                  name="radiusInKm"
                  value={locationData.radiusInKm}
                  onChange={handleChange}
                  min="0"
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2">Category</label>
                <select
                  name="category"
                  value={locationData.category}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2">Minimum Rating</label>
                <input
                  type="number"
                  name="minRating"
                  value={locationData.minRating}
                  onChange={handleChange}
                  min="0"
                  max="5"
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2">Max Distance (km)</label>
                <input
                  type="number"
                  name="maxDistance"
                  value={locationData.maxDistance}
                  onChange={handleChange}
                  min="0"
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Find Locations'}
            </button>
          </form>
        </div>
      )}

      {results && (
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-blue-700 mb-4">Results</h2>
          
          {/* Address Section */}
          {results.address && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Current Location</h3>
              <div className="bg-gray-50 p-4 rounded">
                <p className="text-gray-700">
                  {results.address.road ? `${results.address.road}, ` : ''}
                  {results.address.city ? `${results.address.city}` : ''}
                  <br />
                  {results.address.state ? `${results.address.state}, ` : ''}
                  {results.address.country ? `${results.address.country}` : ''}
                  <br />
                  {results.address.postalCode ? `${results.address.postalCode}` : ''}
                </p>
              </div>
            </div>
          )}

          {/* Nearby Attractions Section */}
          {results.nearbyAttractions && results.nearbyAttractions.length > 0 ? (
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Nearby Places</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.nearbyAttractions.map((place, index) => (
                  <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <h4 className="text-lg font-medium text-blue-600">{place.name}</h4>
                      {place.rating > 0 && (
                        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">
                          ⭐ {place.rating}
                        </span>
                      )}
                    </div>
                    
                    <p className="text-gray-600 text-sm mt-2">{place.description || 'No description available'}</p>
                    
                    <div className="mt-3 text-sm text-gray-500">
                      <p>Category: {place.category}</p>
                      <p>Distance: {place.distanceInKm.toFixed(2)} km</p>
                      {place.openHours && <p>Hours: {place.openHours}</p>}
                      {place.entryFee && <p>Entry Fee: {place.entryFee}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center p-4 bg-gray-50 rounded">
              <p className="text-gray-700">No nearby places found. Try adjusting your search parameters.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LocationDetection;