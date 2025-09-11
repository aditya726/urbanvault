import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api';
import { Badge } from '@/components/ui/badge';
import { Star, BedDouble, Bath, Square, User, Mail, Phone } from 'lucide-react';

export default function PropertyDetails() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const { data } = await API.get(`/api/properties/${id}`);
        setProperty(data);
      } catch (error) {
        console.error("Failed to fetch property details:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  if (isLoading) return <p className="text-center py-10">Loading Details...</p>;
  if (!property) return <p className="text-center py-10">Property not found.</p>;

  return (
    <div className="container mx-auto py-10">
      {/* Image Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-8">
        <img src={property.images[0]} alt={property.title} className="w-full h-96 object-cover rounded-lg" />
        <div className="grid grid-cols-2 gap-2">
            {property.images.slice(1, 5).map((img, index) => (
                <img key={index} src={img} alt={`${property.title}-${index}`} className="w-full h-full object-cover rounded-lg" />
            ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Details */}
        <div className="lg:col-span-2">
            <Badge variant="secondary">{property.propertyType}</Badge>
            <h1 className="text-4xl font-bold mt-2">{property.title}</h1>
            <p className="text-muted-foreground mt-2">{property.address}, {property.location}</p>

            <div className="flex items-center gap-6 text-lg my-6">
                <span className="flex items-center gap-2"><BedDouble className="text-primary" /> {property.bedrooms} Beds</span>
                <span className="flex items-center gap-2"><Bath className="text-primary" /> {property.bathrooms} Baths</span>
                <span className="flex items-center gap-2"><Square className="text-primary" /> {property.area} sqft</span>
            </div>
            
            <h2 className="text-2xl font-semibold border-b pb-2">Description</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">{property.description}</p>

            <h2 className="text-2xl font-semibold border-b pb-2 mt-8">Amenities</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                {property.amenities.map(amenity => (
                    <div key={amenity} className="bg-slate-100 p-3 rounded-md text-center">{amenity}</div>
                ))}
            </div>
        </div>

        {/* Seller Info & Price */}
        <div className="lg:col-span-1">
            <div className="sticky top-24 p-6 border rounded-lg bg-card">
                <p className="text-3xl font-bold text-primary mb-6">${property.price.toLocaleString()}</p>
                <h3 className="text-xl font-semibold mb-4">Listed by</h3>
                <div className="flex items-center gap-4">
                    <img src={property.seller.profilePicture} alt={property.seller.username} className="h-16 w-16 rounded-full" />
                    <div>
                        <p className="font-bold">{property.seller.username}</p>
                         <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Star className="w-4 h-4 text-amber-400 fill-current" />
                            <span>{property.seller.averageRating} ({property.seller.totalSales} reviews)</span>
                        </div>
                    </div>
                </div>
                 <div className='space-y-3 mt-6'>
                    <p className='flex items-center gap-2'><User className='w-4 h-4 text-muted-foreground' /> {property.seller.username}</p>
                    <p className='flex items-center gap-2'><Mail className='w-4 h-4 text-muted-foreground' /> {property.seller.email}</p>
                 </div>
            </div>
        </div>
      </div>
    </div>
  );
}