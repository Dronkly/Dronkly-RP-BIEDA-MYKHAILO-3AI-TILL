import React from 'react';
import { useCart } from '../context/CartContext';
import { FiShoppingCart, FiPackage } from 'react-icons/fi';

export default function Header() {
  const { totalItems, setIsCartOpen } = useCart();

  return (
    <header style={styles.header}>
      {/* Levá část - katalog */}
      <div style={styles.left}>
        <FiPackage size={22} />
        <h2 style={styles.logo}>Katalog</h2>
      </div>

      {/* Pravá část - košík */}
      <div style={styles.right}>
        {totalItems > 0 && (
          <button
            style={styles.cartButton}
            onClick={() => setIsCartOpen(true)}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <FiShoppingCart size={26} />
            <span style={styles.badge}>{totalItems}</span>
          </button>
        )}
      </div>
    </header>
  );
}

const styles = {
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '16px 24px',
      borderBottom: '1px solid #eee',
      position: 'sticky',
      top: 0,
      background: 'rgba(255,255,255,0.9)',
      backdropFilter: 'blur(8px)',
      zIndex: 100,
    },
  
    left: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    },
  
    logo: {
      margin: 0,
      fontSize: '20px',
      fontWeight: '600',
    },
  
    right: {
      display: 'flex',
      alignItems: 'center',
    },
  
    cartButton: {
      position: 'relative',
      background: 'transparent',
      border: 'none',
      cursor: 'pointer',
      padding: '6px',
      borderRadius: '8px',
      transition: 'all 0.2s ease',
    },
  
    badge: {
      position: 'absolute',
      top: '-6px',
      right: '-6px',
      minWidth: '18px',
      height: '18px',
      borderRadius: '999px',
      background: '#e11d48',
      color: '#fff',
      fontSize: '11px',
      fontWeight: 'bold',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0 5px',
    },
  };