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
            className="mt-6 w-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-bold py-4 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Loading Weather Data...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
                <span>Get Weather</span>
              </>
            )}
          </button>
        </form>
      </div>

      {weather && (
        <div className="bg-white rounded-lg shadow-md p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
          <h2 className="text-2xl font-bold text-blue-700 mb-4 flex items-center">
            <svg className="w-8 h-8 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
            </svg>
            Current Weather
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/70 backdrop-blur-sm p-6 rounded-lg shadow-inner">
              <div className="text-center">
                <div className="text-6xl font-bold text-blue-700 mb-2">
                  {weather.temperature}°C
                </div>
                <div className="text-xl text-gray-700 capitalize font-medium">
                  {weather.weatherDescription}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/70 backdrop-blur-sm p-4 rounded-lg shadow-inner hover:shadow-md transition-all">
                <div className="text-sm text-gray-600 mb-1">Humidity</div>
                <div className="text-2xl font-semibold text-blue-600">{weather.humidity}%</div>
              </div>
              
              <div className="bg-white/70 backdrop-blur-sm p-4 rounded-lg shadow-inner hover:shadow-md transition-all">
                <div className="text-sm text-gray-600 mb-1">Wind Speed</div>
                <div className="text-2xl font-semibold text-blue-600">{weather.windSpeed} km/h</div>
              </div>
              
              <div className="bg-white/70 backdrop-blur-sm p-4 rounded-lg shadow-inner hover:shadow-md transition-all">
                <div className="text-sm text-gray-600 mb-1">Pressure</div>
                <div className="text-2xl font-semibold text-blue-600">{weather.pressure} hPa</div>
              </div>
              
              <div className="bg-white/70 backdrop-blur-sm p-4 rounded-lg shadow-inner hover:shadow-md transition-all">
                <div className="text-sm text-gray-600 mb-1">Visibility</div>
                <div className="text-2xl font-semibold text-blue-600">{weather.visibility} km</div>
              </div>
            </div>
          </div>
          
          {weather.forecast && (
            <div className="mt-8">
              <h3 className="text-xl font-bold text-blue-700 mb-4 flex items-center">
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                5-Day Forecast
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {weather.forecast.map((day, index) => (
                  <div key={index} className="bg-white/70 backdrop-blur-sm p-4 rounded-lg shadow-inner hover:shadow-md transition-all">
                    <div className="text-sm font-medium text-blue-600">{day.date}</div>
                    <div className="text-2xl font-bold text-gray-800 my-2">{day.tempHigh}°
                      <span className="text-lg text-gray-500">/{day.tempLow}°</span>
                    </div>
                    <div className="text-sm text-gray-600 capitalize">{day.condition}</div>
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