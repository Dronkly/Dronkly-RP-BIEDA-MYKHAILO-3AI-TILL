import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const AdminEditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem("user"));

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    price: "",
    image: "",
    category: "",
    material: "",
    stock: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!storedUser || storedUser.role !== "admin") {
      navigate("/");
      return;
    }

    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/products/${id}`);
      const product = response.data;

      setFormData({
        name: product.name || "",
        slug: product.slug || "",
        description: product.description || "",
        price: product.price?.toString() || "",
        image: product.image || "",
        category: product.category || "",
        material: product.material || "",
        stock: product.stock?.toString() || "",
      });
    } catch (err) {
      setError("Nepodařilo se načíst produkt.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    let newValue = value;
    if (name === "price" || name === "stock") {
      newValue = value.replace(/\D/g, "");
    }

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const response = await axios.put(`http://localhost:5000/api/products/${id}`, {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
      });

      setMessage(response.data.message || "Produkt byl upraven.");
    } catch (err) {
      setError(err.response?.data?.message || "Nepodařilo se upravit produkt.");
    }
  };

  if (loading) {
    return <div className="admin-detail-page"><p>Načítání produktu...</p></div>;
  }

  return (
    <div className="admin-detail-page">
      <div className="admin-detail-shell">
        <div className="admin-detail-topbar">
          <div>
            <p className="profile-eyebrow">Administrace</p>
            <h1>Upravit produkt</h1>
            <p className="profile-subtitle">Úprava produktu v katalogu.</p>
          </div>

          <button className="profile-home-btn" onClick={() => navigate("/admin")}>
            Zpět do administrace
          </button>
        </div>

        {message && <div className="register-success">{message}</div>}
        {error && <div className="login-error">{error}</div>}

        <section className="admin-detail-card">
          <form className="admin-form" onSubmit={handleSubmit}>
            <input name="name" placeholder="Název produktu" value={formData.name} onChange={handleChange} required />
            <input name="slug" placeholder="Slug" value={formData.slug} onChange={handleChange} required />
            <input name="image" placeholder="Odkaz na obrázek" value={formData.image} onChange={handleChange} required />
            <input name="category" placeholder="Kategorie" value={formData.category} onChange={handleChange} />
            <input name="material" placeholder="Materiál" value={formData.material} onChange={handleChange} />
            <input name="price" placeholder="Cena" value={formData.price} onChange={handleChange} required />
            <input name="stock" placeholder="Sklad" value={formData.stock} onChange={handleChange} required />

            <textarea
              name="description"
              placeholder="Popis produktu"
              value={formData.description}
              onChange={handleChange}
              rows={6}
            />

            <div className="admin-form-actions">
              <button type="submit" className="profile-action-btn">
                Uložit změny
              </button>

              <button
                type="button"
                className="delete-card-btn"
                onClick={() => navigate("/admin")}
              >
                Zrušit
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
};

export default AdminEditProduct;