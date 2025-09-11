import { NavLink, Outlet, Navigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { List, PlusCircle, Heart } from 'lucide-react';

const sidebarNavItems = [
    { title: "My Listings", href: "/dashboard/my-listings", icon: <List className='h-4 w-4' /> },
    { title: "Add Property", href: "/dashboard/add-property", icon: <PlusCircle className='h-4 w-4' /> },
    { title: "Wishlist", href: "/dashboard/wishlist", icon: <Heart className='h-4 w-4' /> },
];

export default function DashboardLayout() {
    const { user } = useAuth();

    if (!user) {
        // Redirect them to the /login page, but save the current location they were
        // trying to go to. This allows us to send them along to that page after they
        // log in, which is a nicer user experience than dropping them off on the home page.
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="container mx-auto py-8">
            <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
                <aside className="-mx-4 lg:w-1/5">
                    <nav className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
                        {sidebarNavItems.map((item) => (
                            <NavLink
                                key={item.title}
                                to={item.href}
                                className={({ isActive }) => 
                                    `inline-flex items-center gap-2 rounded-md p-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground ${isActive ? 'bg-accent' : 'transparent'}`
                                }
                            >
                                {item.icon} {item.title}
                            </NavLink>
                        ))}
                    </nav>
                </aside>
                <div className="flex-1">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}