import { Link } from 'react-router-dom';

const PropertyCard = ({ property }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
      <Link to={`/property/${property._id}`}>
        <img
          src={property.images[0] || 'https://placehold.co/600x400'}
          alt={property.title}
          className="w-full h-56 object-cover"
        />
        <div className="p-4">
          <h3 className="text-xl font-semibold text-gray-800 truncate">{property.title}</h3>
          <p className="text-gray-600 mt-1">{property.location}</p>
          <div className="flex justify-between items-center mt-4">
            <p className="text-lg font-bold text-indigo-600">
              ${new Intl.NumberFormat().format(property.price)}
            </p>
            <div className="text-sm text-gray-500">
              <span>{property.bedrooms} beds</span> &middot; <span>{property.bathrooms} baths</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default PropertyCard;