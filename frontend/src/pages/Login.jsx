import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import login from '../assets/images/login.png';

 const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

   const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });

      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/');
      window.location.reload();
    } catch (err) {
      setError(err.response?.data?.message || 'Chyba při přihlášení.');
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
      <div className="login-card">
      <h1>Přihlášení</h1>
       {error && <div className="login-error">{error}</div>}

      <form className="login-form" onSubmit={handleSubmit}>
        <label htmlFor="email">Emailová adresa</label>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label htmlFor="password">Heslo</label>
        <input
          type="password"
          placeholder="Heslo"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Přihlásit se</button>
      </form>

      <div className="register">
  <p>Nemáš účet?</p>
  <button
    type="button"
    onClick={() => navigate('/register')}
    className="register-button"
  >
    Registrovat se
  </button>
</div>
    </div>
  </div>
  );




}
export default Login;