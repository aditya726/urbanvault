import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import API from '../api';
import { PropertyCard } from '../components/PropertyCard';

export default function Home() {
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await API.get('/api/properties?limit=3'); // Assuming your API can take a limit
        setFeaturedProperties(data);
      } catch (error) {
        console.error("Failed to fetch featured properties:", error);
      }
    };
    fetchFeatured();
  }, []);
  
  const handleSearch = (e) => {
    e.preventDefault();
    if(searchQuery.trim()){
      navigate(`/properties?location=${searchQuery}`);
    }
  }

  return (
    <div className="container mx-auto">
      {/* Hero Section */}
      <section className="text-center py-20 bg-gray-50 rounded-lg my-8">
        <h1 className="text-5xl font-bold mb-4 tracking-tight">Find Your Next Perfect Home</h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          The best place to find the house of your dreams. Let's get started by searching for a location.
        </p>
        <form onSubmit={handleSearch} className="flex max-w-2xl mx-auto">
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Enter a location, city, or address"
            className="rounded-r-none h-12 text-lg"
          />
          <Button type="submit" className="rounded-l-none h-12">Search</Button>
        </form>
      </section>

      {/* Featured Properties Section */}
      <section className="py-12">
        <h2 className="text-3xl font-bold text-center mb-8">Featured Properties</h2>
        {featuredProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredProperties.map(prop => <PropertyCard key={prop._id} property={prop} />)}
            </div>
        ) : (
            <p className="text-center text-muted-foreground">Loading featured properties...</p>
        )}
      </section>
    </div>
  );
}