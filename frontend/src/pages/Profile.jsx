import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const countryOptions = [
  "Česká republika",
  "Slovensko",
  "Německo",
  "Rakousko",
  "Polsko",
];

const formatCity = (value) =>
  value.replace(/[^a-zA-ZáčďéěíňóřšťúůýžÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ\s-]/g, "");

const formatStreet = (value) =>
  value
    .replace(/[^a-zA-Z0-9áčďéěíňóřšťúůýžÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ\s.,/\-]/g, "")
    .slice(0, 80);

const formatZipCode = (value) => {
  const digits = value.replace(/\D/g, "").slice(0, 5);
  return digits.length > 3
    ? `${digits.slice(0, 3)} ${digits.slice(3)}`
    : digits;
};

const formatCountry = (value) =>
  value.replace(/[^a-zA-ZáčďéěíňóřšťúůýžÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ\s-]/g, "").slice(0, 40);

const isValidCity = (value) =>
  /^[a-zA-ZáčďéěíňóřšťúůýžÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ\s-]{2,}$/.test(value);

const isValidZipCode = (value) => /^\d{3}\s?\d{2}$/.test(value);

const isValidCountry = (value) =>
  countryOptions.some(
    (country) => country.toLowerCase() === value.trim().toLowerCase(),
  );

const isValidPhone = (value) => /^\+?[0-9\s]{9,15}$/.test(value);

const onlyDigits = (value) => value.replace(/\D/g, "");

const formatCardNumber = (value) => {
  const digits = onlyDigits(value).slice(0, 16);
  return digits.replace(/(.{4})/g, "$1 ").trim();
};

const Profile = () => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [orders, setOrders] = useState([]);
  const [profileOpen, setProfileOpen] = useState(true);
  const [paymentsOpen, setPaymentsOpen] = useState(true);
  const [discounts, setDiscounts] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    phone: "",
    birthDate: "",
    street: "",
    city: "",
    zipCode: "",
    country: "",
  });

  const [cardData, setCardData] = useState({
    cardholderName: "",
    cardBrand: "Visa",
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    isDefault: false,
  });

  useEffect(() => {
    if (storedUser?.email) {
      fetchProfile();
      fetchOrders();
    }
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/profile/${storedUser.email}`,
      );
      const { user, paymentMethods } = response.data;
      setDiscounts(user.discounts || []);

      setPaymentMethods(paymentMethods);

      setFormData({
        name: user.name || "",
        surname: user.surname || "",
        phone: user.phone || "",
        birthDate: user.birthDate || "",
        street: user.street || "",
        city: user.city || "",
        zipCode: user.zipCode || "",
        country: user.country || "",
      });
    } catch (err) {
      setError("Nepodařilo se načíst profil.");
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/orders/user/${storedUser.email}`,
      );
      setOrders(response.data);
    } catch (err) {
      console.error("Chyba při načítání objednávek:", err);
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === "city") {
      newValue = formatCity(value);
    }

    if (name === "street") {
      newValue = formatStreet(value);
    }

    if (name === "zipCode") {
      newValue = formatZipCode(value);
    }

    if (name === "country") {
      newValue = formatCountry(value);
    }

    if (name === "phone") {
      newValue = value.replace(/[^0-9+\s]/g, "").slice(0, 15);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleCardChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newValue = value;

    if (name === "cardholderName") {
      newValue = value
        .replace(/[^a-zA-ZáčďéěíňóřšťúůýžÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ\s-]/g, "")
        .slice(0, 50);
    }

    if (name === "cardNumber") {
      newValue = formatCardNumber(value);
    }

    if (name === "expiryMonth") {
      newValue = onlyDigits(value).slice(0, 2);
    }

    if (name === "expiryYear") {
      newValue = onlyDigits(value).slice(0, 4);
    }

    setCardData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : newValue,
    }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    if (formData.phone && !isValidPhone(formData.phone)) {
      setError("Zadej platné telefonní číslo.");
      return;
    }

    if (formData.city && !isValidCity(formData.city)) {
      setError("Zadej platné město.");
      return;
    }

    if (formData.zipCode && !isValidZipCode(formData.zipCode)) {
      setError("PSČ musí být ve formátu 123 45.");
      return;
    }

    if (formData.country && !isValidCountry(formData.country)) {
      setError("Vyber platnou zemi z nabídky.");
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:5000/api/profile/${storedUser.email}`,
        formData,
      );

      setMessage(response.data.message);
      fetchProfile();
    } catch (err) {
      setError(err.response?.data?.message || "Nepodařilo se uložit profil.");
    }
  };

  const handleAddCard = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    const rawCardNumber = onlyDigits(cardData.cardNumber);

    if (!cardData.cardholderName.trim()) {
      setError("Zadej jméno na kartě.");
      return;
    }

    if (
      !/^[a-zA-ZáčďéěíňóřšťúůýžÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ\s-]{2,}$/.test(
        cardData.cardholderName.trim(),
      )
    ) {
      setError("Jméno na kartě obsahuje neplatné znaky.");
      return;
    }

    if (rawCardNumber.length !== 16) {
      setError("Číslo karty musí mít 16 číslic.");
      return;
    }

    const month = Number(cardData.expiryMonth);
    if (!cardData.expiryMonth || month < 1 || month > 12) {
      setError("Měsíc expirace musí být od 1 do 12.");
      return;
    }

    if (!/^\d{4}$/.test(cardData.expiryYear)) {
      setError("Rok expirace musí mít 4 číslice.");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:5000/api/profile/${storedUser.email}/payment-methods`,
        cardData,
      );

      setMessage(response.data.message);

      setCardData({
        cardholderName: "",
        cardBrand: "Visa",
        cardNumber: "",
        expiryMonth: "",
        expiryYear: "",
        isDefault: false,
      });

      fetchProfile();
    } catch (err) {
      setError(err.response?.data?.message || "Nepodařilo se přidat kartu.");
    }
  };

  const handleDeleteCard = async (methodId) => {
    setMessage("");
    setError("");

    try {
      const response = await axios.delete(
        `http://localhost:5000/api/profile/${storedUser.email}/payment-methods/${methodId}`,
      );

      setMessage(response.data.message);
      fetchProfile();
    } catch (err) {
      setError(err.response?.data?.message || "Nepodařilo se smazat kartu.");
    }
  };

  if (!storedUser) {
    return (
      <div className="profile-page">
        <div className="profile-shell">
          <div className="profile-main-card">
            <h1>Můj profil</h1>
            <p>Nejprve se přihlas.</p>
          </div>
        </div>
      </div>
    );
  }

  const initials =
    `${formData.name?.[0] || ""}${formData.surname?.[0] || ""}`.toUpperCase();

  const activeOrders = orders.filter((order) =>
    ["paid", "processing", "shipped"].includes(order.status),
  );

  const orderHistory = orders.filter((order) =>
    ["delivered", "cancelled"].includes(order.status),
  );

  return (
    <div className="profile-page">
      <div className="profile-shell">
        <div className="profile-main-card">
          <div className="profile-topbar">
            <div>
              <p className="profile-eyebrow">Uživatelský účet</p>
              <h1>Můj profil</h1>
              <p className="profile-subtitle">
                Správa osobních údajů, kontaktů a platebních metod.
              </p>
            </div>
            <div className="profile-topbar-actions">
              <button
                className="profile-home-btn"
                onClick={() => navigate("/")}
              >
                Zpět na domů
              </button>

              <div className="profile-avatar-large">{initials || "U"}</div>
            </div>
          </div>

          {message && <div className="register-success">{message}</div>}
          {error && <div className="login-error">{error}</div>}

          <div className="profile-layout">
            <section className="profile-panel">
              <button
                className="profile-section-toggle"
                onClick={() => setProfileOpen(!profileOpen)}
              >
                <span>Osobní údaje</span>
                <span>{profileOpen ? "−" : "+"}</span>
              </button>

              {profileOpen && (
                <form
                  className="profile-grid-form"
                  onSubmit={handleProfileSubmit}
                >
                  <div className="form-group">
                    <label htmlFor="name">Jméno</label>
                    <input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleProfileChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="surname">Příjmení</label>
                    <input
                      id="surname"
                      name="surname"
                      value={formData.surname}
                      onChange={handleProfileChange}
                    />
                  </div>

                  <div className="form-group full-width">
                    <label htmlFor="email">Email</label>
                    <input id="email" value={storedUser.email} disabled />
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone">Telefon</label>
                    <input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleProfileChange}
                      placeholder="+420 123 456 789"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="birthDate">Datum narození</label>
                    <input
                      id="birthDate"
                      name="birthDate"
                      type="date"
                      value={formData.birthDate}
                      onChange={handleProfileChange}
                    />
                  </div>

                  <div className="form-group full-width">
                    <label htmlFor="street">Ulice a číslo</label>
                    <input
                      id="street"
                      name="street"
                      value={formData.street}
                      onChange={handleProfileChange}
                      placeholder="Např. Zelená 15"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="city">Město</label>
                    <input
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleProfileChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="zipCode">PSČ</label>
                    <input
                      id="zipCode"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleProfileChange}
                    />
                  </div>

                  <div className="form-group full-width">
                    <label htmlFor="country">Země</label>
                    <input
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleProfileChange}
                      list="country-options"
                    />

                    <datalist id="country-options">
                      {countryOptions.map((country) => (
                        <option key={country} value={country} />
                      ))}
                    </datalist>
                  </div>

                  <div className="full-width">
                    <button type="submit" className="profile-action-btn">
                      Uložit profil
                    </button>
                  </div>
                </form>
              )}
            </section>

            <section className="profile-panel">
              <button
                className="profile-section-toggle"
                onClick={() => setPaymentsOpen(!paymentsOpen)}
              >
                <span>Platební metody</span>
                <span>{paymentsOpen ? "−" : "+"}</span>
              </button>

              {paymentsOpen && (
                <>
                  <form className="profile-grid-form" onSubmit={handleAddCard}>
                    <div className="form-group full-width">
                      <label htmlFor="cardholderName">Jméno na kartě</label>
                      <input
                        id="cardholderName"
                        name="cardholderName"
                        value={cardData.cardholderName}
                        onChange={handleCardChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="cardBrand">Značka karty</label>
                      <select
                        id="cardBrand"
                        name="cardBrand"
                        value={cardData.cardBrand}
                        onChange={handleCardChange}
                        className="profile-select"
                      >
                        <option>Visa</option>
                        <option>Mastercard</option>
                        <option>Maestro</option>
                        <option>JCB</option>
                        <option>American Express</option>
                        <option>Jiná</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="cardNumber">Číslo karty</label>
                      <input
                        id="cardNumber"
                        name="cardNumber"
                        value={cardData.cardNumber}
                        onChange={handleCardChange}
                        placeholder="1234 5678 9012 3456"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="expiryMonth">Měsíc expirace</label>
                      <input
                        id="expiryMonth"
                        name="expiryMonth"
                        value={cardData.expiryMonth}
                        onChange={handleCardChange}
                        placeholder="MM"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="expiryYear">Rok expirace</label>
                      <input
                        id="expiryYear"
                        name="expiryYear"
                        value={cardData.expiryYear}
                        onChange={handleCardChange}
                        placeholder="YYYY"
                        required
                      />
                    </div>

                    <div className="form-group full-width">
                      <label className="checkbox-row">
                        <input
                          type="checkbox"
                          name="isDefault"
                          checked={cardData.isDefault}
                          onChange={handleCardChange}
                        />
                        Nastavit jako výchozí
                      </label>
                    </div>

                    <div className="full-width">
                      <button type="submit" className="profile-action-btn">
                        Přidat kartu
                      </button>
                    </div>
                  </form>

                  <div className="payment-methods-list">
                    {paymentMethods.length === 0 ? (
                      <p className="empty-text">
                        Zatím nemáš žádnou uloženou kartu.
                      </p>
                    ) : (
                      paymentMethods.map((card) => (
                        <div key={card._id} className="payment-card-item">
                          <div className="payment-card-top">
                            <strong>{card.cardBrand}</strong>
                            {card.isDefault && (
                              <span className="default-badge">Výchozí</span>
                            )}
                          </div>

                          <p className="payment-card-number">
                            •••• •••• •••• {card.last4}
                          </p>
                          <p>{card.cardholderName}</p>
                          <p>
                            Expirace: {card.expiryMonth}/{card.expiryYear}
                          </p>

                          <button
                            type="button"
                            className="delete-card-btn"
                            onClick={() => handleDeleteCard(card._id)}
                          >
                            Smazat
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </>
              )}
            </section>

            <section className="profile-panel">
              <h2>Moje slevy</h2>

              {discounts.filter((d) => !d.isUsed).length === 0 ? (
                <p className="empty-text">
                  Momentálně nemáš žádné aktivní slevy.
                </p>
              ) : (
                <div className="discount-list">
                  {discounts
                    .filter((discount) => !discount.isUsed)
                    .map((discount, index) => (
                      <div key={index} className="discount-card">
                        <h3>{discount.title}</h3>
                        <p>
                          Kód: <strong>{discount.code}</strong>
                        </p>
                        <p>Sleva: {discount.value}%</p>
                      </div>
                    ))}
                </div>
              )}
            </section>

            <section className="profile-panel">
              <h2>Aktivní objednávky</h2>

              {activeOrders.length === 0 ? (
                <p className="empty-text">Nemáš žádné aktivní objednávky.</p>
              ) : (
                <div className="orders-list">
                  {activeOrders.map((order) => (
                    <details key={order._id} className="order-card">
                      <summary>
                        Objednávka z{" "}
                        {new Date(order.createdAt).toLocaleString("cs-CZ", {
                          day: "numeric",
                          month: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}{" "}
                        • {order.status} • {order.totalPrice} Kč
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
                  ))}
                </div>
              )}
            </section>

            <section className="profile-panel">
              <h2>Historie objednávek</h2>

              {orderHistory.length === 0 ? (
                <p className="empty-text">
                  Zatím nemáš žádnou historii objednávek.
                </p>
              ) : (
                <div className="orders-list">
                  {orderHistory.map((order) => (
                    <details key={order._id} className="order-card">
                      <summary>
                        Objednávka z{" "}
                        {new Date(order.createdAt).toLocaleString("cs-CZ", {
                          day: "numeric",
                          month: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}{" "}
                        • {order.status} • {order.totalPrice} Kč
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
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
