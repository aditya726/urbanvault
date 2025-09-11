import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api';
import toast from 'react-hot-toast';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, X } from 'lucide-react';

export default function AddProperty() {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [imageFiles, setImageFiles] = useState([]); // --- FIX: State to hold File objects
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
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPropertyData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleSelectChange = (value) => {
        setPropertyData(prev => ({ ...prev, propertyType: value }));
    };

    // --- FIX: New handler for file input change ---
    const handleFileChange = (e) => {
        if (e.target.files) {
            // Limit to 5 files for this example
            const files = Array.from(e.target.files).slice(0, 5);
            setImageFiles(files);
        }
    };

    // --- FIX: New handler to remove a selected image ---
    const handleRemoveImage = (index) => {
        setImageFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (imageFiles.length === 0) {
            toast.error("Please select at least one image.");
            return;
        }
        setIsSubmitting(true);

        // --- FIX: Use FormData to handle file uploads ---
        const formData = new FormData();

        // Append all text data
        Object.keys(propertyData).forEach(key => {
            if (key === 'amenities') {
                // Split amenities into an array and append each one
                const amenitiesArray = propertyData.amenities.split(',').map(item => item.trim()).filter(Boolean);
                amenitiesArray.forEach(amenity => formData.append('amenities', amenity));
            } else {
                formData.append(key, propertyData[key]);
            }
        });

        // Append all image files
        imageFiles.forEach(file => {
            formData.append('images', file);
        });

        try {
            // The API client (axios) will automatically set the correct headers for FormData
            await API.post('/api/properties', formData);
            toast.success('Property listed successfully!');
            navigate('/dashboard/my-listings');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to list property.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">List a New Property</h1>
            <form onSubmit={handleSubmit} className="space-y-8">
                {/* --- Basic Information and Property Details fieldsets remain the same --- */}
                <fieldset className="space-y-4 p-4 border rounded-lg">
                    <legend className="text-lg font-medium px-2">Basic Information</legend>
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
                </fieldset>

                <fieldset className="space-y-4 p-4 border rounded-lg">
                    <legend className="text-lg font-medium px-2">Property Details</legend>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                         <div>
                            <Label htmlFor="price">Price ($)</Label>
                            <Input id="price" name="price" type="number" value={propertyData.price} onChange={handleChange} required />
                        </div>
                        <div>
                            <Label>Property Type</Label>
                            <Select onValueChange={handleSelectChange} value={propertyData.propertyType} required>
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
                </fieldset>

                {/* --- FIX: Updated Media section for file uploads --- */}
                <fieldset className="space-y-4 p-4 border rounded-lg">
                     <legend className="text-lg font-medium px-2">Media</legend>
                    <div>
                        <Label htmlFor='images'>Property Images</Label>
                        <p className='text-sm text-muted-foreground mb-2'>Select at least one image. The first image will be the main thumbnail.</p>
                        <Input 
                            id="images"
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleFileChange}
                            className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                        />
                    </div>
                    {imageFiles.length > 0 && (
                        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-4'>
                            {imageFiles.map((file, index) => (
                                <div key={index} className='relative'>
                                    <img 
                                        src={URL.createObjectURL(file)} 
                                        alt={`preview ${index}`}
                                        className='w-full h-32 object-cover rounded-md'
                                    />
                                    <Button 
                                        type='button'
                                        variant="destructive"
                                        size="icon"
                                        className='absolute top-1 right-1 h-6 w-6 rounded-full'
                                        onClick={() => handleRemoveImage(index)}
                                    >
                                        <X className='h-4 w-4' />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </fieldset>

                <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto">
                    {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</> : "List Property"}
                </Button>
            </form>
        </div>
    );
}