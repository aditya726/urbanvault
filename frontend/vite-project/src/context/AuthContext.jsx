import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const backendUrl = import.meta.env.VITE_API_URL;
  useEffect(() => {
    const storedUser = localStorage.getItem('userInfo');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email, password) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const { data } = await axios.post(`${backendUrl}/api/users/login`, { email, password }, config);
      localStorage.setItem('userInfo', JSON.stringify(data));
      setUser(data);
      toast.success('Logged in successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid email or password');
    }
  };

  const register = async (username, email, password, phoneNumber) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const { data } = await axios.post(`${backendUrl}/api/users/register`, { username, email, password, phoneNumber }, config);
      localStorage.setItem('userInfo', JSON.stringify(data));
      setUser(data);
      toast.success('Registered successfully!');
    } catch (error) {
       toast.error(error.response?.data?.message || 'Registration failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
    toast.success('Logged out successfully!');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;