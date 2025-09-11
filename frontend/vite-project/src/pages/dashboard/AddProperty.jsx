import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api';
import toast from 'react-hot-toast';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AddProperty() {
    const navigate = useNavigate();
    const [propertyData, setPropertyData] = useState({
        title: '',
        description: '',
        price: '',
        location: '',
        address: '',
        bedrooms: '',
        bathrooms: '',
        area: '',
        propertyType: '',
        amenities: '',
        images: ['', '', ''],
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPropertyData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleSelectChange = (value) => {
        setPropertyData(prev => ({ ...prev, propertyType: value }));
    };

    const handleImageChange = (index, value) => {
        const newImages = [...propertyData.images];
        newImages[index] = value;
        setPropertyData(prev => ({ ...prev, images: newImages }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const submissionData = {
            ...propertyData,
            price: Number(propertyData.price),
            bedrooms: Number(propertyData.bedrooms),
            bathrooms: Number(propertyData.bathrooms),
            area: Number(propertyData.area),
            amenities: propertyData.amenities.split(',').map(item => item.trim()),
            images: propertyData.images.filter(img => img !== ''), // Filter out empty strings
        };

        if (submissionData.images.length === 0) {
            toast.error("Please provide at least one image URL.");
            return;
        }

        try {
            await API.post('/api/properties', submissionData);
            toast.success('Property listed successfully!');
            navigate('/dashboard/my-listings');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to list property.');
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">List a New Property</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="title">Property Title</Label>
                        <Input id="title" name="title" value={propertyData.title} onChange={handleChange} required />
                    </div>
                    <div>
                        <Label htmlFor="location">City / Location</Label>
                        <Input id="location" name="location" value={propertyData.location} onChange={handleChange} required />
                    </div>
                </div>
                <div>
                    <Label htmlFor="address">Full Address</Label>
                    <Input id="address" name="address" value={propertyData.address} onChange={handleChange} required />
                </div>
                <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" name="description" value={propertyData.description} onChange={handleChange} required />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                     <div>
                        <Label htmlFor="price">Price ($)</Label>
                        <Input id="price" name="price" type="number" value={propertyData.price} onChange={handleChange} required />
                    </div>
                    <div>
                        <Label>Property Type</Label>
                        <Select onValueChange={handleSelectChange} required>
                            <SelectTrigger><SelectValue placeholder="Select a type" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="House">House</SelectItem>
                                <SelectItem value="Apartment">Apartment</SelectItem>
                                <SelectItem value="Villa">Villa</SelectItem>
                                <SelectItem value="Commercial">Commercial</SelectItem>
                                <SelectItem value="Land">Land</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label htmlFor="bedrooms">Bedrooms</Label>
                        <Input id="bedrooms" name="bedrooms" type="number" value={propertyData.bedrooms} onChange={handleChange} required />
                    </div>
                    <div>
                        <Label htmlFor="bathrooms">Bathrooms</Label>
                        <Input id="bathrooms" name="bathrooms" type="number" value={propertyData.bathrooms} onChange={handleChange} required />
                    </div>
                </div>
                <div>
                    <Label htmlFor="area">Area (sqft)</Label>
                    <Input id="area" name="area" type="number" value={propertyData.area} onChange={handleChange} required />
                </div>
                <div>
                    <Label htmlFor="amenities">Amenities (comma separated)</Label>
                    <Input id="amenities" name="amenities" placeholder="e.g. Pool, Gym, Parking" value={propertyData.amenities} onChange={handleChange} />
                </div>
                <div>
                    <Label>Image URLs</Label>
                    <p className='text-sm text-muted-foreground mb-2'>In a real app, this would be a file uploader.</p>
                    <div className='space-y-2'>
                        {propertyData.images.map((img, index) => (
                           <Input 
                                key={index} 
                                placeholder={`Image URL ${index + 1}`} 
                                value={img}
                                onChange={(e) => handleImageChange(index, e.target.value)}
                            />
                        ))}
                    </div>
                </div>

                <Button type="submit" className="w-full md:w-auto">List Property</Button>
            </form>
        </div>
    );
}