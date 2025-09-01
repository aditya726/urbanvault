import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const PrivateRoute = () => {
  const { user } = useAuth();
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export const SellerRoute = () => {
    const { user } = useAuth();
    return user && user.role === 'seller' ? <Outlet /> : <Navigate to="/login" replace />;
}

export default PrivateRoute;