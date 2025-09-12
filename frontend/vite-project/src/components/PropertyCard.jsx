import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from './ui/button';
import { BedDouble, Bath, Square, Heart } from "lucide-react";
import useAuth from '../hooks/useAuth';

export function PropertyCard({ property }) {
    const { user, toggleWishlist } = useAuth();
    
    // Check if the property is in the user's wishlist
    const isFavorite = user?.wishlist?.includes(property._id);

    return (
        <Card className="w-full overflow-hidden transition-all hover:shadow-lg flex flex-col">
            <Link to={`/property/${property._id}`} className="flex flex-col flex-grow">
                <CardHeader className="p-0 relative">
                    <img
                        src={property.images[0] || 'https://placehold.co/600x400/EFEFEF/AAAAAA?text=No+Image'}
                        alt={property.title}
                        className="h-56 w-full object-cover"
                    />
                     <Badge variant="secondary" className="absolute top-3 left-3">{property.propertyType}</Badge>
                </CardHeader>
                <CardContent className="p-4 flex-grow">
                    <p className="text-2xl font-bold text-primary">
                        ${property.price.toLocaleString()}
                    </p>
                    <h3 className="text-lg font-semibold mt-1 truncate">{property.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1 truncate">{property.address}</p>
                </CardContent>
            </Link>
            <CardFooter className="flex justify-between items-center p-4 bg-slate-50 border-t">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5"><BedDouble className="h-4 w-4" /> {property.bedrooms}</span>
                    <span className="flex items-center gap-1.5"><Bath className="h-4 w-4" /> {property.bathrooms}</span>
                    <span className="flex items-center gap-1.5"><Square className="h-4 w-4" /> {property.area} sqft</span>
                </div>
                 <Button variant="ghost" size="icon" className="rounded-full" onClick={() => toggleWishlist(property._id)}>
                    <Heart className={`w-5 h-5 transition-colors ${isFavorite ? 'text-red-500 fill-current' : 'text-gray-400 hover:text-red-500'}`} />
                </Button>
            </CardFooter>
        </Card>
    );
}
