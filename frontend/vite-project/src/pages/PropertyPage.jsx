import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Spinner from '../components/Spinner';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

const PropertyPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const backendUrl = import.meta.env.VITE_API_URL;
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${backendUrl}/api/properties/${id}`);
        setProperty(data);
        setLoading(false);
      } catch (err) {
        setError('Property not found.');
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this property?')) {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            await axios.delete(`${backendUrl}/api/properties/${id}`, config);
            toast.success('Property deleted successfully');
            navigate('/');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Could not delete property');
        }
    }
  }

  if (loading) return <Spinner />;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!property) return null;

  const isOwner = user && user._id === property.seller._id;

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-4 text-gray-900">{property.title}</h1>
      <p className="text-lg text-gray-600 mb-6">{property.location}</p>

      <div className="mb-6">
        <img
          src={property.images[0] || 'https://placehold.co/800x500'}
          alt={property.title}
          className="w-full h-auto rounded-lg object-cover"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
        <div className="md:col-span-2">
          <h2 className="text-2xl font-semibold mb-3">Description</h2>
          <p className="text-gray-700 leading-relaxed">{property.description}</p>
        </div>
        <div>
          <div className="bg-gray-100 p-6 rounded-lg">
            <p className="text-3xl font-bold text-indigo-600 mb-4">${new Intl.NumberFormat().format(property.price)}</p>
            <div className="space-y-3 text-gray-800">
              <p><strong>Type:</strong> {property.propertyType}</p>
              <p><strong>Bedrooms:</strong> {property.bedrooms}</p>
              <p><strong>Bathrooms:</strong> {property.bathrooms}</p>
              <p><strong>Area:</strong> {property.area} sq ft</p>
              <p><strong>Status:</strong> <span className="capitalize font-medium text-green-600">{property.status}</span></p>
            </div>
             {isOwner && (
                <div className="mt-6 flex space-x-3">
                    <Link to={`/property/${property._id}/edit`} className="flex-1 text-center bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600">
                        Edit
                    </Link>
                    <button onClick={handleDelete} className="flex-1 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">
                        Delete
                    </button>
                </div>
            )}
          </div>
        </div>
      </div>
      
      {property.seller && (
         <div className="mt-8 border-t pt-6">
            <h3 className="text-2xl font-semibold mb-4">Seller Information</h3>
            <div className="flex items-center space-x-4">
                <img src={property.seller.profilePicture} alt={property.seller.username} className="w-16 h-16 rounded-full"/>
                <div>
                    <p className="text-xl font-medium">{property.seller.username}</p>
                    <p className="text-gray-600">{property.seller.email}</p>
                </div>
            </div>
         </div>
      )}

    </div>
  );
};

export default PropertyPage;