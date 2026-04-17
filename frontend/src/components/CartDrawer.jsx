import React from 'react';
import { useCart } from '../context/CartContext';

export default function CartDrawer() {
  const {
    cartItems,
    totalPrice,
    isCartOpen,
    setIsCartOpen,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useCart();

  if (!isCartOpen) return null;

  return (
    <>
      <div style={styles.overlay} onClick={() => setIsCartOpen(false)} />

      <aside style={styles.drawer}>
        <div style={styles.header}>
          <h3>Košík</h3>
          <button style={styles.closeButton} onClick={() => setIsCartOpen(false)}>
            ✕
          </button>
        </div>

        {cartItems.length === 0 ? (
          <p>Košík je prázdný.</p>
        ) : (
          <>
            <div style={styles.items}>
              {cartItems.map((item) => (
                <div key={item._id} style={styles.item}>
                  <img src={item.image} alt={item.name} style={styles.itemImage} />

                  <div style={styles.itemInfo}>
                    <h4>{item.name}</h4>
                    <p>{item.price} Kč</p>

                    <div style={styles.quantityRow}>
                      <button onClick={() => decreaseQuantity(item._id)}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => increaseQuantity(item._id)}>+</button>
                    </div>
                  </div>

                  <button
                    style={styles.removeButton}
                    onClick={() => removeFromCart(item._id)}
                  >
                    Odebrat
                  </button>
                </div>
              ))}
            </div>

            <div style={styles.footer}>
              <strong>Celková cena: {totalPrice} Kč</strong>
            </div>
          </>
        )}
      </aside>
    </>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.35)',
    zIndex: 99,
  },
  drawer: {
    position: 'fixed',
    top: 0,
    right: 0,
    width: '380px',
    maxWidth: '100%',
    height: '100%',
    background: '#fff',
    boxShadow: '-4px 0 15px rgba(0,0,0,0.15)',
    zIndex: 100,
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  closeButton: {
    border: 'none',
    background: 'transparent',
    fontSize: '20px',
    cursor: 'pointer',
  },
  items: {
    flex: 1,
    overflowY: 'auto',
  },
  item: {
    display: 'flex',
    gap: '12px',
    padding: '12px 0',
    borderBottom: '1px solid #eee',
    alignItems: 'center',
  },
  itemImage: {
    width: '70px',
    height: '70px',
    objectFit: 'cover',
    borderRadius: '8px',
  },
  itemInfo: {
    flex: 1,
  },
  quantityRow: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
  },
  removeButton: {
    background: '#eee',
    border: 'none',
    padding: '8px 10px',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  footer: {
    borderTop: '1px solid #ddd',
    paddingTop: '16px',
    marginTop: '16px',
  },
};