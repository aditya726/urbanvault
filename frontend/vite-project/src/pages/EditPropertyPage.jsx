import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';
import Spinner from '../components/Spinner';

const EditPropertyPage = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const backendUrl = import.meta.env.VITE_API_URL;
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/properties/${id}`);
        // Ensure user is the owner
        if (user._id !== data.seller._id) {
            toast.error("Not authorized to edit this property");
            navigate('/');
            return;
        }
        setFormData({
            ...data,
            amenities: data.amenities.join(', '),
            images: data.images[0] || ''
        });
        setLoading(false);
      } catch (error) {
        toast.error('Property not found');
        navigate('/');
      }
    };
    fetchProperty();
  }, [id, user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${user.token}`
            }
        };
        const propertyData = {
            ...formData,
            amenities: formData.amenities.split(',').map(item => item.trim()),
            images: [formData.images]
        };
        
      const { data } = await axios.put(`/api/properties/${id}`, propertyData, config);
      toast.success('Property updated successfully!');
      navigate(`/property/${data._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update property');
    }
  };

  if (loading) return <Spinner />;

  return (
     <div className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-md">
       <h1 className="text-3xl font-bold mb-6">Edit Property</h1>
       <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <input type="text" name="title" value={formData.title} onChange={handleChange} className="p-2 border rounded"/>
         <input type="number" name="price" value={formData.price} onChange={handleChange} className="p-2 border rounded"/>
         <input type="text" name="location" value={formData.location} onChange={handleChange} className="p-2 border rounded"/>
         <input type="text" name="address" value={formData.address} onChange={handleChange} className="p-2 border rounded"/>
         <input type="number" name="bedrooms" value={formData.bedrooms} onChange={handleChange} className="p-2 border rounded"/>
         <input type="number" name="bathrooms" value={formData.bathrooms} onChange={handleChange} className="p-2 border rounded"/>
         <input type="number" name="area" value={formData.area} onChange={handleChange} className="p-2 border rounded"/>
         <input type="text" name="amenities" value={formData.amenities} onChange={handleChange} className="p-2 border rounded"/>
         <input type="text" name="images" value={formData.images} onChange={handleChange} className="md:col-span-2 p-2 border rounded"/>
         
         <select name="propertyType" value={formData.propertyType} onChange={handleChange} className="p-2 border rounded">
             <option>Apartment</option><option>House</option><option>Villa</option><option>Commercial</option><option>Land</option>
         </select>
         <select name="status" value={formData.status} onChange={handleChange} className="p-2 border rounded">
            <option value="available">Available</option>
            <option value="sold">Sold</option>
            <option value="pending">Pending</option>
         </select>
         
         <textarea name="description" value={formData.description} onChange={handleChange} className="md:col-span-2 p-2 border rounded h-32"></textarea>
         
         <button type="submit" className="md:col-span-2 w-full py-3 text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
             Update Property
         </button>
       </form>
     </div>
  );
};

export default EditPropertyPage;