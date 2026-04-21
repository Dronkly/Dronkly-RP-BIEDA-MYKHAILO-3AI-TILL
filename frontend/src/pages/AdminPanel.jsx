import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const emptyForm = {
  name: '',
  slug: '',
  description: '',
  price: '',
  image: '',
  category: '',
  material: '',
  stock: '',
};

const AdminPanel = () => {
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem('user'));

  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!storedUser || storedUser.role !== 'admin') {
      navigate('/');
      return;
    }

    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/products');
      setProducts(response.data);
    } catch (err) {
      setError('Nepodařilo se načíst produkty.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    let newValue = value;

    if (name === 'price' || name === 'stock') {
      newValue = value.replace(/\D/g, '');
    }

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const resetForm = () => {
    setFormData(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      if (editingId) {
        const response = await axios.put(
          `http://localhost:5000/api/products/${editingId}`,
          {
            ...formData,
            price: Number(formData.price),
            stock: Number(formData.stock),
          }
        );

        setMessage(response.data.message || 'Produkt byl upraven.');
      } else {
        const response = await axios.post('http://localhost:5000/api/products', {
          ...formData,
          price: Number(formData.price),
          stock: Number(formData.stock),
        });

        setMessage(response.data.message || 'Produkt byl přidán.');
      }

      resetForm();
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || 'Nepodařilo se uložit produkt.');
    }
  };

  const handleEdit = (product) => {
    setEditingId(product._id);
    setFormData({
      name: product.name || '',
      slug: product.slug || '',
      description: product.description || '',
      price: product.price?.toString() || '',
      image: product.image || '',
      category: product.category || '',
      material: product.material || '',
      stock: product.stock?.toString() || '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (productId) => {
    setMessage('');
    setError('');

    try {
      const response = await axios.delete(`http://localhost:5000/api/products/${productId}`);
      setMessage(response.data.message || 'Produkt byl smazán.');
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || 'Nepodařilo se smazat produkt.');
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-shell">
        <div className="admin-topbar">
          <div>
            <p className="profile-eyebrow">Administrace</p>
            <h1>Admin panel</h1>
            <p className="profile-subtitle">
              Přidávání, úprava a mazání produktů v katalogu.
            </p>
          </div>

          <button className="profile-home-btn" onClick={() => navigate('/')}>
            Zpět na domů
          </button>
        </div>

        {message && <div className="register-success">{message}</div>}
        {error && <div className="login-error">{error}</div>}

        <div className="admin-layout">
          <section className="admin-panel-card">
            <h2>{editingId ? 'Upravit produkt' : 'Přidat produkt'}</h2>

            <form className="admin-form" onSubmit={handleSubmit}>
              <input name="name" placeholder="Název produktu" value={formData.name} onChange={handleChange} required />
              <input name="slug" placeholder="Slug (např. organic-tricko)" value={formData.slug} onChange={handleChange} required />
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
                rows={5}
              />

              <div className="admin-form-actions">
                <button type="submit" className="profile-action-btn">
                  {editingId ? 'Uložit změny' : 'Přidat produkt'}
                </button>

                {editingId && (
                  <button type="button" className="delete-card-btn" onClick={resetForm}>
                    Zrušit úpravy
                  </button>
                )}
              </div>
            </form>
          </section>

          <section className="admin-panel-card">
            <h2>Produkty</h2>

            <div className="admin-products-list">
              {products.map((product) => (
                <div key={product._id} className="admin-product-item">
                  <img src={product.image} alt={product.name} className="admin-product-thumb" />

                  <div className="admin-product-info">
                    <h3>{product.name}</h3>
                    <p>{product.category}</p>
                    <p>{product.price} Kč</p>
                  </div>

                  <div className="admin-product-actions">
                    <button type="button" className="profile-action-btn" onClick={() => handleEdit(product)}>
                      Upravit
                    </button>
                    <button type="button" className="delete-card-btn" onClick={() => handleDelete(product._id)}>
                      Smazat
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;