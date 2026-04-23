import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Newsletter() {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const [discountEmail, setDiscountEmail] = useState("");
  const [discountMessage, setDiscountMessage] = useState("");
  const navigate = useNavigate();

  const handleDiscountSignup = async (e) => {
    e.preventDefault();
    setDiscountMessage("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/check-email",
        {
          email: discountEmail,
        },
      );

      if (response.data.exists) {
        setDiscountMessage(
          "Tento email už má účet. Přihlas se do svého profilu.",
        );
        return;
      }

      navigate("/register", {
        state: { email: discountEmail },
      });
    } catch (err) {
      setDiscountMessage("Nepodařilo se zkontrolovat email.");
    }
  };

  return (
    <section id="newsletter" className="newsletter section">
      <div className="container">
        {!storedUser && (
          <div className="discount-box">
            <div className="discount-badge">-10 %</div>

            <h2 className="discount-title">Získej 10% slevu na první nákup</h2>

            <p className="discount-subtitle">
              Zadej svůj e-mail a po registraci získáš slevu do profilu.
            </p>

            <form onSubmit={handleDiscountSignup} className="discount-form">
              <input
                className="discount-input"
                type="email"
                placeholder="Zadej e-mail"
                value={discountEmail}
                onChange={(e) => setDiscountEmail(e.target.value)}
                required
              />

              <button type="submit" className="discount-button">
                Získat slevu
              </button>
            </form>

            {discountMessage && (
              <p className="discount-message">{discountMessage}</p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
