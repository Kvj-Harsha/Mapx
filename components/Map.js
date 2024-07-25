// components/Map.js
"use client"
import { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import Papa from 'papaparse'; // Library to parse CSV

const defaultLocations = [
  { name: "USA", lat: 37.7749, lng: -122.4194 },
  { name: "India", lat: 28.6139, lng: 77.209 },
  { name: "Brazil", lat: -23.5505, lng: -46.6333 },
  { name: "Australia", lat: -33.8688, lng: 151.2093 },
  { name: "Japan", lat: 35.6895, lng: 139.6917 },
];

const MapComponent = ({ lat, lng }) => {
  const map = useMap();
  map.setView([lat, lng], 13);
  return <Marker position={[lat, lng]} />;
};

const Map = () => {
  const [coordinates, setCoordinates] = useState({ lat: 51.505, lng: -0.09 });
  const [buttons, setButtons] = useState(defaultLocations);
  const [csvButtons, setCsvButtons] = useState([]);
  const [csvFile, setCsvFile] = useState(null);

  const handleSearch = () => {
    const lat = parseFloat(document.getElementById('lat').value);
    const lng = parseFloat(document.getElementById('lng').value);
    setCoordinates({ lat, lng });
  };

  const handleDefaultLocationClick = (lat, lng) => {
    document.getElementById('lat').value = lat;
    document.getElementById('lng').value = lng;
    setCoordinates({ lat, lng });
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) {
      return;
    }
    
    if (file.type !== 'text/csv') {
      alert('Please upload a valid CSV file.');
      return;
    }

    if (event.target.files.length > 1) {
      alert('Upload only one CSV file.');
      return;
    }

    Papa.parse(file, {
      header: true,
      complete: (results) => {
        const parsedData = results.data;

        // Create buttons from CSV data
        const newButtons = parsedData.map(row => ({
          name: row.srn,
          lat: parseFloat(row.lat),
          lng: parseFloat(row.lng)
        }));
        setCsvButtons(newButtons);
        setCsvFile(file);
      },
      error: (error) => {
        console.error('Error parsing CSV file:', error);
      }
    });
  };

  const handleCSVButtonClick = (lat, lng) => {
    document.getElementById('lat').value = lat;
    document.getElementById('lng').value = lng;
    setCoordinates({ lat, lng });
  };

  const resetMap = () => {
    setCoordinates({ lat: 51.505, lng: -0.09 });
    document.getElementById('lat').value = '';
    document.getElementById('lng').value = '';
  };

  const clearCSV = () => {
    setCsvButtons([]);
    setCsvFile(null);
  };

  const detectMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        setCoordinates({ lat: latitude, lng: longitude });

        // Fetch location details from OpenGate
        const apiKey = 'f3e2e0b3c6a6481abe6558f9e8112cba'; // Replace with your API key
        const response = await fetch(`https://api.opengate.com/reverse?lat=${latitude}&lng=${longitude}&apikey=${apiKey}`);
        const data = await response.json();

        console.log(data); // Log to see the response format

        // Optionally set additional location details if needed
      }, (error) => {
        console.error('Error getting location:', error);
      });
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  return (
    <div className="flex flex-row items-start p-4">
      <div className="flex flex-col space-y-2 mr-4">
        <input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          className="mb-4 p-2 border rounded"
        />
        <button
          onClick={resetMap}
          className="p-2 bg-red-500 text-white rounded mb-2"
        >
          Reset Map
        </button>
        <button
          onClick={clearCSV}
          className="p-2 bg-gray-500 text-white rounded mb-2"
        >
          Clear CSV Data
        </button>
        <button
          onClick={detectMyLocation}
          className="p-2 bg-green-500 text-white rounded mb-2"
        >
          Detect My Location
        </button>
        <select
          onChange={(e) => {
            const selected = csvButtons.find(button => button.name === e.target.value);
            if (selected) {
              handleCSVButtonClick(selected.lat, selected.lng);
            }
          }}
          className="p-2 border rounded text-black"
        >
          <option value="">Select CSV Location</option>
          {csvButtons.map(button => (
            <option key={button.name} value={button.name}>
              {button.name}
            </option>
          ))}
        </select>
        {defaultLocations.map((location) => (
          <button
            key={location.name}
            onClick={() => handleDefaultLocationClick(location.lat, location.lng)}
            className="p-2 bg-gray-500 text-white rounded mt-2"
          >
            {location.name}
          </button>
        ))}
      </div>
      <div className="flex flex-col items-center">
        <div className="mb-4 flex space-x-2">
          <input
            type="text"
            id="lat"
            placeholder="Latitude"
            className="p-2 border rounded text-black"
          />
          <input
            type="text"
            id="lng"
            placeholder="Longitude"
            className="p-2 border rounded text-black"
          />
          <button
            onClick={handleSearch}
            className="p-2 bg-blue-500 text-black rounded"
          >
            Search
          </button>
        </div>
        <div className="w-full h-[500px]">
          <MapContainer
            center={[coordinates.lat, coordinates.lng]}
            zoom={13}
            className="h-full rounded-lg border shadow-lg"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <MapComponent lat={coordinates.lat} lng={coordinates.lng} />
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default Map;
