import { useState } from 'react';
import Navbar from '../components/Navbar';
import LocationDetection from '../components/LocationDetection';
import WeatherForecast from '../components/WeatherForecast';

const Home = () => {
  const [activeTab, setActiveTab] = useState('location');

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          Travel Guide App
        </h1>
        
        <div className="flex justify-center mb-6">
          <div className="inline-flex rounded-md shadow-sm">
            <button
              onClick={() => setActiveTab('location')}
              className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                activeTab === 'location'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Location Detection
            </button>
            <button
              onClick={() => setActiveTab('weather')}
              className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
                activeTab === 'weather'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Weather Forecast
            </button>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          {activeTab === 'location' && <LocationDetection />}
          {activeTab === 'weather' && <WeatherForecast />}
        </div>
      </div>
    </div>
  );
};

export default Home;