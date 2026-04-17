import React from 'react';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product, onDetail }) {
  const { addToCart, setIsCartOpen } = useCart();

  const handleBuy = () => {
    addToCart(product);
    setIsCartOpen(true);
  };

  return (
    <div style={styles.card}>
      <img src={product.image} alt={product.name} style={styles.image} />

      <h3>{product.name}</h3>
      <p>{product.description}</p>
      <strong>{product.price} Kč</strong>

      <div style={styles.actions}>
        <button style={styles.detailButton} onClick={() => onDetail(product)}>
          Detail
        </button>

        <button style={styles.buyButton} onClick={handleBuy}>
          Koupit
        </button>
      </div>
    </div>
  );
}

const styles = {
  card: {
    border: '1px solid #ddd',
    borderRadius: '10px',
    padding: '16px',
    background: '#fff',
  },
  image: {
    width: '100%',
    height: '220px',
    objectFit: 'cover',
    borderRadius: '8px',
    marginBottom: '12px',
  },
  actions: {
    display: 'flex',
    gap: '10px',
    marginTop: '12px',
  },
  detailButton: {
    padding: '10px 14px',
    border: '1px solid #ccc',
    background: '#f5f5f5',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  buyButton: {
    padding: '10px 14px',
    border: 'none',
    background: '#111',
    color: '#fff',
    borderRadius: '8px',
    cursor: 'pointer',
  },
};