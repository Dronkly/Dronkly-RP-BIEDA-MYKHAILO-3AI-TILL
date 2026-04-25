import heroImage from "../assets/images/hero.png";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { User } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";
import { useCart } from "../context/CartContext";

export default function Hero() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [menuOpen, setMenuOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { clearCart } = useCart();

  useEffect(() => {
    const params = new URLSearchParams(location.search);

    if (params.get("payment") !== "success") return;

    const pendingOrder = JSON.parse(localStorage.getItem("pendingOrder"));
    const alreadyProcessed = localStorage.getItem("orderProcessed");

    if (!pendingOrder || alreadyProcessed) return;

    localStorage.setItem("orderProcessed", "true");

    axios
      .post("http://localhost:5000/api/orders", pendingOrder)
      .then(() => {
        localStorage.removeItem("pendingOrder");
        clearCart();
        setShowSuccess(true);

        setTimeout(() => {
          setShowSuccess(false);
          localStorage.removeItem("orderProcessed");
          navigate("/", { replace: true });
        }, 3000);
      })
      .catch((err) => {
        console.error(err);
        localStorage.removeItem("orderProcessed");
        alert("Platba proběhla, ale objednávku se nepodařilo uložit.");
      });
  }, [location.search, clearCart, navigate]);

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
        backgroundPosition: "center",
      }}
    >
      {showSuccess && (
        <div className="payment-success-toast">
          <strong>Platba proběhla úspěšně</strong>
          <span>Objednávka byla vytvořena.</span>
        </div>
      )}

      <div className="overlay">
        <nav className="navbar">
          <div className="logo">EkoModa</div>

          <div className="nav-links">
            <button onClick={() => navigate("/catalog")}>Kolekce</button>
            <button onClick={() => navigate("/reviews")}>Recenze</button>

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

                    {user?.role === "admin" && (
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
            <button onClick={() => navigate("/catalog")}>
              Prohlédnout kolekci
            </button>

            <button
              className="secondary"
              onClick={() =>
                document
                  .getElementById("pribeh")
                  ?.scrollIntoView({ behavior: "smooth" })
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
