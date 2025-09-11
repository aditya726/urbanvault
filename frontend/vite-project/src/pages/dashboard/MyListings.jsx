import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../../api';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Pencil } from 'lucide-react';

export default function MyListings() {
    const [myProperties, setMyProperties] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchMyProperties = async () => {
        setIsLoading(true);
        try {
            const { data } = await API.get('/api/properties/my-listings');
            setMyProperties(data);
        } catch (error) {
            console.error("Failed to fetch user's properties", error);
            toast.error("Could not fetch your properties.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMyProperties();
    }, []);

    const handleDelete = async (propertyId) => {
        if (window.confirm("Are you sure you want to delete this property? This cannot be undone.")) {
            try {
                await API.delete(`/api/properties/${propertyId}`);
                toast.success("Property deleted successfully.");
                // Refetch properties to update the list
                fetchMyProperties();
            } catch (error) {
                toast.error("Failed to delete property.");
            }
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">My Property Listings</h1>
                <Button asChild>
                    <Link to="/dashboard/add-property">Add New Property</Link>
                </Button>
            </div>

            {isLoading ? (
                <p>Loading your listings...</p>
            ) : myProperties.length > 0 ? (
                <div className="space-y-4">
                    {myProperties.map(property => (
                        <Card key={property._id}>
                            <div className="flex items-center">
                                <img src={property.images[0]} alt={property.title} className="w-40 h-32 object-cover rounded-l-lg" />
                                <div className="flex-grow">
                                    <CardHeader>
                                        <CardTitle>{property.title}</CardTitle>
                                        <CardDescription>{property.address}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="font-semibold">${property.price.toLocaleString()}</p>
                                    </CardContent>
                                </div>
                                <CardFooter className="flex gap-2 p-6">
                                    <Button variant="outline" size="icon" disabled>
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button variant="destructive" size="icon" onClick={() => handleDelete(property._id)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </CardFooter>
                            </div>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 border-2 border-dashed rounded-lg">
                    <h3 className="text-xl font-semibold">You haven't listed any properties yet.</h3>
                    <p className="text-muted-foreground mt-2 mb-4">Let's get started!</p>
                    <Button asChild>
                         <Link to="/dashboard/add-property">List Your First Property</Link>
                    </Button>
                </div>
            )}
        </div>
    );
}