import React, { useState, useEffect } from 'react';
import axios from 'axios';
import'./areadisplay.css';

const AreaDisplay = () => {
  const [areas, setAreas] = useState([]);
  const [selectedArea, setSelectedArea] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAreas();
  }, []);

  const fetchAreas = async () => {
    try {
      const response = await axios.get('http://localhost:8080/getAREAs/');
      setAreas(response.data);
      setLoading(false);
    } catch (error) {
      setError('Error fetching areas: ' + error.message);
      setLoading(false);
    }
  };

  const fetchAreaDetails = async (id) => {
    try {
      const response = await axios.get(`http://localhost:8080/getAREA/${id}`);
      setSelectedArea(response.data.action);
    } catch (error) {
      setError('Error fetching area details: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Your Areas</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {areas.map((area) => (
            <div
              key={area.id}
              className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => fetchAreaDetails(area.id)}
            >
              <h2 className="text-xl font-semibold mb-2">AREA #{area.id}</h2>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Status:</span>
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    area.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {area.status}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Created:</span>
                  <span className="text-gray-800">
                    {new Date(area.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal pour afficher les détails */}
        {selectedArea && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Area Details</h2>
                <button
                  onClick={() => setSelectedArea(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">Action</h3>
                  <pre className="bg-gray-50 p-4 rounded-lg mt-2 overflow-auto">
                    {JSON.stringify(selectedArea, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AreaDisplay;