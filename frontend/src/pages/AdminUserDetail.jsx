import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const statusLabels = {
  paid: "Zaplaceno",
  processing: "Připravujeme",
  shipped: "Na cestě",
  out_for_delivery: "Doručujeme dnes",
  delivered: "Doručeno",
  cancelled: "Zrušeno",
};

const AdminUserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem("user"));

  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserOrders, setSelectedUserOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [orderStatusForm, setOrderStatusForm] = useState({});

  const [discountForm, setDiscountForm] = useState({
    title: "",
    code: "",
    value: "",
  });

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

    fetchUserDetail();
  }, [id]);

  const fetchUserDetail = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/profile/admin/users/${id}`,
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
      setError("Nepodařilo se načíst detail uživatele.");
    } finally {
      setLoading(false);
    }
  };

  const handleUserDetailChange = (e) => {
    const { name, value } = e.target;
    setUserDetailForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

const handleUpdateUserOrderStatus = async (orderId) => {
  setMessage("");
  setError("");

  try {
    const data = orderStatusForm[orderId] || {};

    const response = await axios.put(
      `http://localhost:5000/api/orders/${orderId}/status`,
      {
        status: data.status,
        deliveryEstimateDays: data.deliveryEstimateDays || null,
        deliveryWindowStart: data.deliveryWindowStart || "",
        deliveryWindowEnd: data.deliveryWindowEnd || "",
        sendEmail: data.sendEmail || false,
      }
    );

    setMessage(response.data.message || "Stav objednávky byl změněn.");
    fetchUserDetail();
  } catch (err) {
    setError(
      err.response?.data?.message || "Nepodařilo se změnit stav objednávky."
    );
  }
};

  const handleOrderStatusChange = (orderId, field, value) => {
    setOrderStatusForm((prev) => ({
      ...prev,
      [orderId]: {
        ...(prev[orderId] || {}),
        [field]: value,
      },
    }));
  };

const handleDeleteUserOrder = async (orderId) => {
  const confirmed = window.confirm("Opravdu chceš smazat tuto objednávku?");
  if (!confirmed) return;

  setMessage("");
  setError("");

  try {
    const response = await axios.delete(
      `http://localhost:5000/api/orders/${orderId}`
    );

    setMessage(response.data.message || "Objednávka byla smazána.");
    fetchUserDetail();
  } catch (err) {
    setError(
      err.response?.data?.message || "Nepodařilo se smazat objednávku."
    );
  }
};

  const handleUserDetailSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const response = await axios.put(
        `http://localhost:5000/api/profile/admin/users/${id}`,
        userDetailForm,
      );

      setMessage(response.data.message || "Uživatel byl upraven.");
      fetchUserDetail();
    } catch (err) {
      setError(
        err.response?.data?.message || "Nepodařilo se upravit uživatele.",
      );
    }
  };

  const handleDiscountFormChange = (e) => {
    const { name, value } = e.target;
    setDiscountForm((prev) => ({
      ...prev,
      [name]: name === "value" ? value.replace(/\D/g, "") : value,
    }));
  };

  const handleAddDiscountToUser = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const response = await axios.post(
        `http://localhost:5000/api/profile/admin/users/${id}/discounts`,
        {
          title: discountForm.title,
          code: discountForm.code,
          value: Number(discountForm.value),
        },
      );

      setMessage(response.data.message || "Sleva byla přidána.");
      setDiscountForm({
        title: "",
        code: "",
        value: "",
      });
      fetchUserDetail();
    } catch (err) {
      setError(err.response?.data?.message || "Nepodařilo se přidat slevu.");
    }
  };

  const activeUserOrders = selectedUserOrders.filter((order) =>
    ["paid", "processing", "shipped", "out_for_delivery"].includes(
      order.status,
    ),
  );

  const historyUserOrders = selectedUserOrders.filter((order) =>
    ["delivered", "cancelled"].includes(order.status),
  );

  if (loading) {
    return (
      <div className="admin-detail-page">
        <p>Načítání uživatele...</p>
      </div>
    );
  }

  if (!selectedUser) {
    return (
      <div className="admin-detail-page">
        <p>Uživatel nebyl nalezen.</p>
      </div>
    );
  }

  return (
    <div className="admin-detail-page">
      <div className="admin-detail-shell">
        <div className="admin-detail-topbar">
          <div>
            <p className="profile-eyebrow">Administrace</p>
            <h1>
              {selectedUser.name} {selectedUser.surname}
            </h1>
            <p className="profile-subtitle">{selectedUser.email}</p>
          </div>

          <button
            className="profile-home-btn"
            onClick={() => navigate("/admin")}
          >
            Zpět do administrace
          </button>
        </div>

        {message && <div className="register-success">{message}</div>}
        {error && <div className="login-error">{error}</div>}

        <div className="admin-user-detail-layout">
          <section className="admin-detail-card">
            <h2>Údaje uživatele</h2>

            <form className="admin-form" onSubmit={handleUserDetailSubmit}>
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

              <div className="admin-select-wrap">
                <label className="admin-field-label">Role</label>
                <select
                  name="role"
                  value={userDetailForm.role}
                  onChange={handleUserDetailChange}
                  className="admin-pretty-select"
                >
                  <option value="user">Uživatel</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <button type="submit" className="profile-action-btn">
                Uložit změny
              </button>
            </form>
          </section>

          <section className="admin-detail-card">
            <h2>Přidat slevu</h2>

            <form className="admin-form" onSubmit={handleAddDiscountToUser}>
              <input
                name="title"
                placeholder="Název slevy"
                value={discountForm.title}
                onChange={handleDiscountFormChange}
              />
              <input
                name="code"
                placeholder="Kód slevy"
                value={discountForm.code}
                onChange={handleDiscountFormChange}
              />
              <input
                name="value"
                placeholder="Sleva v %"
                value={discountForm.value}
                onChange={handleDiscountFormChange}
              />

              <button type="submit" className="profile-action-btn">
                Přidat slevu
              </button>
            </form>

            <div className="admin-user-discounts">
              <h3>Slevy uživatele</h3>

              {selectedUser.discounts?.length ? (
                selectedUser.discounts.map((discount, index) => (
                  <div key={index} className="discount-card">
                    <p>
                      <strong>{discount.title}</strong>
                    </p>
                    <p>Kód: {discount.code}</p>
                    <p>Sleva: {discount.value}%</p>
                    <p>Stav: {discount.isUsed ? "Použito" : "Aktivní"}</p>
                  </div>
                ))
              ) : (
                <p className="empty-text">Uživatel zatím nemá žádné slevy.</p>
              )}
            </div>
          </section>
        </div>

        <div className="admin-user-orders-grid">
          <section className="admin-detail-card">
            <h2>Aktivní objednávky</h2>

            {activeUserOrders.length === 0 ? (
              <p className="empty-text">Žádné aktivní objednávky.</p>
            ) : (
              activeUserOrders.map((order) => {
                const current = orderStatusForm[order._id] || {};

                return (
                  <div key={order._id} className="admin-user-order-card">
                    <div className="admin-user-order-top">
                      <div>
                        <h4>
                          {new Date(order.createdAt).toLocaleDateString(
                            "cs-CZ",
                          )}{" "}
                          • {order.totalPrice} Kč
                        </h4>
                        <p>
                          Aktuální stav:{" "}
                          {statusLabels[order.status] || order.status}
                        </p>
                      </div>
                    </div>

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

                    <div className="admin-user-order-controls">
                      <div className="admin-select-wrap">
                        <label className="admin-field-label">Nový stav</label>
                        <select
                          className="admin-pretty-select"
                          value={current.status || order.status}
                          onChange={(e) =>
                            handleOrderStatusChange(
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
                      </div>

                      {(current.status || order.status) === "shipped" && (
                        <input
                          className="admin-inline-input"
                          type="number"
                          placeholder="Za kolik dní dorazí"
                          value={current.deliveryEstimateDays || ""}
                          onChange={(e) =>
                            handleOrderStatusChange(
                              order._id,
                              "deliveryEstimateDays",
                              e.target.value,
                            )
                          }
                        />
                      )}

                      {(current.status || order.status) ===
                        "out_for_delivery" && (
                        <div className="admin-delivery-window">
                          <input
                            className="admin-inline-input"
                            type="text"
                            placeholder="Od (např. 13:00)"
                            value={current.deliveryWindowStart || ""}
                            onChange={(e) =>
                              handleOrderStatusChange(
                                order._id,
                                "deliveryWindowStart",
                                e.target.value,
                              )
                            }
                          />
                          <input
                            className="admin-inline-input"
                            type="text"
                            placeholder="Do (např. 15:00)"
                            value={current.deliveryWindowEnd || ""}
                            onChange={(e) =>
                              handleOrderStatusChange(
                                order._id,
                                "deliveryWindowEnd",
                                e.target.value,
                              )
                            }
                          />
                        </div>
                      )}

                      <label className="checkbox-row">
                        <input
                          type="checkbox"
                          checked={current.sendEmail || false}
                          onChange={(e) =>
                            handleOrderStatusChange(
                              order._id,
                              "sendEmail",
                              e.target.checked,
                            )
                          }
                        />
                        Poslat email zákazníkovi
                      </label>

                      <div className="admin-order-detail-actions">
                        <button
                          type="button"
                          className="profile-action-btn"
                          onClick={() => handleUpdateUserOrderStatus(order._id)}
                        >
                          Uložit stav
                        </button>

                        <button
                          type="button"
                          className="delete-card-btn"
                          onClick={() => handleDeleteUserOrder(order._id)}
                        >
                          Smazat objednávku
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </section>

          <section className="admin-detail-card">
            <h2>Historie objednávek</h2>

            {historyUserOrders.length === 0 ? (
              <p className="empty-text">Žádná historie objednávek.</p>
            ) : (
              historyUserOrders.map((order) => (
                <div key={order._id} className="admin-user-order-card">
                  <div className="admin-user-order-top">
                    <div>
                      <h4>
                        {new Date(order.createdAt).toLocaleDateString("cs-CZ")}{" "}
                        • {order.totalPrice} Kč
                      </h4>
                      <p>Stav: {statusLabels[order.status] || order.status}</p>
                    </div>
                  </div>

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

                  <div className="admin-order-detail-actions">
                    <button
                      type="button"
                      className="delete-card-btn"
                      onClick={() => handleDeleteUserOrder(order._id)}
                    >
                      Smazat objednávku
                    </button>
                  </div>
                </div>
              ))
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default AdminUserDetail;
