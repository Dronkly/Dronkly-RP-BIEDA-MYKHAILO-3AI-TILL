import { motion } from "framer-motion";

const values = [
  {
    title: "Udržitelné materiály",
    text: "Bio bavlna, len a recyklované tkaniny.",
  },
  {
    title: "Etická výroba",
    text: "Férové podmínky a zodpovědný přístup.",
  },
  {
    title: "Nízká uhlíková stopa",
    text: "Menší dopad na planetu.",
  },
];

export default function Values() {
  return (
    <section className="values-section">
      <div className="values-container">
        <p className="values-eyebrow">Naše hodnoty</p>
        <h2>Na čem nám záleží</h2>

        <div className="values-grid">
          <div className="value-card">
            <div className="value-icon">🌱</div>
            <h3>Udržitelné materiály</h3>
            <p>Bio bavlna, len a recyklované tkaniny.</p>
          </div>

          <div className="value-card">
            <div className="value-icon">🤝</div>
            <h3>Etická výroba</h3>
            <p>Férové podmínky a zodpovědný přístup.</p>
          </div>

          <div className="value-card">
            <div className="value-icon">🌍</div>
            <h3>Nízká uhlíková stopa</h3>
            <p>Menší dopad na planetu.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
