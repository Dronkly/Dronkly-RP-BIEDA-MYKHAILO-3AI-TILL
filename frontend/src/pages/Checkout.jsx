import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, totalPrice, clearCart } = useCart();

  const storedUser = JSON.parse(localStorage.getItem('user'));

  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    cardholderName: '',
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    phone: '',
    email: storedUser?.email || '',
    street: '',
    city: '',
    zipCode: '',
    country: '',
  });

  useEffect(() => {
    if (storedUser?.email) {
      fetchPaymentMethods();
    }
  }, []);

  const fetchPaymentMethods = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/profile/${storedUser.email}`);
      setPaymentMethods(response.data.paymentMethods || []);
    } catch (err) {
      console.error('Chyba při načítání platebních metod:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (cartItems.length === 0) {
      setError('Košík je prázdný.');
      return;
    }

    try {
      const payload = {
        userEmail: storedUser?.email || '',
        items: cartItems,
        totalPrice,
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
        manualPayment:
          paymentMethods.length === 0
            ? {
                cardholderName: formData.cardholderName,
                cardLast4: formData.cardNumber.slice(-4),
                expiryMonth: formData.expiryMonth,
                expiryYear: formData.expiryYear,
              }
            : null,
      };

      const response = await axios.post('http://localhost:5000/api/orders', payload);

      setMessage(response.data.message || 'Platba proběhla úspěšně.');
      clearCart();

      setTimeout(() => {
        navigate('/catalog');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Platba se nepodařila.');
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
                  required
                />
              </div>

              <div className="checkout-section">
                <h2>Platba</h2>

                {paymentMethods.length > 0 ? (
                  <div className="saved-payments">
                    {paymentMethods.map((method) => (
                      <label key={method._id} className="saved-payment-card">
                        <input
                          type="radio"
                          name="savedPayment"
                          value={method._id}
                          checked={selectedPaymentMethod === method._id}
                          onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                        />
                        <span>
                          {method.cardBrand} •••• {method.last4} ({method.cardholderName})
                        </span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <>
                    <label>Jméno na kartě</label>
                    <input
                      name="cardholderName"
                      value={formData.cardholderName}
                      onChange={handleChange}
                      required
                    />

                    <label>Číslo karty</label>
                    <input
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleChange}
                      placeholder="1234 5678 9012 3456"
                      required
                    />

                    <label>Měsíc expirace</label>
                    <input
                      name="expiryMonth"
                      value={formData.expiryMonth}
                      onChange={handleChange}
                      placeholder="MM"
                      required
                    />

                    <label>Rok expirace</label>
                    <input
                      name="expiryYear"
                      value={formData.expiryYear}
                      onChange={handleChange}
                      placeholder="YYYY"
                      required
                    />
                  </>
                )}
              </div>

              <button type="submit" className="checkout-pay-btn">
                Zaplatit
              </button>
            </form>

            <div className="checkout-summary">
              <h2>Shrnutí objednávky</h2>

              {cartItems.map((item) => (
                <div key={item._id} className="checkout-summary-item">
                  <span>{item.name} × {item.quantity}</span>
                  <span>{item.price * item.quantity} Kč</span>
                </div>
              ))}

              <div className="checkout-total">
                <strong>Celkem:</strong>
                <strong>{totalPrice} Kč</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Checkout;