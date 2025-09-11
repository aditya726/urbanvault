import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../../api';
import { PropertyCard } from '../../components/PropertyCard';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';

export default function Wishlist() {
    const [wishlistItems, setWishlistItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchWishlist = async () => {
            try {
                const { data } = await API.get('/api/users/wishlist');
                setWishlistItems(data);
            } catch (error) {
                console.error('Failed to fetch wishlist', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchWishlist();
    }, []);

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">My Wishlist</h1>
            {isLoading ? (
                <p>Loading your wishlist...</p>
            ) : wishlistItems.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wishlistItems.map(property => <PropertyCard key={property._id} property={property} />)}
                </div>
            ) : (
                <div className="text-center py-16 border-2 border-dashed rounded-lg">
                     <Heart className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-xl font-semibold">Your wishlist is empty.</h3>
                    <p className="text-muted-foreground mt-2 mb-4">Browse properties and click the heart to save them here.</p>
                    <Button asChild>
                         <Link to="/properties">Find Properties</Link>
                    </Button>
                </div>
            )}
        </div>
    )
}