import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Hero from "./components/Hero";
import Values from "./components/Values";
import Products from "./components/Products";
import Story from "./components/Story";
import Reviews from "./components/Reviews";
import Newsletter from "./components/Newsletter";
import Footer from "./components/Footer";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Register from "./pages/Register";

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
    
      <Routes>
        {/* homepage */}
        <Route path="/" element={<Home />} />

        {/* login */}
        <Route path="/login" element={<Login />} />

        {/* dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/*register*/}
        <Route path="/register" element={<Register />} />
      </Routes>
   
  );
}