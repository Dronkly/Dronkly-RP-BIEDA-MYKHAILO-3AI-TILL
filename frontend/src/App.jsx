import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Hero from "./components/Hero";
import Values from "./components/Values";
import Products from "./components/Products";
import Story from "./components/Story";
import Reviews from "./components/Reviews";
import Newsletter from "./components/Newsletter";
import Footer from "./components/Footer";
import { CartProvider } from './context/CartContext';

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import About from "./pages/About";
import Catalog from "./pages/Catalog";
import ProductDetail from "./pages/ProductDetail";

import CartDrawer from "./components/CartDrawer";
import Header from "./components/Header";

 function Home() {
  return (
    
      
        
    <div>
      <Hero />
      <Values />
      <Products />
      <Story />
      <Reviews />
      <Newsletter />
      <Footer />
      
    </div>
     
   
  );
}

export default function App() {
  return (

    <BrowserRouter>
     <CartProvider>
      <CartDrawer />
      <Routes>
        {/* homepage */}
        <Route path="/" element={<Home />} />

        {/* login */}
        <Route path="/login" element={<Login />} />

        {/* dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/*register*/}
        <Route path="/register" element={<Register />} />
        {/*Profile submenu */}
        <Route path="/profile" element={<Profile />} />

        {/*O nas */}
        <Route path="/about" element={<About />} />

         {/*Detail o produktu */}
        <Route path="/product/:id" element={<ProductDetail />} />


               {/*Katalog pro nakupy */}
        <Route path="/catalog" element={<Catalog />} />
      </Routes>
      </CartProvider>
      </BrowserRouter>
   
  );
}