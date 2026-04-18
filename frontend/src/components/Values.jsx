import { motion } from "framer-motion";


const values = [
  {
    title: "Udržitelné materiály",
    text: "Bio bavlna, len a recyklované tkaniny."
  },
  {
    title: "Etická výroba",
    text: "Férové podmínky a zodpovědný přístup."
  },
  {
    title: "Nízká uhlíková stopa",
    text: "Menší dopad na planetu."
  }
];

export default function Values() {
  return (
     <section className="values section">
      <div className="container">

        <div className="section-heading">
          <p>Naše hodnoty</p>
          <h2>Na čem nám záleží</h2>
        </div>

        <div className="values-grid">
          {values.map((item, index) => (
            <motion.div
              className="value-card"
              key={index}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.6 }}
            >
              <div className="value-icon">{item.icon}</div>

              <h3>{item.title}</h3>
              <p className="value-main">{item.text}</p>
              <p className="value-desc">{item.description}</p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}