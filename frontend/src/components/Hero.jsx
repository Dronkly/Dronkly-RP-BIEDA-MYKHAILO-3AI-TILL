import heroImage from "../assets/images/hero.png";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { User } from "lucide-react";       
import { motion } from "framer-motion";

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
                    {user?.role === 'admin' && (
                     <Link to="/admin" className="dropdown-link">
                      Admin panel
                     </Link>
                    )}
                    <button className="dropdown-logout" onClick={handleLogout}>
                      Odhlásit se
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </nav>

         <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.p
            className="hero-eyebrow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6 }}
          >
            Eco fashion · moderní styl
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.75 }}
          >
            Oblečení, které dává smysl.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.75 }}
          >
            Udržitelné materiály. Férová výroba. Styl bez kompromisů.
          </motion.p>

          <motion.div
            className="hero-buttons"
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.75 }}
          >
             <button onClick={() => navigate('/catalog')}>
                Prohlédnout kolekci
             </button>

            <button
                className="secondary"
                onClick={() =>
                document.getElementById('pribeh')?.scrollIntoView({ behavior: 'smooth' })
              }
  >
                 Zjistit více
                  </button>
            
          </motion.div>

      </motion.div>
      </div>
  </section>

       
        
      
      
   
    
  );
}