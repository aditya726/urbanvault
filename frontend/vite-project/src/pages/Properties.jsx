import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import API from '../api';
import { PropertyCard } from "../components/PropertyCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from '@/components/ui/separator';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

export default function Properties() {
    const query = useQuery();
    const [properties, setProperties] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState({
        location: query.get('location') || '',
        propertyType: 'All',
        minPrice: '',
        maxPrice: '',
    });

    useEffect(() => {
        const fetchProperties = async () => {
            setIsLoading(true);
            try {
                // Remove empty filter values before sending
                const activeFilters = Object.fromEntries(
                    Object.entries(filters).filter(([_, v]) => v !== '' && v !== 'All')
                );
                const { data } = await API.get('/api/properties', { params: activeFilters });
                setProperties(data);
            } catch (error) {
                console.error("Failed to fetch properties:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProperties();
    }, [filters]);

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    return (
        <div className="container mx-auto py-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Filters Sidebar */}
                <aside className="lg:col-span-1 p-4 border rounded-lg h-fit bg-card">
                    <h3 className="font-bold text-xl mb-4">Filter Properties</h3>
                    <Separator />
                    <div className="space-y-4 mt-4">
                        <Input 
                            placeholder="Location (e.g., California)" 
                            value={filters.location}
                            onChange={(e) => handleFilterChange('location', e.target.value)}
                        />
                         <Select onValueChange={(value) => handleFilterChange('propertyType', value)} defaultValue="All">
                            <SelectTrigger>
                                <SelectValue placeholder="Property Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="All">All Types</SelectItem>
                                <SelectItem value="House">House</SelectItem>
                                <SelectItem value="Apartment">Apartment</SelectItem>
                                <SelectItem value="Villa">Villa</SelectItem>
                                <SelectItem value="Commercial">Commercial</SelectItem>
                                <SelectItem value="Land">Land</SelectItem>
                            </SelectContent>
                        </Select>
                        <div className='flex gap-2'>
                           <Input 
                                placeholder="Min Price" 
                                type="number" 
                                value={filters.minPrice}
                                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                            />
                           <Input 
                                placeholder="Max Price" 
                                type="number" 
                                value={filters.maxPrice}
                                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                            />
                        </div>
                    </div>
                </aside>

                {/* Property Listings */}
                <main className="lg:col-span-3">
                     <h2 className="text-2xl font-bold mb-4">
                        {properties.length} Results Found
                    </h2>
                    {isLoading ? (
                        <p>Loading properties...</p>
                    ) : properties.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {properties.map((property) => (
                                <PropertyCard key={property._id} property={property} />
                            ))}
                        </div>
                    ) : (
                        <div className='text-center py-20 bg-gray-50 rounded-lg'>
                            <h3 className='text-2xl font-semibold'>No Properties Found</h3>
                            <p className='text-muted-foreground mt-2'>Try adjusting your filters to find what you're looking for.</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}