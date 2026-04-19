import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

import Header from '../components/Header';
import { useCart } from '../context/CartContext';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, setIsCartOpen } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/products/${id}`);
      setProduct(response.data);
    } catch (error) {
      console.error('Chyba při načítání detailu produktu:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBuy = () => {
    addToCart(product);
    setIsCartOpen(true);
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="product-detail-page">
          <div className="product-detail-shell">
            <p>Načítání produktu...</p>
          </div>
        </div>
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Header />
        <div className="product-detail-page">
          <div className="product-detail-shell">
            <p>Produkt nebyl nalezen.</p>
            <button className="catalog-back-btn" onClick={() => navigate('/catalog')}>
              Zpět do katalogu
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />

      <div className="product-detail-page">
        <div className="product-detail-shell">
          <button className="catalog-back-btn" onClick={() => navigate('/catalog')}>
            Zpět do katalogu
          </button>

          <div className="product-detail-card">
            <div className="product-detail-image">
              <img src={product.image} alt={product.name} />
            </div>

            <div className="product-detail-content">
              <p className="catalog-category">{product.category}</p>
              <h1>{product.name}</h1>
              <p className="product-detail-material">{product.material}</p>
              <p className="product-detail-description">{product.description}</p>
              <p className="product-detail-date">
                Přidáno: {new Date(product.createdAt).toLocaleDateString('cs-CZ')}
              </p>

              <div className="product-detail-bottom">
                <span className="product-detail-price">{product.price} Kč</span>
                <button className="catalog-buy-btn" onClick={handleBuy}>
                  Koupit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetail;