import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

const countryOptions = [
  "Česká republika",
  "Slovensko",
  "Německo",
  "Rakousko",
  "Polsko",
];

const onlyDigits = (value) => value.replace(/\D/g, "");

const formatCardNumber = (value) => {
  const digits = onlyDigits(value).slice(0, 16);
  return digits.replace(/(.{4})/g, "$1 ").trim();
};

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

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isValidPhone = (phone) => /^\+?[0-9\s]{9,15}$/.test(phone);
const isValidCity = (value) =>
  /^[a-zA-ZáčďéěíňóřšťúůýžÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ\s-]{2,}$/.test(value);
const isValidZipCode = (value) => /^\d{3}\s?\d{2}$/.test(value);
const isValidCountry = (value) =>
  countryOptions.some(
    (country) => country.toLowerCase() === value.trim().toLowerCase(),
  );

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, totalPrice } = useCart();

  const storedUser = JSON.parse(localStorage.getItem("user"));

  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [availableDiscounts, setAvailableDiscounts] = useState([]);
  const [selectedDiscountCode, setSelectedDiscountCode] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    cardholderName: "",
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    phone: "",
    email: storedUser?.email || "",
    street: "",
    city: "",
    zipCode: "",
    country: "",
  });

  useEffect(() => {
    if (storedUser?.email) {
      fetchPaymentMethods();
    }
  }, []);

  const fetchPaymentMethods = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/profile/${storedUser.email}`,
      );

      setPaymentMethods(response.data.paymentMethods || []);
      setAvailableDiscounts(
        (response.data.user?.discounts || []).filter(
          (discount) => !discount.isUsed,
        ),
      );
    } catch (err) {
      console.error("Chyba při načítání platebních metod:", err);
    }
  };

  const selectedDiscount = availableDiscounts.find(
    (discount) => discount.code === selectedDiscountCode,
  );

  const discountedTotalPrice = selectedDiscount
    ? Math.round(totalPrice * (1 - selectedDiscount.value / 100))
    : totalPrice;

  const handleChange = (e) => {
    const { name, value } = e.target;

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

    if (name === "phone") {
      newValue = value.replace(/[^0-9+\s]/g, "").slice(0, 15);
    }

    if (name === "zipCode") {
      newValue = formatZipCode(value);
    }

    if (name === "city") {
      newValue = formatCity(value);
    }

    if (name === "street") {
      newValue = formatStreet(value);
    }

    if (name === "country") {
      newValue = formatCountry(value);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!isValidEmail(formData.email)) {
      setError("Zadej platný email.");
      return;
    }

    if (!isValidPhone(formData.phone)) {
      setError("Zadej platné telefonní číslo.");
      return;
    }

    if (
      !formData.street ||
      !formData.city ||
      !formData.zipCode ||
      !formData.country
    ) {
      setError("Vyplň celou adresu.");
      return;
    }

    if (cartItems.length === 0) {
      setError("Košík je prázdný.");
      return;
    }

    if (!isValidCity(formData.city)) {
      setError("Zadej platné město.");
      return;
    }

    if (!isValidZipCode(formData.zipCode)) {
      setError("PSČ musí být ve formátu 123 45.");
      return;
    }

    if (!isValidCountry(formData.country)) {
      setError("Vyber platnou zemi z nabídky.");
      return;
    }

    try {
      const orderPayload = {
        userEmail: storedUser?.email || formData.email,
        customerName: storedUser?.name || "",
        customerSurname: storedUser?.surname || "",
        items: cartItems,
        totalPrice: discountedTotalPrice,
        originalPrice: totalPrice,
        appliedDiscount: selectedDiscount
          ? {
              code: selectedDiscount.code,
              value: selectedDiscount.value,
              title: selectedDiscount.title,
            }
          : null,
        paymentMethodId: selectedPaymentMethod || null,
        contact: {
          phone: formData.phone,
          email: formData.email,
        },
        address: {
          street: formData.street,
          city: formData.city,
          zipCode: formData.zipCode,
          country: formData.country,
        },
        manualPayment: null,
      };

      localStorage.setItem("pendingOrder", JSON.stringify(orderPayload));

      const stripePayload = {
        items: cartItems,
        customerEmail: formData.email,
        discountCode: selectedDiscount?.code || "",
      };

      const response = await axios.post(
        "http://localhost:5000/api/stripe/create-checkout-session",
        stripePayload,
      );

      window.location.href = response.data.url;
    } catch (err) {
      setError(err.response?.data?.message || "Platba se nepodařila.");
    }
  };

  return (
    <>
      <Header />

      <div className="checkout-page">
        <div className="checkout-shell">
          <div className="checkout-header">
            <h1>Dokončení objednávky</h1>
            <p>Zkontroluj údaje a potvrď platbu.</p>
          </div>

          {message && <div className="register-success">{message}</div>}
          {error && <div className="login-error">{error}</div>}

          <div className="checkout-layout">
            <form className="checkout-form" onSubmit={handleCheckout}>
              <div className="checkout-section">
                <h2>Kontakt</h2>

                <label>Telefon</label>
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />

                <label>Email</label>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="checkout-section">
                <h2>Adresa bydliště</h2>

                <label>Ulice a číslo</label>
                <input
                  name="street"
                  value={formData.street}
                  onChange={handleChange}
                  required
                />

                <label>Město</label>
                <input
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />

                <label>PSČ</label>
                <input
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  required
                />

                <label>Země</label>
                <input
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  list="countries"
                  required
                />

                <datalist id="countries">
                  {countryOptions.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
              </div>

              <div className="checkout-section">
                <h2>Platba</h2>

                <p className="checkout-stripe-info">
                  Platba
                </p>
              </div>

              {availableDiscounts.length > 0 && (
                <div className="checkout-section">
                  <h2>Sleva</h2>

                  <div className="checkout-discount-box">
                    <label>Vyber slevový kupón</label>

                    <select
                      className="checkout-discount-select"
                      value={selectedDiscountCode}
                      onChange={(e) => setSelectedDiscountCode(e.target.value)}
                    >
                      <option value="">Bez slevy</option>
                      {availableDiscounts.map((discount, index) => (
                        <option key={index} value={discount.code}>
                          {discount.title} - {discount.value}%
                        </option>
                      ))}
                    </select>

                    {selectedDiscount && (
                      <p className="checkout-discount-info">
                        Sleva {selectedDiscount.value}% bude odečtena z
                        objednávky.
                      </p>
                    )}
                  </div>
                </div>
              )}

              <button type="submit" className="checkout-pay-btn">
                Zaplatit
              </button>
            </form>

            <div className="checkout-summary">
              <h2>Shrnutí objednávky</h2>

              {cartItems.map((item) => (
                <div key={item._id} className="checkout-summary-item">
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <span>{item.price * item.quantity} Kč</span>
                </div>
              ))}

              {selectedDiscount && (
                <div className="checkout-summary-item">
                  <span>Sleva</span>
                  <span>- {selectedDiscount.value}%</span>
                </div>
              )}

              <div className="checkout-total">
                <strong>Celkem:</strong>
                <strong>{discountedTotalPrice} Kč</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Checkout;
