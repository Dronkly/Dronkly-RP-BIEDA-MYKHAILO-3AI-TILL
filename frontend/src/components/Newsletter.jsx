import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const [discountEmail, setDiscountEmail] = useState("");
  const [discountMessage, setDiscountMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/subscribers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      setMessage(data.message);

      if (res.ok) {
        setEmail("");
      }
    } catch (error) {
      setMessage("Nepodařilo se odeslat formulář.");
    }
  };

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
            <h2>Získej 10% slevu na první nákup</h2>

            <form onSubmit={handleDiscountSignup}>
              <input
                type="email"
                placeholder="Zadej e-mail"
                value={discountEmail}
                onChange={(e) => setDiscountEmail(e.target.value)}
                required
              />
              <button type="submit">Přihlásit se</button>
            </form>

            {discountMessage && <p className="discount-message">{discountMessage}</p>}
          </div>
        )}
        
      </div>
    </section>
  );
}
