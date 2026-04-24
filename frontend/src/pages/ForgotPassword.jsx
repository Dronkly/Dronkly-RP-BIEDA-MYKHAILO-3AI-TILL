import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const sendCode = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/forgot-password",
        { email }
      );

      setMessage(response.data.message);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || "Nepodařilo se odeslat kód.");
    }
  };

  const resetPassword = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/reset-password",
        {
          email,
          code,
          password,
        }
      );

      setMessage(response.data.message);

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Nepodařilo se změnit heslo.");
    }
  };

  return (
    <main className="forgot-page">
      <section className="forgot-card">
        <p className="profile-eyebrow">Obnovení účtu</p>
        <h1>Zapomenuté heslo</h1>
        <p>
          Zadej email, pošleme ti ověřovací kód a nastavíš si nové heslo.
        </p>

        {message && <div className="register-success">{message}</div>}
        {error && <div className="login-error">{error}</div>}

        {step === 1 ? (
          <form onSubmit={sendCode}>
            <label>Email</label>
            <input
              type="email"
              placeholder="tvuj@email.cz"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <button type="submit">Poslat kód</button>
          </form>
        ) : (
          <form onSubmit={resetPassword}>
            <label>Ověřovací kód</label>
            <input
              type="text"
              placeholder="123456"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />

            <label>Nové heslo</label>
            <input
              type="password"
              placeholder="Min. 8 znaků, A-z a číslo"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button type="submit">Změnit heslo</button>
          </form>
        )}

        <button
          type="button"
          className="forgot-back-btn"
          onClick={() => navigate("/login")}
        >
          Zpět na přihlášení
        </button>
      </section>
    </main>
  );
};

export default ForgotPassword;