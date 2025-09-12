import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Properties from './pages/Properties';
import PropertyDetails from './pages/PropertyDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardLayout from './components/layout/DashboardLayout';
import MyListings from './pages/dashboard/MyListings';
import AddProperty from './pages/dashboard/AddProperty';
import Wishlist from './pages/dashboard/Wishlist';
import ProfilePage from './pages/userProfile';

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/property/:id" element={<PropertyDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path='/Profile' element = {<ProfilePage />}/>

          {/* Dashboard Nested Routes */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route path="my-listings" element={<MyListings />} />
            <Route path="add-property" element={<AddProperty />} />
            <Route path="wishlist" element={<Wishlist />} />
          </Route>
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;