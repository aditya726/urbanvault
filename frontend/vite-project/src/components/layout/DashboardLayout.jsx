import { NavLink, Outlet, Navigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { List, PlusCircle, Heart, Loader2 } from 'lucide-react';

const sidebarNavItems = [
    { title: "My Listings", href: "/dashboard/my-listings", icon: <List className='h-4 w-4' /> },
    { title: "Add Property", href: "/dashboard/add-property", icon: <PlusCircle className='h-4 w-4' /> },
    { title: "Wishlist", href: "/dashboard/wishlist", icon: <Heart className='h-4 w-4' /> },
];

export default function DashboardLayout() {
    const { user, isAuthLoading } = useAuth(); // --- FIX: Get isAuthLoading from context

    // --- FIX: Show a loading state while checking for user authentication ---
    if (isAuthLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    // --- FIX: This check now runs only after the loading is complete ---
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
            <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
                <aside className="lg:w-1/5">
                    <nav className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
                        {sidebarNavItems.map((item) => (
                            <NavLink
                                key={item.title}
                                to={item.href}
                                className={({ isActive }) => 
                                    `inline-flex items-center gap-2 rounded-md py-2 px-3 text-sm font-medium transition-colors shrink-0 ${isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-accent hover:text-accent-foreground'}`
                                }
                            >
                                {item.icon} {item.title}
                            </NavLink>
                        ))}
                    </nav>
                </aside>
                <div className="flex-1 min-w-0">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}