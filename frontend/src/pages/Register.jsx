import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import login from '../assets/images/login.png';
import axios from 'axios';

const Register = () => {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Hesla se neshodují.');
      return;
    }

    if (password.length < 6) {
      setError('Heslo musí mít alespoň 6 znaků.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        name,
        surname,
        email,
        password
      });

      setSuccess(response.data.message);
      setCodeSent(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Registrace se nepodařila.');
    }
  };

  const handleVerifyCode = async () => {
    setError('');
    setSuccess('');

    try {
      const response = await axios.post('http://localhost:5000/api/auth/verify-code', {
        email,
        code: verificationCode
      });

      setSuccess(response.data.message);

      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Ověření kódu se nepodařilo.');
    }
  };

  return (
    <div
      className="login-page"
      style={{
        backgroundImage: `linear-gradient(rgba(33, 52, 43, 0.35), rgba(33, 52, 43, 0.35)), url(${login})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="login-card register-card">
        <h1>Registrace</h1>
        <p className="register-subtitle">
          Vytvoř si účet a získej přístup k dalším funkcím.
        </p>

        {error && <div className="login-error">{error}</div>}

        <form className="login-form" onSubmit={handleSubmit}>
          <label htmlFor="name">Jméno</label>
          <input
            id="name"
            type="text"
            placeholder="Zadej své jméno"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <label htmlFor="surname">Přijmení</label>
          <input
            id="surname"
            type="text"
            placeholder="Zadej své přijmení"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
            required
          />

         <label htmlFor="email">Emailová adresa</label>
          <input
            id="email"
            type="email"
            placeholder="Zadej e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="password">Heslo</label>
          <input
            id="password"
            type="password"
            placeholder="Zadej heslo"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <label htmlFor="confirmPassword">Potvrzení hesla</label>
          <input
            id="confirmPassword"
            type="password"
            placeholder="Zopakuj heslo"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <button type="submit">Vytvořit účet</button>
        </form>
            
             {codeSent && (
          <div className="verification-box">
            <label htmlFor="verificationCode">Ověřovací kód</label>
            <input
              id="verificationCode"
              type="text"
              placeholder="Zadej kód z emailu"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
            />
            <button type="button" onClick={handleVerifyCode}>
              Potvrdit kód
            </button>
          </div>
        )}




        <div className="login-register">
          <p>Už účet máš?</p>
          <Link to="/login" className="register-btn">
            Zpět na přihlášení
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;