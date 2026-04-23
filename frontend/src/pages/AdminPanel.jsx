import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const emptyForm = {
  name: "",
  slug: "",
  description: "",
  price: "",
  image: "",
  category: "",
  material: "",
  stock: "",
};

const statusLabels = {
  paid: "Zaplaceno",
  processing: "Připravujeme",
  shipped: "Na cestě",
  out_for_delivery: "Doručujeme dnes",
  delivered: "Doručeno",
  cancelled: "Zrušeno",
};

const AdminPanel = () => {
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem("user"));

  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [orders, setOrders] = useState([]);
  const [orderSearch, setOrderSearch] = useState("");
  const [statusForm, setStatusForm] = useState({});
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [activeSection, setActiveSection] = useState("products");
  const [users, setUsers] = useState([]);
  const [userSearch, setUserSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserOrders, setSelectedUserOrders] = useState([]);
  const [userDetailLoading, setUserDetailLoading] = useState(false);

  const [userDetailForm, setUserDetailForm] = useState({
    name: "",
    surname: "",
    phone: "",
    birthDate: "",
    street: "",
    city: "",
    zipCode: "",
    country: "",
    role: "user",
  });

  useEffect(() => {
    if (!storedUser || storedUser.role !== "admin") {
      navigate("/");
      return;
    }

    fetchProducts();
    fetchOrders();
    fetchUsers();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/orders/admin/all",
      );
      setOrders(response.data);
    } catch (err) {
      console.error(err);
      setError("Nepodařilo se načíst objednávky.");
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/products");
      setProducts(response.data);
    } catch (err) {
      setError("Nepodařilo se načíst produkty.");
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/profile/admin/users",
      );
      setUsers(response.data);
    } catch (err) {
      console.error(err);
      setError("Nepodařilo se načíst uživatele.");
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
  const handleSectionChange = (section) => {
    setActiveSection(section);

    if (section !== "users") {
      setSelectedUser(null);
      setSelectedUserOrders([]);
      setUserDetailForm({
      name: "",
      surname: "",
      phone: "",
      birthDate: "",
      street: "",
      city: "",
      zipCode: "",
      country: "",
      role: "user",
    });
    }
  };

  const resetForm = () => {
    setFormData(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      if (editingId) {
        const response = await axios.put(
          `http://localhost:5000/api/products/${editingId}`,
          {
            ...formData,
            price: Number(formData.price),
            stock: Number(formData.stock),
          },
        );

        setMessage(response.data.message || "Produkt byl upraven.");
      } else {
        const response = await axios.post(
          "http://localhost:5000/api/products",
          {
            ...formData,
            price: Number(formData.price),
            stock: Number(formData.stock),
          },
        );

        setMessage(response.data.message || "Produkt byl přidán.");
      }

      resetForm();
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || "Nepodařilo se uložit produkt.");
    }
  };

  const handleEdit = (product) => {
    setEditingId(product._id);
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
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (productId) => {
    setMessage("");
    setError("");

    try {
      const response = await axios.delete(
        `http://localhost:5000/api/products/${productId}`,
      );
      setMessage(response.data.message || "Produkt byl smazán.");
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || "Nepodařilo se smazat produkt.");
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
    setMessage("");
    setError("");

    try {
      const data = statusForm[orderId] || {};

      const response = await axios.put(
        `http://localhost:5000/api/orders/${orderId}/status`,
        {
          status: data.status,
          deliveryEstimateDays: data.deliveryEstimateDays || null,
          deliveryWindowStart: data.deliveryWindowStart || "",
          deliveryWindowEnd: data.deliveryWindowEnd || "",
          sendEmail: data.sendEmail || false,
        },
      );

      setMessage(response.data.message || "Stav objednávky byl změněn.");
      fetchOrders();

      setStatusForm((prev) => ({
        ...prev,
        [orderId]: {},
      }));
    } catch (err) {
      setError(
        err.response?.data?.message || "Nepodařilo se změnit stav objednávky.",
      );
    }
  };

  const handleUserDetailChange = (e) => {
    const { name, value } = e.target;

    setUserDetailForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUserDetailSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!selectedUser?._id) return;

    try {
      const response = await axios.put(
        `http://localhost:5000/api/profile/admin/users/${selectedUser._id}`,
        userDetailForm,
      );

      setMessage(response.data.message || "Uživatel byl upraven.");
      fetchUsers();
      openUserDetail(selectedUser._id);
    } catch (err) {
      setError(
        err.response?.data?.message || "Nepodařilo se upravit uživatele.",
      );
    }
  };

  const filteredOrders = orders.filter((order) => {
    const search = orderSearch.toLowerCase();

    const email = (order.contact?.email || order.userEmail || "").toLowerCase();
    const fullName =
      `${order.customerName || ""} ${order.customerSurname || ""}`.toLowerCase();

    return email.includes(search) || fullName.includes(search);
  });

  const filteredUsers = users.filter((user) => {
    const search = userSearch.toLowerCase();

    const fullName = `${user.name || ""} ${user.surname || ""}`.toLowerCase();
    const email = (user.email || "").toLowerCase();

    return fullName.includes(search) || email.includes(search);
  });

  const activeUserOrders = selectedUserOrders.filter((order) =>
    ["paid", "processing", "shipped", "out_for_delivery"].includes(
      order.status,
    ),
  );

  const historyUserOrders = selectedUserOrders.filter((order) =>
    ["delivered", "cancelled"].includes(order.status),
  );

  const openUserDetail = async (userId) => {
    setMessage("");
    setError("");
    setUserDetailLoading(true);

    try {
      const response = await axios.get(
        `http://localhost:5000/api/profile/admin/users/${userId}`,
      );
      const { user, orders } = response.data;

      setSelectedUser(user);
      setSelectedUserOrders(orders || []);

      setUserDetailForm({
        name: user.name || "",
        surname: user.surname || "",
        phone: user.phone || "",
        birthDate: user.birthDate ? user.birthDate.slice(0, 10) : "",
        street: user.street || "",
        city: user.city || "",
        zipCode: user.zipCode || "",
        country: user.country || "",
        role: user.role || "user",
      });
    } catch (err) {
      setError(
        err.response?.data?.message || "Nepodařilo se načíst detail uživatele.",
      );
    } finally {
      setUserDetailLoading(false);
    }
  };

  const closeUserDetail = () => {
    setSelectedUser(null);
    setSelectedUserOrders([]);
    setUserDetailForm({
    name: "",
    surname: "",
    phone: "",
    birthDate: "",
    street: "",
    city: "",
    zipCode: "",
    country: "",
    role: "user",
  });
  };

  return (
    <div className="admin-page">
      <div className="admin-shell">
        <div className="admin-topbar">
          <div>
            <p className="profile-eyebrow">Administrace</p>
            <h1>Admin panel</h1>
            <p className="profile-subtitle">
              Správa produktů, objednávek a uživatelů v administraci.
            </p>
          </div>

          <button className="profile-home-btn" onClick={() => navigate("/")}>
            Zpět na domů
          </button>
        </div>

        {message && <div className="register-success">{message}</div>}
        {error && <div className="login-error">{error}</div>}

        <div className="admin-main-layout">
          <aside className="admin-sidebar">
            <button
              className={`admin-menu-btn ${activeSection === "products" ? "active" : ""}`}
              onClick={() => handleSectionChange("products")}
            >
              Produkty
            </button>

            <button
              className={`admin-menu-btn ${activeSection === "orders" ? "active" : ""}`}
              onClick={() => handleSectionChange("orders")}
            >
              Objednávky
            </button>

            <button
              className={`admin-menu-btn ${activeSection === "users" ? "active" : ""}`}
              onClick={() => handleSectionChange("users")}
            >
              Uživatelé
            </button>
          </aside>

          <div className="admin-content">
            {activeSection === "products" && (
              <div className="admin-layout">
                <section className="admin-panel-card">
                  <h2>{editingId ? "Upravit produkt" : "Přidat produkt"}</h2>

                  <form className="admin-form" onSubmit={handleSubmit}>
                    <input
                      name="name"
                      placeholder="Název produktu"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                    <input
                      name="slug"
                      placeholder="Slug (např. organic-tricko)"
                      value={formData.slug}
                      onChange={handleChange}
                      required
                    />
                    <input
                      name="image"
                      placeholder="Odkaz na obrázek"
                      value={formData.image}
                      onChange={handleChange}
                      required
                    />
                    <input
                      name="category"
                      placeholder="Kategorie"
                      value={formData.category}
                      onChange={handleChange}
                    />
                    <input
                      name="material"
                      placeholder="Materiál"
                      value={formData.material}
                      onChange={handleChange}
                    />
                    <input
                      name="price"
                      placeholder="Cena"
                      value={formData.price}
                      onChange={handleChange}
                      required
                    />
                    <input
                      name="stock"
                      placeholder="Sklad"
                      value={formData.stock}
                      onChange={handleChange}
                      required
                    />

                    <textarea
                      name="description"
                      placeholder="Popis produktu"
                      value={formData.description}
                      onChange={handleChange}
                      rows={5}
                    />

                    <div className="admin-form-actions">
                      <button type="submit" className="profile-action-btn">
                        {editingId ? "Uložit změny" : "Přidat produkt"}
                      </button>

                      {editingId && (
                        <button
                          type="button"
                          className="delete-card-btn"
                          onClick={resetForm}
                        >
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
                        <img
                          src={product.image}
                          alt={product.name}
                          className="admin-product-thumb"
                        />

                        <div className="admin-product-info">
                          <h3>{product.name}</h3>
                          <p>{product.category}</p>
                          <p>{product.price} Kč</p>
                        </div>

                        <div className="admin-product-actions">
                          <button
                            type="button"
                            className="profile-action-btn"
                            onClick={() => handleEdit(product)}
                          >
                            Upravit
                          </button>
                          <button
                            type="button"
                            className="delete-card-btn"
                            onClick={() => handleDelete(product._id)}
                          >
                            Smazat
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            )}

            {activeSection === "orders" && (
              <section className="admin-panel-card">
                <h2>Objednávky</h2>

                <input
                  type="text"
                  className="admin-order-search"
                  placeholder="Hledat podle emailu nebo jména..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                />

                <div className="admin-orders-list">
                  {filteredOrders.length === 0 ? (
                    <p className="empty-text">
                      Žádné objednávky neodpovídají hledání.
                    </p>
                  ) : (
                    filteredOrders.map((order) => {
                      const current = statusForm[order._id] || {};

                      return (
                        <div key={order._id} className="admin-order-item">
                          <div className="admin-order-head">
                            <div>
                              <h3>
                                {order.customerName || order.customerSurname
                                  ? `${order.customerName} ${order.customerSurname}`
                                  : "Zákazník"}
                              </h3>
                              <p>{order.contact?.email || order.userEmail}</p>
                              <p>Celkem: {order.totalPrice} Kč</p>
                              <p>
                                Aktuální stav:{" "}
                                {statusLabels[order.status] || order.status}
                              </p>
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
                                handleStatusChange(
                                  order._id,
                                  "status",
                                  e.target.value,
                                )
                              }
                            >
                              <option value="paid">Zaplaceno</option>
                              <option value="processing">Připravujeme</option>
                              <option value="shipped">Na cestě</option>
                              <option value="out_for_delivery">
                                Doručujeme dnes
                              </option>
                              <option value="delivered">Doručeno</option>
                              <option value="cancelled">Zrušeno</option>
                            </select>

                            {(current.status || order.status) === "shipped" && (
                              <input
                                type="number"
                                placeholder="Za kolik dní dorazí"
                                value={current.deliveryEstimateDays || ""}
                                onChange={(e) =>
                                  handleStatusChange(
                                    order._id,
                                    "deliveryEstimateDays",
                                    e.target.value,
                                  )
                                }
                              />
                            )}

                            {(current.status || order.status) ===
                              "out_for_delivery" && (
                              <>
                                <input
                                  type="text"
                                  placeholder="Od (např. 13:00)"
                                  value={current.deliveryWindowStart || ""}
                                  onChange={(e) =>
                                    handleStatusChange(
                                      order._id,
                                      "deliveryWindowStart",
                                      e.target.value,
                                    )
                                  }
                                />
                                <input
                                  type="text"
                                  placeholder="Do (např. 15:00)"
                                  value={current.deliveryWindowEnd || ""}
                                  onChange={(e) =>
                                    handleStatusChange(
                                      order._id,
                                      "deliveryWindowEnd",
                                      e.target.value,
                                    )
                                  }
                                />
                              </>
                            )}

                            <label className="checkbox-row">
                              <input
                                type="checkbox"
                                checked={current.sendEmail || false}
                                onChange={(e) =>
                                  handleStatusChange(
                                    order._id,
                                    "sendEmail",
                                    e.target.checked,
                                  )
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
            )}

            {activeSection === "users" && (
              <section className="admin-panel-card">
                <h2>Uživatelé</h2>

                <input
                  type="text"
                  className="admin-order-search"
                  placeholder="Hledat podle jména, příjmení nebo emailu..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                />

                <div className="admin-users-list">
                  {users.length === 0 ? (
                    <p className="empty-text">Zatím nejsou žádní uživatelé.</p>
                  ) : filteredUsers.length === 0 ? (
                    <p className="empty-text">
                      Žádný uživatel neodpovídá hledání.
                    </p>
                  ) : (
                    filteredUsers.map((user) => (
                      <div key={user._id} className="admin-user-card">
                        <div className="admin-user-avatar">
                          {`${user.name?.[0] || ""}${user.surname?.[0] || ""}`.toUpperCase() ||
                            "U"}
                        </div>

                        <div className="admin-user-info">
                          <h3>
                            {user.name} {user.surname}
                          </h3>
                          <p>{user.email}</p>
                          <p>Role: {user.role || "user"}</p>
                          <p>Telefon: {user.phone || "Neuveden"}</p>
                          <p>
                            Adresa:{" "}
                            {[
                              user.street,
                              user.city,
                              user.zipCode,
                              user.country,
                            ]
                              .filter(Boolean)
                              .join(", ") || "Neuvedena"}
                          </p>

                          <button
                            type="button"
                            className="profile-action-btn"
                            onClick={() => openUserDetail(user._id)}
                          >
                            Detail
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {userDetailLoading && <p>Načítání detailu uživatele...</p>}

                {selectedUser && (
                  <section className="admin-panel-card admin-user-detail-card">
                    <div className="admin-user-detail-header">
                      <h2>
                        Detail uživatele: {selectedUser.name}{" "}
                        {selectedUser.surname}
                      </h2>

                      <button
                        type="button"
                        className="delete-card-btn"
                        onClick={closeUserDetail}
                      >
                        Zavřít detail
                      </button>
                    </div>

                    <form
                      className="admin-form"
                      onSubmit={handleUserDetailSubmit}
                    >
                      <input
                        name="name"
                        placeholder="Jméno"
                        value={userDetailForm.name}
                        onChange={handleUserDetailChange}
                      />
                      <input
                        name="surname"
                        placeholder="Příjmení"
                        value={userDetailForm.surname}
                        onChange={handleUserDetailChange}
                      />
                      <input
                        name="phone"
                        placeholder="Telefon"
                        value={userDetailForm.phone}
                        onChange={handleUserDetailChange}
                      />
                      <input
                        name="birthDate"
                        type="date"
                        value={userDetailForm.birthDate}
                        onChange={handleUserDetailChange}
                      />
                      <input
                        name="street"
                        placeholder="Ulice a číslo"
                        value={userDetailForm.street}
                        onChange={handleUserDetailChange}
                      />
                      <input
                        name="city"
                        placeholder="Město"
                        value={userDetailForm.city}
                        onChange={handleUserDetailChange}
                      />
                      <input
                        name="zipCode"
                        placeholder="PSČ"
                        value={userDetailForm.zipCode}
                        onChange={handleUserDetailChange}
                      />
                      <input
                        name="country"
                        placeholder="Země"
                        value={userDetailForm.country}
                        onChange={handleUserDetailChange}
                      />

                      <select
                        name="role"
                        value={userDetailForm.role}
                        onChange={handleUserDetailChange}
                      >
                        <option value="user">Uživatel</option>
                        <option value="admin">Admin</option>
                      </select>

                      <button type="submit" className="profile-action-btn">
                        Uložit změny
                      </button>
                    </form>

                    <div className="admin-user-orders-grid">
                      <div className="admin-user-orders-column">
                        <h3>Aktivní objednávky</h3>

                        {activeUserOrders.length === 0 ? (
                          <p className="empty-text">
                            Žádné aktivní objednávky.
                          </p>
                        ) : (
                          activeUserOrders.map((order) => (
                            <details key={order._id} className="order-card">
                              <summary>
                                {new Date(order.createdAt).toLocaleDateString(
                                  "cs-CZ",
                                )}{" "}
                                • {statusLabels[order.status] || order.status} •{" "}
                                {order.totalPrice} Kč
                              </summary>

                              <div className="order-items">
                                {order.items.map((item, index) => (
                                  <div key={index} className="order-item-row">
                                    <span>
                                      {item.name} × {item.quantity}
                                    </span>
                                    <span>{item.price * item.quantity} Kč</span>
                                  </div>
                                ))}
                              </div>
                            </details>
                          ))
                        )}
                      </div>

                      <div className="admin-user-orders-column">
                        <h3>Historie objednávek</h3>

                        {historyUserOrders.length === 0 ? (
                          <p className="empty-text">
                            Žádná historie objednávek.
                          </p>
                        ) : (
                          historyUserOrders.map((order) => (
                            <details key={order._id} className="order-card">
                              <summary>
                                {new Date(order.createdAt).toLocaleDateString(
                                  "cs-CZ",
                                )}{" "}
                                • {statusLabels[order.status] || order.status} •{" "}
                                {order.totalPrice} Kč
                              </summary>

                              <div className="order-items">
                                {order.items.map((item, index) => (
                                  <div key={index} className="order-item-row">
                                    <span>
                                      {item.name} × {item.quantity}
                                    </span>
                                    <span>{item.price * item.quantity} Kč</span>
                                  </div>
                                ))}
                              </div>
                            </details>
                          ))
                        )}
                      </div>
                    </div>
                  </section>
                )}
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
