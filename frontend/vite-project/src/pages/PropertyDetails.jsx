import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Star, BedDouble, Bath, Square, Mail, Share2, Heart, CalendarDays } from 'lucide-react';
import useAuth from '@/hooks/useAuth';
import { BookingModal } from '@/components/BookingModal';
import { ReviewForm } from '@/components/ReviewForm';

export default function PropertyDetails() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const { user, toggleWishlist  } = useAuth();

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
    
    const fetchReviews = async () => {
      try {
        const { data } = await API.get(`/api/reviews/property/${id}`);
        setReviews(data.reviews || []);
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
      }
    };
    
    fetchProperty();
    fetchReviews();
  }, [id]);

  const handleReviewSubmitted = (newReview) => {
    setReviews(prev => [newReview, ...prev]);
  };

  if (isLoading) return <div className="container py-20 text-center">Loading...</div>;
  if (!property) return <div className="container py-20 text-center">Property not found.</div>;

  const mainImage = property.images?.[0] || 'https://placehold.co/1200x800';
  const galleryImages = property.images?.slice(1, 5) || [];

  // Check if the current property is in the user's wishlist
  const isFavorite = user?.wishlist?.includes(property._id);

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
                    <Button variant="ghost" size="sm" className="flex items-center gap-2">
                        <Share2 className="h-4 w-4" /> Share
                    </Button>
                    {/* Updated Save Button with Wishlist Logic */}
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="flex items-center gap-2" 
                      onClick={() => toggleWishlist(property._id)}
                    >
                      <Heart className={`h-4 w-4 transition-colors ${isFavorite ? 'text-red-500 fill-current' : 'text-gray-500'}`} /> 
                      {isFavorite ? 'Saved' : 'Save'}
                    </Button>
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
                    <Button 
                      size="lg" 
                      className="w-full text-lg" 
                      onClick={() => user ? setShowBookingModal(true) : window.location.href = '/login'}
                      disabled={property.seller._id === user?._id}
                    >
                      <CalendarDays className="mr-2 h-5 w-5" />
                      {property.seller._id === user?._id ? 'Your Property' : 'Book a Viewing'}
                    </Button>
                    {property.seller._id === user?._id && (
                      <p className="text-xs text-center text-muted-foreground">You cannot book your own property</p>
                    )}
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

      {/* Reviews Section */}
      <div className="mt-16 max-w-7xl mx-auto">
        <Separator className="my-8" />
        <h2 className="text-2xl font-bold mb-6">Reviews</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Review Form */}
          {user && property.seller._id !== user._id && (
            <div>
              <ReviewForm 
                property={property} 
                sellerId={property.seller._id} 
                onReviewSubmitted={handleReviewSubmitted}
              />
            </div>
          )}
          
          {/* Reviews List */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              {reviews.length} {reviews.length === 1 ? 'Review' : 'Reviews'}
            </h3>
            
            {reviews.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  No reviews yet. Be the first to review this property!
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                {reviews.map((review) => (
                  <Card key={review._id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <img 
                          src={review.buyer.profilePicture || `https://avatar.vercel.sh/${review.buyer.username}.png`}
                          alt={review.buyer.username}
                          className="h-10 w-10 rounded-full"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-semibold">{review.buyer.username}</p>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`h-4 w-4 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(review.createdAt).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </p>
                          {review.comment && (
                            <p className="mt-3 text-sm leading-relaxed">{review.comment}</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <BookingModal 
          property={property}
          onClose={() => setShowBookingModal(false)}
          onBookingSuccess={() => {
            setShowBookingModal(false);
          }}
        />
      )}
    </div>
  );
}