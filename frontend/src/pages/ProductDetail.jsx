import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ShieldCheck, Truck, Leaf } from 'lucide-react';

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
      <motion.button
        className="catalog-back-btn"
        onClick={() => navigate('/catalog')}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        Zpět do katalogu
      </motion.button>

      <motion.div
        className="product-detail-card"
        initial={{ opacity: 0, y: 35 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <motion.div
          className="product-detail-image"
          initial={{ opacity: 0, x: -35 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15, duration: 0.75 }}
        >
          <img src={product.image} alt={product.name} />
        </motion.div>

        <motion.div
          className="product-detail-content"
          initial={{ opacity: 0, x: 35 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.25, duration: 0.75 }}
        >
          <p className="catalog-category">{product.category}</p>
          <h1>{product.name}</h1>

          <p className="product-detail-material">
            Materiál: <strong>{product.material || 'Neuvedeno'}</strong>
          </p>

          <p className="product-detail-description">
            {product.description}
          </p>

          <div className="product-detail-info-grid">
            <div className="product-info-box">
              <Leaf size={20} />
              <div>
                <h4>Šetrnější materiály</h4>
                <p>Vybrané materiály s důrazem na kvalitu a pohodlí.</p>
              </div>
            </div>

            <div className="product-info-box">
              <Truck size={20} />
              <div>
                <h4>Rychlé doručení</h4>
                <p>Objednávky expedujeme v co nejkratším čase.</p>
              </div>
            </div>

            <div className="product-info-box">
              <ShieldCheck size={20} />
              <div>
                <h4>Bezpečný nákup</h4>
                <p>Jednoduchý a přehledný proces objednávky.</p>
              </div>
            </div>
          </div>

          <div className="product-detail-meta">
            <p>
              Přidáno:{' '}
              {product.createdAt
                ? new Date(product.createdAt).toLocaleDateString('cs-CZ')
                : 'Neuvedeno'}
            </p>
            <p>Skladem: {product.stock ?? 0} ks</p>
          </div>

          <div className="product-detail-bottom">
            <span className="product-detail-price">{product.price} Kč</span>

            <div className="product-detail-actions">
              <button className="product-detail-buy-btn" onClick={handleBuy}>
                Koupit
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        className="product-detail-extra"
        initial={{ opacity: 0, y: 35 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.75 }}
      >
        <h2>Více o produktu</h2>
        <p>
          Tento produkt je navržen tak, aby spojoval jednoduchý moderní styl,
          pohodlí při nošení a kvalitní zpracování. Zaměřujeme se na čistý vzhled,
          univerzální využití a materiály, které působí příjemně při každodenním nošení.
        </p>
        <p>
          Díky nadčasovému designu se produkt snadno kombinuje s dalšími kousky
          a hodí se jak pro běžné nošení, tak pro minimalistický městský styl.
        </p>
      </motion.div>
    </div>
  </div>
</>
  );
};

export default ProductDetail;