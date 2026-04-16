import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import heroImage from '../assets/images/hero.png';

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
      <section
        className="about-hero"
        style={{
          backgroundImage: `linear-gradient(rgba(33, 52, 43, 0.45), rgba(33, 52, 43, 0.45)), url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="about-overlay">
          <motion.div
            className="about-hero-content"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={0}
          >
            <p className="about-eyebrow">Náš příběh</p>
            <h1>Začali jsme s jednoduchou myšlenkou</h1>
            <p className="about-lead">
              Vytvářet oblečení, které je pohodlné, nadčasové a zároveň šetrnější
              k lidem i přírodě.
            </p>

            <div className="about-hero-buttons">
              <button className="about-primary-btn" onClick={() => navigate('/')}>
                Zpět na domů
              </button>
              <button className="about-secondary-btn" onClick={() => navigate('/profile')}>
                Můj profil
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="about-section">
        <div className="about-container about-grid">
          <motion.div
            className="about-text-card"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeUp}
            custom={0.1}
          >
            <h2>Jak to celé vzniklo</h2>
            <p>
              EkoModa vznikla z myšlenky, že móda nemusí být jen o vzhledu, ale i
              o hodnotách. Na začátku byla jednoduchá otázka: proč je tak těžké
              najít oblečení, které dobře vypadá, je příjemné na nošení a zároveň
              vzniká z odpovědnějších materiálů?
            </p>
            <p>
              Postupně jsme začali hledat lepší látky, jednodušší střihy a způsob,
              jak tvořit kolekce, které nejsou jen krátkodobým trendem. Cílem bylo
              vytvořit značku, která spojuje čistý styl, kvalitu a ohleduplnější
              přístup k výrobě.
            </p>
          </motion.div>

          <motion.div
            className="about-quote-card"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeUp}
            custom={0.2}
          >
            <p className="about-quote">
              „Nechceme vyrábět víc oblečení. Chceme vyrábět lepší oblečení.“
            </p>
          </motion.div>
        </div>
      </section>

      <section className="about-section soft-bg">
        <div className="about-container">
          <motion.div
            className="about-section-heading"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeUp}
            custom={0.1}
          >
            <p className="about-eyebrow green">Na čem nám záleží</p>
            <h2>Naše hodnoty</h2>
          </motion.div>

          <div className="about-values-grid">
            <motion.div
              className="about-value-card"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={0.1}
            >
              <h3>Kvalita před kvantitou</h3>
              <p>
                Navrhujeme kousky, které vydrží déle a mají smysl i po několika sezónách.
              </p>
            </motion.div>

            <motion.div
              className="about-value-card"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={0.2}
            >
              <h3>Jednoduchost</h3>
              <p>
                Věříme v čistý design, pohodlí a nadčasový styl bez zbytečných
                komplikací.
              </p>
            </motion.div>

            <motion.div
              className="about-value-card"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={0.3}
            >
              <h3>Ohleduplnější přístup</h3>
              <p>
                Hledáme lepší materiály a odpovědnější způsoby výroby, které mají
                menší dopad na okolí.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="about-section">
        <div className="about-container about-timeline">
          <motion.div
            className="about-section-heading"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeUp}
            custom={0.1}
          >
            <p className="about-eyebrow green">Cesta značky</p>
            <h2>Jak jsme rostli</h2>
          </motion.div>

          <motion.div
            className="timeline-item"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0.1}
          >
            <span className="timeline-year">2023</span>
            <div>
              <h3>První návrhy</h3>
              <p>
                Začali jsme navrhovat první kolekci s důrazem na jednoduché střihy,
                pohodlí a přirozené barvy.
              </p>
            </div>
          </motion.div>

          <motion.div
            className="timeline-item"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0.2}
          >
            <span className="timeline-year">2024</span>
            <div>
              <h3>Spuštění značky</h3>
              <p>
                Představili jsme první produkty a začali budovat komunitu lidí,
                kterým záleží na stylu i smyslu.
              </p>
            </div>
          </motion.div>

          <motion.div
            className="timeline-item"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0.3}
          >
            <span className="timeline-year">2025</span>
            <div>
              <h3>Rozšíření nabídky</h3>
              <p>
                Do kolekce jsme přidali nové střihy, více základních kousků a lepší
                zákaznickou zkušenost.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="about-cta-section">
        <motion.div
          className="about-cta-card"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={0.1}
        >
          <h2>Chceš vidět naši kolekci?</h2>
          <p>
            Podívej se na produkty, které vznikly z myšlenky dělat módu o něco lépe.
          </p>
          <button className="about-primary-btn" onClick={() => navigate('/')}>
            Zobrazit domovskou stránku
          </button>
        </motion.div>
      </section>
    </div>
  );
};

export default About;