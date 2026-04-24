import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Products() {
  const navigate = useNavigate();
  const { addToCart, setIsCartOpen } = useCart();

  const [latestProducts, setLatestProducts] = useState([]);

  useEffect(() => {
    fetchLatestProducts();
  }, []);

  const fetchLatestProducts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/products");

      const latest = response.data
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 3);

      setLatestProducts(latest);
    } catch (err) {
      console.error("Nepodařilo se načíst produkty:", err);
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product);

    // otevře košík
    setIsCartOpen(true);

    // zavře po 3 sekundách
    setTimeout(() => {
      setIsCartOpen(false);
    }, 3000);
  };

  return (
    <section id="kolekce" className="products section">
      <div className="container">
        <h2>Nejnovější kolekce</h2>

        <div className="product-grid">
          {latestProducts.map((product) => (
            <div className="product-card" key={product._id}>
              <div className="product-image-wrap">
                <img src={product.image} alt={product.name} />

                {product.category && (
                  <span className="badge">{product.category}</span>
                )}
              </div>

              <h3>{product.name}</h3>
              <p>{product.price} Kč</p>

              <div className="product-actions">
                <button
                  className="detail-btn"
                  onClick={() => navigate(`/product/${product._id}`)}
                >
                  Detail
                </button>

                <button
                  className="cart-btn"
                  onClick={() => handleAddToCart(product)}
                >
                  Přidat do košíku
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
