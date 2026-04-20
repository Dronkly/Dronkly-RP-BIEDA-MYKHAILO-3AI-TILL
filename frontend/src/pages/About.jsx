import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Leaf, Globe, Shirt, ArrowLeft  } from "lucide-react";


const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      delay,
    },
  }),
};

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="about-page">
    <section className="about-hero-clean">
      <div className="about-hero-overlay-clean" />
      <img
        src="https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=1600&auto=format&fit=crop"
        alt="Móda"
        className="about-hero-image-clean"
      />

      <div className="about-hero-content-clean">
        <motion.p
          className="about-label"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          O značce
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          Náš příběh začal jednoduchou myšlenkou
        </motion.h1>

        <motion.p
          className="about-hero-text-clean"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          Vytvářet oblečení, které dobře vypadá, pohodlně se nosí a zároveň
          dává větší smysl. Věříme v jednoduchost, kvalitní materiály a styl,
          který nepodléhá rychlým trendům.
        </motion.p>

        <motion.div
          className="about-hero-actions-clean"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <button className="about-main-btn" onClick={() => navigate("/catalog")}>
            Prohlédnout kolekci
          </button>
          <button className="about-ghost-btn" onClick={() => navigate("/")}>
            <ArrowLeft size={18} />
            Zpět domů
          </button>
        </motion.div>
      </div>
    </section>

    <section className="about-intro-section">
      <div className="about-container-clean about-intro-grid">
        <motion.div
          className="about-intro-text"
          initial={{ opacity: 0, x: -35 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p className="about-label green">Jak to vzniklo</p>
          <h2>Nechtěli jsme dělat jen další oblečení</h2>
          <p>
            EkoModa vznikla z potřeby spojit moderní vzhled, pohodlí a
            odpovědnější přístup k módě. Od začátku jsme chtěli tvořit
            kolekce, které nepůsobí přehnaně, ale přirozeně zapadnou do
            každodenního života.
          </p>
          <p>
            Zaměřujeme se na jednoduché střihy, čistý design a materiály,
            které jsou příjemné na nošení. Naším cílem není zaplavit šatník
            zbytečnými kusy, ale nabídnout oblečení, které má delší životnost
            a nadčasový charakter.
          </p>
        </motion.div>

        <motion.div
          className="about-intro-image-wrap"
          initial={{ opacity: 0, x: 35 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <img
            src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=1200&auto=format&fit=crop"
            alt="Ateliér značky"
            className="about-intro-image"
          />
        </motion.div>
      </div>
    </section>

    <section className="about-values-section-clean">
      <div className="about-container-clean">
        <div className="about-values-head">
          <p className="about-label green">Na čem nám záleží</p>
          <h2>Hodnoty, na kterých stavíme</h2>
        </div>

        <div className="about-values-grid-clean">
          <motion.div
            className="about-value-card-clean"
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <div className="about-icon-box">
              <Leaf size={24} />
            </div>
            <h3>Šetrnější materiály</h3>
            <p>
              Hledáme kvalitní materiály, které působí přirozeně, dobře se
              nosí a dávají smysl i z dlouhodobého hlediska.
            </p>
          </motion.div>

          <motion.div
            className="about-value-card-clean"
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.1 }}
          >
            <div className="about-icon-box">
              <Shirt size={24} />
            </div>
            <h3>Nadčasový styl</h3>
            <p>
              Navrhujeme kousky, které nepůsobí jen jako trend jedné sezóny,
              ale dají se nosit opakovaně a snadno kombinovat.
            </p>
          </motion.div>

          <motion.div
            className="about-value-card-clean"
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.2 }}
          >
            <div className="about-icon-box">
              <Globe size={24} />
            </div>
            <h3>Odpovědnější přístup</h3>
            <p>
              Přemýšlíme nad tím, jak módu tvořit s větším respektem k lidem,
              výrobě i prostředí, ve kterém vzniká.
            </p>
          </motion.div>
        </div>
      </div>
    </section>

    <section className="about-gallery-section-clean">
      <div className="about-container-clean">
        <div className="about-gallery-grid-clean">
          <motion.img
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1200&auto=format&fit=crop"
            alt="Styl 1"
            className="about-gallery-item-clean tall"
          />
          <motion.img
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.08 }}
            src="https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=1200&auto=format&fit=crop"
            alt="Styl 2"
            className="about-gallery-item-clean"
          />
          <motion.img
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.16 }}
            src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop"
            alt="Styl 3"
            className="about-gallery-item-clean"
          />
        </div>
      </div>
    </section>
  </div>
);
};

export default About;