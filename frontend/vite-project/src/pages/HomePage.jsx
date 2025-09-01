import { useState, useEffect } from 'react';
import axios from 'axios';
import PropertyCard from '../components/PropertyCard';
import Spinner from '../components/Spinner';

const HomePage = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const backendUrl = import.meta.env.VITE_API_URL;
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        // Pass keyword query to the backend
        const { data } = await axios.get(`${backendUrl}/api/properties?keyword=${searchTerm}`);
        setProperties(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch properties.');
        setLoading(false);
      }
    };
    fetchProperties();
  }, [searchTerm]); // Re-run effect when searchTerm changes

  return (
    <div>
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Featured Properties</h1>
      <div className="mb-8 max-w-lg mx-auto">
        <input
          type="text"
          placeholder="Search by title, location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      {loading ? (
        <Spinner />
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.isArray(properties) && properties.map((property) => (
            <PropertyCard key={property._id} property={property} />
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;