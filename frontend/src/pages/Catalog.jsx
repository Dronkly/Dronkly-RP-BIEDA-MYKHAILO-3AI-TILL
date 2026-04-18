import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useCart } from '../context/CartContext';

import Header from '../components/Header';

const products = [
  {
    id: 1,
    name: 'Organic Tričko',
    price: 590,
    category: 'Trička',
    material: 'Bio bavlna',
    createdAt: '2026-03-28',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 2,
    name: 'Recyklovaná Mikina',
    price: 1190,
    category: 'Mikiny',
    material: 'Recyklovaný materiál',
    createdAt: '2026-04-10',
    image: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 3,
    name: 'Lněné Kalhoty',
    price: 1490,
    category: 'Kalhoty',
    material: 'Len',
    createdAt: '2026-02-18',
    image: 'https://images.pexels.com/photos/18160750/pexels-photo-18160750.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 4,
    name: 'Přírodní Košile',
    price: 990,
    category: 'Košile',
    material: 'Bio bavlna',
    createdAt: '2026-04-01',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 5,
    name: 'Minimalistická Mikina',
    price: 1290,
    category: 'Mikiny',
    material: 'Organická bavlna',
    createdAt: '2026-03-12',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 6,
    name: 'Basic Top',
    price: 490,
    category: 'Topy',
    material: 'Přírodní vlákna',
    createdAt: '2026-04-14',
    image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=1200&auto=format&fit=crop',
  },
];

const Catalog = () => {
  const navigate = useNavigate();
  const { addToCart, setIsCartOpen } = useCart();
const [searchTerm, setSearchTerm] = useState('');
const [selectedCategory, setSelectedCategory] = useState('Všechny kategorie');
const [sortBy, setSortBy] = useState('Nejnovější');

const categories = ['Všechny kategorie', ...new Set(products.map((p) => p.category))];


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
}, [searchTerm, selectedCategory, sortBy]);

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
            <div key={product.id} className="catalog-card">
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
                <button className="catalog-detail-btn">Detail</button>
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