import { useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/subscribers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
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

  return (
    <section id="newsletter" className="newsletter section">
      <div className="container">
        <h2>Získej 10% slevu na první nákup</h2>
        <form className="newsletter-form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Zadej e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">Přihlásit se</button>
        </form>
        {message && <p className="form-message">{message}</p>}
      </div>
    </section>
  );
}