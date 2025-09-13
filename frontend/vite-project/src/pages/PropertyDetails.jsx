import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Star, BedDouble, Bath, Square, Mail, Share2, Heart, CalendarDays } from 'lucide-react';

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

  if (isLoading) return <div className="container py-20 text-center">Loading...</div>;
  if (!property) return <div className="container py-20 text-center">Property not found.</div>;

  const mainImage = property.images?.[0] || 'https://placehold.co/1200x800';
  const galleryImages = property.images?.slice(1, 5) || [];

  return (
    <div className="container mx-auto max-w-screen-2xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
        {/* --- Left Pane: Scrollable Content --- */}
        <div className="w-full lg:w-[65%]">
          {/* Header */}
          <div className="mb-4">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{property.title}</h1>
            <div className="mt-2 flex items-center justify-between">
                <p className="text-muted-foreground">{property.address}, {property.location}</p>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="flex items-center gap-2"><Share2 className="h-4 w-4" /> Share</Button>
                    <Button variant="ghost" size="sm" className="flex items-center gap-2"><Heart className="h-4 w-4" /> Save</Button>
                </div>
            </div>
          </div>

          {/* Image Gallery */}
          <div className="mb-8 grid h-[500px] grid-cols-4 grid-rows-2 gap-2 overflow-hidden rounded-xl">
            <div className="col-span-4 sm:col-span-2 sm:row-span-2">
                <img src={mainImage} alt={property.title} className="h-full w-full object-cover"/>
            </div>
            {galleryImages.map((img, index) => (
                <div key={index} className="hidden sm:block">
                    <img src={img} alt={`${property.title}-${index + 1}`} className="h-full w-full object-cover"/>
                </div>
            ))}
          </div>

          <Separator className="my-8" />

          {/* Property Details */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-semibold">Hosted by {property.seller.username}</h2>
              <div className="mt-4 flex items-center gap-6 rounded-lg border p-4">
                  <span className="flex items-center gap-2 text-lg"><BedDouble className="h-5 w-5 text-primary" /> {property.bedrooms} Beds</span>
                  <span className="flex items-center gap-2 text-lg"><Bath className="h-5 w-5 text-primary" /> {property.bathrooms} Baths</span>
                  <span className="flex items-center gap-2 text-lg"><Square className="h-5 w-5 text-primary" /> {property.area} sqft</span>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold">About this property</h3>
              <p className="mt-4 leading-relaxed text-muted-foreground">{property.description}</p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold">Amenities</h3>
              <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 md:grid-cols-3">
                {property.amenities.map(amenity => (
                  <div key={amenity} className="flex items-center gap-3 py-2">
                    <span className="text-primary">&#10003;</span>
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* --- Right Pane: Sticky Action Panel --- */}
        <div className="w-full lg:w-[35%]">
          <div className="sticky top-24">
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-baseline justify-between">
                  <span className="text-3xl font-bold">${property.price.toLocaleString()}</span>
                   <div className="flex items-center gap-1 text-sm font-normal text-muted-foreground">
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                        <span>{property.seller.averageRating || 'New'} ({property.seller.totalSales || 0} reviews)</span>
                    </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid w-full items-center gap-1.5">
                            <Label htmlFor="checkin">Check-in</Label>
                            <Input id="checkin" type="text" placeholder="Add date" icon={CalendarDays} />
                        </div>
                         <div className="grid w-full items-center gap-1.5">
                            <Label htmlFor="checkout">Check-out</Label>
                            <Input id="checkout" type="text" placeholder="Add date" icon={CalendarDays} />
                        </div>
                    </div>
                    <Button size="lg" className="w-full text-lg">
                        Request to Book
                    </Button>
                </div>
                <Separator className="my-6" />
                <div className="text-center">
                    <p className="font-semibold">{property.seller.username}</p>
                    <a href={`mailto:${property.seller.email}`} className="mt-1 flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-primary">
                        <Mail className="h-4 w-4" /> Contact Seller
                    </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

// A small modification to your Input component might be needed to accept an icon
// For example, in your components/ui/input.jsx
/*
const Input = React.forwardRef(({ className, type, icon: Icon, ...props }, ref) => {
  return (
    <div className="relative">
      {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />}
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          Icon ? "pl-9" : "",
          className
        )}
        ref={ref}
        {...props}
      />
    </div>
  );
});
*/