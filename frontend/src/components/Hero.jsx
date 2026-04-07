import heroImage from "../assets/images/hero.png";
export default function Hero() {
  return (
    <section
  className="hero"
  style={{
    backgroundImage: `url(${heroImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center"
  }}
>
      <div className="overlay">
        <nav className="navbar">
          <div className="logo">EkoModa</div>
          <div className="nav-links">
            <a href="#kolekce">Kolekce</a>
            <a href="#pribeh">Náš příběh</a>
            <a href="#recenze">Recenze</a>
            <a href="#newsletter">Přihlásit se</a>
          </div>
        </nav>

        <div className="hero-content">
          <h1>Oblečení, které dává smysl.</h1>
          <p>Udržitelné materiály. Férová výroba. Styl bez kompromisů.</p>
          <div className="hero-buttons">
            <button>Prohlédnout kolekci</button>
            <button className="secondary">Zjistit více</button>
          </div>
        </div>
      </div>
    </section>
  );
}