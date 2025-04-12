import { useState, useEffect } from 'react';
import { getWeatherData } from '../services/api';

const WeatherForecast = () => {
  const [location, setLocation] = useState({ latitude: 0, longitude: 0 });
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get user's current location on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (err) => {
          setError("Error accessing your location. Please enable location services.");
          console.error("Geolocation error:", err);
        }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
    }
  }, []);

  // Fetch weather data when location changes
  useEffect(() => {
    const fetchWeather = async () => {
      if (location.latitude && location.longitude) {
        setLoading(true);
        try {
          const data = await getWeatherData(location.latitude, location.longitude);
          setWeather(data);
        } catch (err) {
          setError("Failed to fetch weather data. Please try again.");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchWeather();
  }, [location]);

  // Handle location input changes
  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    setLocation(prev => ({
      ...prev,
      [name]: Number(value)
    }));
  };

  // Handle form submission to update weather
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    getWeatherData(location.latitude, location.longitude)
      .then(data => setWeather(data))
      .catch(err => {
        setError("Failed to fetch weather data. Please try again.");
        console.error("API error:", err);
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-blue-700 mb-6">Weather Forecast</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 mb-2">Latitude</label>
              <input
                type="number"
                name="latitude"
                value={location.latitude}
                onChange={handleLocationChange}
                step="any"
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">Longitude</label>
              <input
                type="number"
                name="longitude"
                value={location.longitude}
                onChange={handleLocationChange}
                step="any"
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Get Weather'}
          </button>
        </form>
      </div>

      {weather && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-blue-700 mb-4">Current Weather</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-center">
                <div className="text-5xl font-bold text-blue-700">
                  {weather.temperature}°C
                </div>
                <div className="text-xl text-gray-700 mt-2">
                  {weather.weatherDescription}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-3 rounded">
                <div className="text-sm text-gray-600">Humidity</div>
                <div className="text-xl font-semibold">{weather.humidity}%</div>
              </div>
              
              <div className="bg-gray-50 p-3 rounded">
                <div className="text-sm text-gray-600">Wind Speed</div>
                <div className="text-xl font-semibold">{weather.windSpeed} km/h</div>
              </div>
              
              <div className="bg-gray-50 p-3 rounded">
                <div className="text-sm text-gray-600">Pressure</div>
                <div className="text-xl font-semibold">{weather.pressure} hPa</div>
              </div>
              
              <div className="bg-gray-50 p-3 rounded">
                <div className="text-sm text-gray-600">Visibility</div>
                <div className="text-xl font-semibold">{weather.visibility} km</div>
              </div>
            </div>
          </div>
          
          {weather.forecast && (
            <div className="mt-6">
              <h3 className="text-xl font-bold text-blue-700 mb-3">5-Day Forecast</h3>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                {weather.forecast.map((day, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded text-center">
                    <div className="text-sm font-medium">{day.date}</div>
                    <div className="text-lg font-bold">{day.tempHigh}°/{day.tempLow}°</div>
                    <div className="text-sm text-gray-600">{day.condition}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WeatherForecast;