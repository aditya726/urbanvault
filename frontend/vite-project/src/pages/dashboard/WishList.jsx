import { useEffect, useState } from 'react';
import API from '../../api';
import { PropertyCard } from '../../components/PropertyCard';

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
                <p>You haven't added any properties to your wishlist yet.</p>
            )}
        </div>
    )
}