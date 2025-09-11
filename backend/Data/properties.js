const properties = [
    {
        title: "Modern Apartment in Downtown Mumbai",
        description: "A stunning 2-bedroom apartment with panoramic city views, fully furnished and ready to move in. Located in the heart of the city's business district.",
        price: 950000,
        location: "Mumbai",
        address: "123 Business Bay, Colaba, Mumbai",
        bedrooms: 2,
        bathrooms: 2,
        area: 1200,
        propertyType: "Apartment",
        amenities: ["pool", "gym", "parking", "24/7 security"],
        images: [
            "https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg",
            "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg"
        ],
        status: 'available',
    },
    {
        title: "Spacious Villa in Pune",
        description: "A beautiful 4-bedroom villa with a private garden and swimming pool. Perfect for a family looking for a serene and luxurious lifestyle.",
        price: 1500000,
        location: "Pune",
        address: "45 Green Valley, Koregaon Park, Pune",
        bedrooms: 4,
        bathrooms: 4,
        area: 3500,
        propertyType: "Villa",
        amenities: ["pool", "garden", "private parking", "gated community"],
        images: [
            "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg",
            "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg"
        ],
        status: 'available',
    },
    {
        title: "Commercial Office Space in Nagpur",
        description: "Prime commercial space located on a main road with high footfall. Ideal for startups, retail stores, or a corporate office.",
        price: 2000000,
        location: "Nagpur",
        address: "789 Commerce Plaza, Sitabuldi, Nagpur",
        bedrooms: 0,
        bathrooms: 2,
        area: 2500,
        propertyType: "Commercial",
        amenities: ["main road", "parking", "lift access"],
        images: [
            "https://images.pexels.com/photos/267507/pexels-photo-267507.jpeg"
        ],
        status: 'available',
    },
    {
        title: "Cozy 1BHK in Delhi Suburbs",
        description: "A compact and affordable 1BHK apartment, perfect for students or bachelors. Well-connected with public transport.",
        price: 450000,
        location: "Delhi",
        address: "Block C, Sector 15, Noida",
        bedrooms: 1,
        bathrooms: 1,
        area: 600,
        propertyType: "Apartment",
        amenities: ["parking", "near metro"],
        images: [
            "https://images.pexels.com/photos/164558/pexels-photo-164558.jpeg"
        ],
        status: 'sold',
    },
    {
        title: "Agricultural Land near Gondia",
        description: "Fertile agricultural land suitable for various crops. Comes with a reliable water supply and road access.",
        price: 750000,
        location: "Gondia",
        address: "Plot 5, Village Farmland, Gondia District",
        bedrooms: 0,
        bathrooms: 0,
        area: 87120, // 2 acres in sqft
        propertyType: "Land",
        amenities: ["water source", "road access"],
        images: [
            "https://images.pexels.com/photos/259200/pexels-photo-259200.jpeg"
        ],
        status: 'pending',
    }
];

export default properties;