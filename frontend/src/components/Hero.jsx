import heroImage from "../assets/images/hero.png";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { User } from "lucide-react";       

export default function Hero() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
    window.location.reload();
  };





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
            <a href="#recenze">Recenze</a>
            
             {!user ? (
              <Link to="/login">Přihlásit se</Link>
            ) : (
              <div className="profile-menu-wrapper">
                <button
                className="profile-icon-btn"
                onClick={() => setMenuOpen(!menuOpen)}
>
                <User size={28} />
                </button>

                {menuOpen && (
                  <div className="profile-dropdown">
                    <p className="profile-name">
                      {user.name} {user.surname}
                    </p>
                    <Link to="/profile" className="dropdown-link">
                      Můj profil
                    </Link>
                    <button className="dropdown-logout" onClick={handleLogout}>
                      Odhlásit se
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </nav>


        <div className="hero-content">
          <h1>Oblečení, které dává smysl.</h1>
          <p>Udržitelné materiály. Férová výroba. Styl bez kompromisů.</p>
          <div className="hero-buttons">
          <button onClick={() => navigate('/catalog')}>
           Prohlédnout kolekci
          </button>

            <button
            className="secondary"
            onClick={() => document.getElementById('pribeh')?.scrollIntoView({ behavior: 'smooth' })}
            >
             Zjistit více
           </button>

           </div>
        </div>
      </div>
      
    </section>
    
  );
}