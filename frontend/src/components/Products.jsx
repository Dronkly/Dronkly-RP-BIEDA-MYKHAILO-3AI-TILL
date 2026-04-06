const products = [
  {
    name: "Organic Tričko",
    price: "590 Kč",
    badge: "Organic",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab"
  },
  {
    name: "Recyklovaná Mikina",
    price: "1190 Kč",
    badge: "Recycled",
    image: "https://images.unsplash.com/photo-1503341504253-dff4815485f1"
  },
  {
    name: "Lněné Šaty",
    price: "1490 Kč",
    badge: "Natural",
    image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c"
  }
];

export default function Products() {
  return (
    <section id="kolekce" className="products section">
      <div className="container">
        <h2>Nejnovější kolekce</h2>
        <div className="product-grid">
          {products.map((product, index) => (
            <div className="product-card" key={index}>
              <img src={product.image} alt={product.name} />
              <span className="badge">{product.badge}</span>
              <h3>{product.name}</h3>
              <p>{product.price}</p>
              <button>Přidat do košíku</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}