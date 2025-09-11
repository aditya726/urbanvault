import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true); 
  const navigate = useNavigate();

  useEffect(() => {
    // --- FIX: Wrap logic in try/finally to ensure loading state is always updated ---
    try {
      const storedUser = localStorage.getItem('userInfo');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
        console.error("Failed to parse user info, logging out.", error);
        localStorage.removeItem('userInfo');
    } finally {
      setIsAuthLoading(false); 
    }
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await API.post('/api/users/login', { email, password });
      localStorage.setItem('userInfo', JSON.stringify(data));
      setUser(data);
      toast.success('Logged in successfully!');
      navigate('/dashboard/my-listings');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    }
  };

  const register = async (username, email, password) => {
    try {
        const { data } = await API.post('/api/users/register', { username, email, password });
        localStorage.setItem('userInfo', JSON.stringify(data));
        setUser(data);
        toast.success('Registration successful!');
        navigate('/dashboard/my-listings');
    } catch (error) {
        toast.error(error.response?.data?.message || 'Registration failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
    navigate('/login');
    toast.success('Logged out.');
  };

  const toggleWishlist = async (propertyId) => {
    if (!user) {
        toast.error("You must be logged in to save properties.");
        return navigate('/login');
    }
    try {
        const { data } = await API.post('/api/users/wishlist', { propertyId });
        // Update user state to reflect wishlist change
        const updatedUser = { ...user, wishlist: data.wishlist };
        setUser(updatedUser);
        localStorage.setItem('userInfo', JSON.stringify(updatedUser));
        toast.success(data.message);
    } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to update wishlist');
    }
  };

  return (
    // --- FIX: Expose isAuthLoading in the provider's value ---
    <AuthContext.Provider value={{ user, isAuthLoading, login, register, logout, toggleWishlist }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;