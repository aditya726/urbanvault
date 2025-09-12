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

  if (isLoading) return <div className="container text-center py-20">Loading Details...</div>;
  if (!property) return <div className="container text-center py-20">Property not found.</div>;

  const mainImage = property.images[0] || 'https://placehold.co/1200x800';
  const galleryImages = property.images.slice(1, 5);

  return (
    <div className="container mx-auto py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl">
      {/* --- Image Gallery --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 md:grid-rows-2 gap-2 mb-8 max-h-[550px]">
        <div className="md:row-span-2">
            <img src={mainImage} alt={property.title} className="w-full h-full object-cover rounded-lg" />
        </div>
        {galleryImages.map((img, index) => (
            <div key={index} className={index > 1 ? 'hidden md:block' : ''}>
                 <img src={img} alt={`${property.title}-${index + 1}`} className="w-full h-full object-cover rounded-lg" />
            </div>
        ))}
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        {/* --- Main Details --- */}
        <div className="lg:col-span-2">
            <Badge variant="secondary">{property.propertyType}</Badge>
            <h1 className="text-3xl sm:text-4xl font-bold mt-2">{property.title}</h1>
            <p className="text-muted-foreground mt-2">{property.address}, {property.location}</p>

            <div className="flex items-center flex-wrap gap-x-6 gap-y-2 text-lg my-6">
                <span className="flex items-center gap-2"><BedDouble className="text-primary h-5 w-5" /> {property.bedrooms} Beds</span>
                <span className="flex items-center gap-2"><Bath className="text-primary h-5 w-5" /> {property.bathrooms} Baths</span>
                <span className="flex items-center gap-2"><Square className="text-primary h-5 w-5" /> {property.area} sqft</span>
            </div>
            
            <div className="space-y-8">
                <div>
                    <h2 className="text-2xl font-semibold border-b pb-2">Description</h2>
                    <p className="mt-4 text-muted-foreground leading-relaxed">{property.description}</p>
                </div>

                <div>
                    <h2 className="text-2xl font-semibold border-b pb-2">Amenities</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                        {property.amenities.map(amenity => (
                            <div key={amenity} className="bg-slate-100 p-3 rounded-md text-sm sm:text-base text-center">{amenity}</div>
                        ))}
                    </div>
                </div>
            </div>
        </div>

        {/* --- Seller Info & Price --- */}
        <div className="lg:col-span-1">
            <div className="sticky top-24 p-6 border rounded-lg bg-card shadow-sm">
                <p className="text-3xl font-bold text-primary mb-6">${property.price.toLocaleString()}</p>
                <h3 className="text-xl font-semibold mb-4">Listed by</h3>
                <div className="flex items-center gap-4">
                    <img src={property.seller.profilePicture || `https://avatar.vercel.sh/${property.seller.username}.png`} alt={property.seller.username} className="h-16 w-16 rounded-full" />
                    <div>
                        <p className="font-bold">{property.seller.username}</p>
                         <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Star className="w-4 h-4 text-amber-400 fill-current" />
                            <span>{property.seller.averageRating || 'N/A'} ({property.seller.totalSales || 0} reviews)</span>
                        </div>
                    </div>
                </div>
                 <div className='space-y-3 mt-6 border-t pt-4'>
                    <p className='flex items-center gap-2 text-muted-foreground'><User className='w-4 h-4' /> {property.seller.username}</p>
                    <p className='flex items-center gap-2 text-muted-foreground'><Mail className='w-4 h-4' /> {property.seller.email}</p>
                 </div>
            </div>
        </div>
      </div>
    </div>
  );
}