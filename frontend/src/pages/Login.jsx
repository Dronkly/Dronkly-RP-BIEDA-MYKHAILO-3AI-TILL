import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import login from '../assets/images/login.png';

 const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
   const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (email === 'test@test.cz' && password === '123456') {
      navigate('/dashboard');
    } else {
      setError('Špatný email nebo heslo');
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
    </div>
  </div>
  );

}
export default Login;