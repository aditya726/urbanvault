import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

const CreatePropertyPage = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    address: '',
    bedrooms: '',
    bathrooms: '',
    area: '',
    propertyType: 'Apartment',
    amenities: '',
    images: 'https://placehold.co/600x400', // Placeholder
  });

  const { user } = useAuth();
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_API_URL;
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
        // Convert comma-separated strings to arrays
        const propertyData = {
            ...formData,
            amenities: formData.amenities.split(',').map(item => item.trim()),
            images: [formData.images] // For now, we handle a single image URL
        };
        
      const { data } = await axios.post(`${backend}/api/properties`, propertyData, config);
      toast.success('Property created successfully!');
      navigate(`/property/${data._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create property');
    }
  };

  return (
     <div className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-md">
       <h1 className="text-3xl font-bold mb-6">List a New Property</h1>
       <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
         {/* Simple text inputs */}
         <input type="text" name="title" placeholder="Title" onChange={handleChange} required className="p-2 border rounded"/>
         <input type="number" name="price" placeholder="Price" onChange={handleChange} required className="p-2 border rounded"/>
         <input type="text" name="location" placeholder="Location (e.g., City, State)" onChange={handleChange} required className="p-2 border rounded"/>
         <input type="text" name="address" placeholder="Full Address" onChange={handleChange} required className="p-2 border rounded"/>
         <input type="number" name="bedrooms" placeholder="Bedrooms" onChange={handleChange} required className="p-2 border rounded"/>
         <input type="number" name="bathrooms" placeholder="Bathrooms" onChange={handleChange} required className="p-2 border rounded"/>
         <input type="number" name="area" placeholder="Area (sq ft)" onChange={handleChange} required className="p-2 border rounded"/>
         <input type="text" name="amenities" placeholder="Amenities (comma-separated)" onChange={handleChange} className="p-2 border rounded"/>
         <input type="text" name="images" placeholder="Image URL" onChange={handleChange} className="md:col-span-2 p-2 border rounded" defaultValue="https://placehold.co/600x400"/>
         
         <select name="propertyType" onChange={handleChange} className="p-2 border rounded">
             <option>Apartment</option>
             <option>House</option>
             <option>Villa</option>
             <option>Commercial</option>
             <option>Land</option>
         </select>
         
         <textarea name="description" placeholder="Description" onChange={handleChange} required className="md:col-span-2 p-2 border rounded h-32"></textarea>
         
         <button type="submit" className="md:col-span-2 w-full py-3 text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
             Create Property
         </button>
       </form>
     </div>
  );
};

export default CreatePropertyPage;