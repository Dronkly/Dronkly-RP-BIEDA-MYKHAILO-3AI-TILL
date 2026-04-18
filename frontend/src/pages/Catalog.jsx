import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';



import Header from '../components/Header';
import { useCart } from '../context/CartContext';



const Catalog = () => {
  const navigate = useNavigate();
  const { addToCart, setIsCartOpen } = useCart();

  const [products, setProducts] = useState([]);
const [loading, setLoading] = useState(true);

const [searchTerm, setSearchTerm] = useState('');
const [selectedCategory, setSelectedCategory] = useState('Všechny kategorie');
const [sortBy, setSortBy] = useState('Nejnovější');

const categories = ['Všechny kategorie', ...new Set(products.map((p) => p.category))];
useEffect(() => {
  fetchProducts();
}, []);

const fetchProducts = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/products');
    setProducts(response.data);
  } catch (error) {
    console.error('Chyba při načítání produktů:', error);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  fetchProducts();
}, []);


  const handleBuy = (product) => {
  addToCart(product);
  setIsCartOpen(true);
};

const filteredProducts = useMemo(() => {
  let result = [...products];

  result = result.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (selectedCategory !== 'Všechny kategorie') {
    result = result.filter((product) => product.category === selectedCategory);
  }

  if (sortBy === 'Nejnovější') {
    result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } else if (sortBy === 'Od nejlevnějších') {
    result.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'Od nejdražších') {
    result.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'A–Z') {
    result.sort((a, b) => a.name.localeCompare(b.name, 'cs'));
  }

  return result;
}, [products, searchTerm, selectedCategory, sortBy]);

if (loading) {
  return (
    <>
      <Header />
      <div className="catalog-page">
        <div className="catalog-shell">
          <p>Načítání produktů...</p>
        </div>
      </div>
    </>
  );
}

  return (
      <>
      <Header />
     
    <div className="catalog-page">
       
      <div className="catalog-shell">
        <div className="catalog-header">
          <div>
            <p className="catalog-eyebrow">Kolekce</p>
            <h1>Prohlédnout kolekci</h1>
            <p className="catalog-subtitle">
              Objev jednoduché, pohodlné a nadčasové kousky inspirované
              moderním a odpovědnějším přístupem k módě.
            </p>
          </div>

          <button className="catalog-back-btn" onClick={() => navigate('/')}>
            Zpět na domů
          </button>
        </div>

       <div className="catalog-toolbar">
  <input
    type="text"
    placeholder="Hledat produkt..."
    className="catalog-search"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
  />

  <select
    className="catalog-select"
    value={selectedCategory}
    onChange={(e) => setSelectedCategory(e.target.value)}
  >
    {categories.map((category) => (
      <option key={category} value={category}>
        {category}
      </option>
    ))}
  </select>

  <select
    className="catalog-select"
    value={sortBy}
    onChange={(e) => setSortBy(e.target.value)}
  >
    <option value="Nejnovější">Nejnovější</option>
    <option value="Od nejlevnějších">Od nejlevnějších</option>
    <option value="Od nejdražších">Od nejdražších</option>
    <option value="A–Z">A–Z</option>
  </select>
</div>
          <p className="catalog-results-count">
            Počet nalezených produktů: <strong>{filteredProducts.length}</strong>
          </p>
        <div className="catalog-grid">
         {filteredProducts.map((product) => (
            <div key={product._id} className="catalog-card">
              <div className="catalog-image-wrap">
                <img src={product.image} alt={product.name} />
              </div>

              <div className="catalog-card-content">
                <p className="catalog-category">{product.category}</p>
                <h3>{product.name}</h3>
                <p className="catalog-material">{product.material}</p>
                <p className="catalog-date">
                    Přidáno: {new Date(product.createdAt).toLocaleDateString('cs-CZ')}
                  </p>

                <div className="catalog-card-bottom">
                <span className="catalog-price">{product.price} Kč</span>

                <div className="catalog-actions">
                <button
                  className="catalog-detail-btn"
                  onClick={() => navigate(`/product/${product._id}`)}
                >
                   Detail
               </button>
               <button
                 className="catalog-buy-btn"
                 onClick={() => handleBuy(product)}
               >
                 Koupit
               </button>
                 </div>
              </div>
               

              </div>
            </div>
          ))}
        </div>
        {filteredProducts.length === 0 && (
            <div className="catalog-empty">
              <p>Žádné produkty neodpovídají zadanému filtru.</p>
            </div>
          )}
      </div>
    </div>
  </>
  );
};



export default Catalog;