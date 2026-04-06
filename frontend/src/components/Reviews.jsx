const reviews = [
  "Nejpohodlnější tričko, jaké jsem kdy měl.",
  "Skvělá kvalita a krásný design.",
  "Rychlé dodání a super služby."
];

export default function Reviews() {
  return (
    <section id="recenze" className="reviews section">
      <div className="container">
        <h2>Hodnocení zákazníků</h2>
        <div className="review-grid">
          {reviews.map((review, index) => (
            <div key={index} className="review-card">
              <p>“{review}”</p>
              <span>★★★★★</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}