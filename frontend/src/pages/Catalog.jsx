import React from 'react';
import { useNavigate } from 'react-router-dom';

const products = [
  {
    id: 1,
    name: 'Organic Tričko',
    price: '590 Kč',
    category: 'Trička',
    material: 'Bio bavlna',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 2,
    name: 'Recyklovaná Mikina',
    price: '1190 Kč',
    category: 'Mikiny',
    material: 'Recyklovaný materiál',
    image: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 3,
    name: 'Lněné Kalhoty',
    price: '1490 Kč',
    category: 'Kalhoty',
    material: 'Len',
    image: 'https://images.unsplash.com/photo-1506629905607-d9a317f0d4f8?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 4,
    name: 'Přírodní Košile',
    price: '990 Kč',
    category: 'Košile',
    material: 'Bio bavlna',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 5,
    name: 'Minimalistická Mikina',
    price: '1290 Kč',
    category: 'Mikiny',
    material: 'Organická bavlna',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 6,
    name: 'Basic Top',
    price: '490 Kč',
    category: 'Topy',
    material: 'Přírodní vlákna',
    image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=1200&auto=format&fit=crop',
  },
];

const Catalog = () => {
  const navigate = useNavigate();

  return (
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
          />

          <select className="catalog-select">
            <option>Všechny kategorie</option>
            <option>Trička</option>
            <option>Mikiny</option>
            <option>Košile</option>
            <option>Kalhoty</option>
            <option>Topy</option>
          </select>

          <select className="catalog-select">
            <option>Seřadit podle</option>
            <option>Nejnovější</option>
            <option>Od nejlevnějších</option>
            <option>Od nejdražších</option>
          </select>
        </div>

        <div className="catalog-grid">
          {products.map((product) => (
            <div key={product.id} className="catalog-card">
              <div className="catalog-image-wrap">
                <img src={product.image} alt={product.name} />
              </div>

              <div className="catalog-card-content">
                <p className="catalog-category">{product.category}</p>
                <h3>{product.name}</h3>
                <p className="catalog-material">{product.material}</p>

                <div className="catalog-card-bottom">
                  <span className="catalog-price">{product.price}</span>
                  <button className="catalog-detail-btn">Detail</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Catalog;