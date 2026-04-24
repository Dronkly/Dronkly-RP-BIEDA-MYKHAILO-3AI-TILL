import React, { useEffect, useState } from "react";
import axios from "axios";

const Reviews = () => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  console.log("storedUser:", storedUser);

  const [reviews, setReviews] = useState([]);
  const [formData, setFormData] = useState({
    rating: 5,
    text: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/reviews");
      setReviews(response.data);
    } catch (err) {
      setError("Nepodařilo se načíst recenze.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    const userId = storedUser?._id || storedUser?.id;

    if (!userId) {
      setError("Pro napsání recenze se musíš přihlásit.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/reviews", {
        userId,
        rating: Number(formData.rating),
        text: formData.text,
      });

      setMessage(response.data.message || "Recenze byla odeslána.");
      setFormData({
        rating: 5,
        text: "",
      });
    } catch (err) {
      setError(err.response?.data?.message || "Nepodařilo se odeslat recenzi.");
    }
  };

  return (
    <>
      <main className="reviews-page">
        {/*Animovane pozadi */}
        <div className="reviews-floating-bg">
          <span className="float-item leaf-one">🍃</span>
          <span className="float-item leaf-two">✦</span>
          <span className="float-item leaf-three">🌿</span>
          <span className="float-item leaf-four">✧</span>
          <span className="float-item leaf-five">◌</span>
        </div>
        <section className="reviews-hero">
          <div className="reviews-hero-glow"></div>

          <div className="reviews-hero-content">
            <p className="reviews-eyebrow">Zkušenosti zákazníků</p>
            <h1>Recenze, které voní po bavlně, lnu a dobrém pocitu.</h1>
            <p>
              Přečti si hodnocení od lidí, kteří už EkoModu nosí. Nebo nám nech
              vlastní recenzi.
            </p>
          </div>
        </section>

        <section className="reviews-shell">
          <div className="reviews-grid">
            <div className="reviews-list">
              {reviews.length === 0 ? (
                <p className="empty-text">
                  Zatím nejsou žádné schválené recenze.
                </p>
              ) : (
                reviews.map((review) => (
                  <article key={review._id} className="review-card">
                    <div className="review-card-top">
                      <div className="review-avatar">
                        {`${review.user?.name?.[0] || ""}${review.user?.surname?.[0] || ""}`.toUpperCase() ||
                          "U"}
                      </div>

                      <div>
                        <h3>
                          {review.user?.name} {review.user?.surname}
                        </h3>
                        <div className="review-stars">
                          {"★".repeat(review.rating)}
                          {"☆".repeat(5 - review.rating)}
                        </div>
                      </div>
                    </div>

                    <p>{review.text}</p>
                  </article>
                ))
              )}
            </div>

            <aside className="review-form-card">
              <h2>Napiš recenzi</h2>
              <p>Recenze se zobrazí až po schválení adminem.</p>

              {message && <div className="register-success">{message}</div>}
              {error && <div className="login-error">{error}</div>}

              <form onSubmit={handleSubmit}>
                <label>Hodnocení</label>
                <select
                  value={formData.rating}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      rating: e.target.value,
                    }))
                  }
                >
                  <option value="5">★★★★★ 5</option>
                  <option value="4">★★★★☆ 4</option>
                  <option value="3">★★★☆☆ 3</option>
                  <option value="2">★★☆☆☆ 2</option>
                  <option value="1">★☆☆☆☆ 1</option>
                </select>

                <label>Text recenze</label>
                <textarea
                  rows={6}
                  value={formData.text}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      text: e.target.value,
                    }))
                  }
                  placeholder="Jak se ti líbí nákup, materiál nebo doručení?"
                  required
                />

                <button type="submit">Odeslat recenzi</button>
              </form>
            </aside>
          </div>
        </section>
      </main>
    </>
  );
};

export default Reviews;
