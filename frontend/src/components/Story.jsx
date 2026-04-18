import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";





export default function Story() {

   const navigate = useNavigate();
  return (
    <section id="pribeh" className="story section">
      <div className="container story-grid">
        <motion.div
          initial={{ opacity: 0, x: -35 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <img
            src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f"
            alt="Příběh značky"
          />
        </motion.div>
       <motion.div
          className="story-text"
          initial={{ opacity: 0, x: 35 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h2>Náš příběh</h2>
          <p>
            Věříme, že móda může být šetrná k planetě i lidem. Každý kousek
            navrhujeme tak, aby byl nadčasový, pohodlný a vyrobený z kvalitních
            přírodních nebo recyklovaných materiálů.
          </p>
          <button onClick={() => navigate('/about')}>
            Náš příběh
          </button>
        </motion.div>
      </div>
    </section>
  );
}