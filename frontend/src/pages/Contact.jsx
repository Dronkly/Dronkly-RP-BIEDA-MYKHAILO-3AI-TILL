import React from "react";

const Contact = () => {
  return (
    <main className="contact-page">
      <section className="contact-hero">
        <p className="reviews-eyebrow">Kontakt</p>
        <h1>Jsme tu pro tebe</h1>
        <p>
          Máš otázku k objednávce, produktům nebo spolupráci? Ozvi se nám.
        </p>
      </section>

      <section className="contact-shell">
        <div className="contact-grid">
          <article className="contact-card owner-card">
            <span className="contact-badge">OWNER</span>
            <h2>Mykhailo Bieda</h2>
            <p>Zakladatel EkoModa</p>
            <div className="contact-info">
              <p>Email: mykhailo.bieda@ekomoda.cz</p>
              <p>Telefon: +420 777 482 913</p>
              <p>Město: Praha</p>
            </div>
          </article>

          <article className="contact-card">
            <span className="contact-badge">Podpora</span>
            <h2>Zákaznický servis</h2>
            <p>Pomoc s objednávkami a doručením.</p>
            <div className="contact-info">
              <p>Email: podpora@ekomoda.cz</p>
              <p>Telefon: +420 731 204 588</p>
              <p>Po–Pá: 9:00–17:00</p>
            </div>
          </article>

          <article className="contact-card">
            <span className="contact-badge">Showroom</span>
            <h2>EkoModa Studio</h2>
            <p>Místo pro vyzvednutí a konzultace.</p>
            <div className="contact-info">
              <p>Adresa: Zelená 24, Praha 2</p>
              <p>Email: showroom@ekomoda.cz</p>
              <p>Po–Čt: 10:00–18:00</p>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
};

export default Contact;