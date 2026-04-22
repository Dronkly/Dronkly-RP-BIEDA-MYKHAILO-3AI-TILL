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

const statusLabels = {
  paid: 'Zaplaceno',
  processing: 'Připravujeme',
  shipped: 'Na cestě',
  out_for_delivery: 'Doručujeme dnes',
  delivered: 'Doručeno',
  cancelled: 'Zrušeno',
};

const AdminPanel = () => {
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem('user'));

  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [orders, setOrders] = useState([]);
  const [statusForm, setStatusForm] = useState({});
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!storedUser || storedUser.role !== 'admin') {
      navigate('/');
      return;
    }

    fetchProducts();
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/orders/admin/all');
    setOrders(response.data);
  } catch (err) {
    console.error(err);
    setError('Nepodařilo se načíst objednávky.');
  }
};

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

  const handleStatusChange = (orderId, field, value) => {
  setStatusForm((prev) => ({
    ...prev,
    [orderId]: {
      ...(prev[orderId] || {}),
      [field]: value,
    },
  }));
};

const handleUpdateOrderStatus = async (orderId) => {
  setMessage('');
  setError('');

  try {
    const data = statusForm[orderId] || {};

    const response = await axios.put(
      `http://localhost:5000/api/orders/${orderId}/status`,
      {
        status: data.status,
        deliveryEstimateDays: data.deliveryEstimateDays || null,
        deliveryWindowStart: data.deliveryWindowStart || '',
        deliveryWindowEnd: data.deliveryWindowEnd || '',
        sendEmail: data.sendEmail || false,
      }
    );

    setMessage(response.data.message || 'Stav objednávky byl změněn.');
    fetchOrders();

    setStatusForm((prev) => ({
  ...prev,
  [orderId]: {},
}));

  } catch (err) {
    setError(err.response?.data?.message || 'Nepodařilo se změnit stav objednávky.');
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
              Správa produktů a objednávek v administraci.
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
        <section className="admin-panel-card">
        <h2>Objednávky</h2>

        <div className="admin-orders-list">
          {orders.length === 0 ? (
            <p className="empty-text">Zatím nejsou žádné objednávky.</p>
          ) : (
            orders.map((order) => {
              const current = statusForm[order._id] || {};

            return (
               <div key={order._id} className="admin-order-item">
               <div className="admin-order-head">
                  <div>
                    <h3>{order.contact?.email || order.userEmail}</h3>
                    <p>Celkem: {order.totalPrice} Kč</p>
                    <p>Aktuální stav: {order.status}</p>
                  </div>
                </div>

                <div className="admin-order-products">
                  {order.items.map((item, index) => (
                    <p key={index}>
                      {item.name} × {item.quantity}
                    </p>
                  ))}
                </div>

                <div className="admin-order-controls">
                  <select
                    value={current.status || order.status}
                    onChange={(e) =>
                      handleStatusChange(order._id, 'status', e.target.value)
                    }
                  >
                    <option value="paid">Zaplaceno</option>
                    <option value="processing">Připravujeme</option>
                    <option value="shipped">Na cestě</option>
                    <option value="out_for_delivery">Doručujeme dnes</option>
                    <option value="delivered">Doručeno</option>
                    <option value="cancelled">Zrušeno</option>
                  </select>

                  {(current.status || order.status) === 'shipped' && (
                    <input
                      type="number"
                      placeholder="Za kolik dní dorazí"
                      value={current.deliveryEstimateDays || ''}
                      onChange={(e) =>
                        handleStatusChange(order._id, 'deliveryEstimateDays', e.target.value)
                      }
                    />
                  )}

                  {(current.status || order.status) === 'out_for_delivery' && (
                    <>
                      <input
                        type="text"
                        placeholder="Od (např. 13:00)"
                        value={current.deliveryWindowStart || ''}
                        onChange={(e) =>
                          handleStatusChange(order._id, 'deliveryWindowStart', e.target.value)
                        }
                      />
                      <input
                        type="text"
                        placeholder="Do (např. 15:00)"
                        value={current.deliveryWindowEnd || ''}
                        onChange={(e) =>
                          handleStatusChange(order._id, 'deliveryWindowEnd', e.target.value)
                        }
                      />
                    </>
                  )}

                  <label className="checkbox-row">
                    <input
                      type="checkbox"
                      checked={current.sendEmail || false}
                      onChange={(e) =>
                        handleStatusChange(order._id, 'sendEmail', e.target.checked)
                      }
                    />
                    Poslat email zákazníkovi
                  </label>

                  <button
                    type="button"
                    className="profile-action-btn"
                    onClick={() => handleUpdateOrderStatus(order._id)}
                  >
                    Uložit stav
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
      </div>
    </div>
  );
};

export default AdminPanel;