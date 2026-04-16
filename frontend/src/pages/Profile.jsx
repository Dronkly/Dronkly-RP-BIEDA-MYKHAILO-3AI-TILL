import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const storedUser = JSON.parse(localStorage.getItem('user'));
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    phone: '',
    birthDate: '',
    street: '',
    city: '',
    zipCode: '',
    country: '',
  });

  const [cardData, setCardData] = useState({
    cardholderName: '',
    cardBrand: 'Visa',
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    isDefault: false,
  });

  useEffect(() => {
    if (storedUser?.email) {
      fetchProfile();
    }
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/profile/${storedUser.email}`);
      const { user, paymentMethods } = response.data;

      setPaymentMethods(paymentMethods);

      setFormData({
        name: user.name || '',
        surname: user.surname || '',
        phone: user.phone || '',
        birthDate: user.birthDate || '',
        street: user.street || '',
        city: user.city || '',
        zipCode: user.zipCode || '',
        country: user.country || '',
      });
    } catch (err) {
      setError('Nepodařilo se načíst profil.');
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCardChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCardData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const response = await axios.put(
        `http://localhost:5000/api/profile/${storedUser.email}`,
        formData
      );

      setMessage(response.data.message);
      fetchProfile();
    } catch (err) {
      setError(err.response?.data?.message || 'Nepodařilo se uložit profil.');
    }
  };

  const handleAddCard = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const response = await axios.post(
        `http://localhost:5000/api/profile/${storedUser.email}/payment-methods`,
        cardData
      );

      setMessage(response.data.message);

      setCardData({
        cardholderName: '',
        cardBrand: 'Visa',
        cardNumber: '',
        expiryMonth: '',
        expiryYear: '',
        isDefault: false,
      });

      fetchProfile();
    } catch (err) {
      setError(err.response?.data?.message || 'Nepodařilo se přidat kartu.');
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

  const initials = `${formData.name?.[0] || ''}${formData.surname?.[0] || ''}`.toUpperCase();

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
    <button className="profile-home-btn" onClick={() => navigate('/')}>
      Zpět na domů
    </button>


            <div className="profile-avatar-large">
              {initials || 'U'}
            </div>
          </div>
        </div>

          {message && <div className="register-success">{message}</div>}
          {error && <div className="login-error">{error}</div>}

          <div className="profile-layout">
            <section className="profile-panel">
              <h2>Osobní údaje</h2>

              <form className="profile-grid-form" onSubmit={handleProfileSubmit}>
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
                  />
                </div>

                <div className="full-width">
                  <button type="submit" className="profile-action-btn">
                    Uložit profil
                  </button>
                </div>
              </form>
            </section>

            <section className="profile-panel">
              <h2>Platební metody</h2>

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
                  <p className="empty-text">Zatím nemáš žádnou uloženou kartu.</p>
                ) : (
                  paymentMethods.map((card) => (
                    <div key={card._id} className="payment-card-item">
                      <div className="payment-card-top">
                        <strong>{card.cardBrand}</strong>
                        {card.isDefault && <span className="default-badge">Výchozí</span>}
                      </div>

                      <p className="payment-card-number">•••• •••• •••• {card.last4}</p>
                      <p>{card.cardholderName}</p>
                      <p>Expirace: {card.expiryMonth}/{card.expiryYear}</p>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;