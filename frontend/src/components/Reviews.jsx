import { useEffect, useState } from "react";
import axios from "axios";

export default function Reviews() {
  const [homeReviews, setHomeReviews] = useState([]);

  useEffect(() => {
    fetchHomeReviews();
  }, []);

  const fetchHomeReviews = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/home-reviews",
      );
      setHomeReviews(response.data);
    } catch (err) {
      console.error("Nepodařilo se načíst homepage hodnocení:", err);
    }
  };

  return (
    <section id="recenze" className="home-reviews-section">
      <div className="home-reviews-shell">
        <p className="reviews-eyebrow">Hodnocení zákazníků</p>
        <h2>Co o nás říkají zákazníci</h2>

        <div className="home-reviews-grid">
          {homeReviews.length === 0 ? (
            <p className="empty-text">Zatím nejsou žádná hodnocení.</p>
          ) : (
            homeReviews.map((review) => (
              <article key={review._id} className="home-review-card">
                <div className="home-review-shine"></div>

                <div className="home-review-top">
                  <div className="home-review-avatar">
                    {review.image ? (
                      <img src={review.image} alt={review.name} />
                    ) : (
                      review.name?.[0]?.toUpperCase()
                    )}
                  </div>

                  <div>
                    <h3>{review.name}</h3>
                    <p>{review.role}</p>
                  </div>
                </div>

                <div className="review-stars">
                  {"★".repeat(review.rating)}
                  {"☆".repeat(5 - review.rating)}
                </div>

                <p>{review.text}</p>
              </article>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
