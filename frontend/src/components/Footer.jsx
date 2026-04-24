import { useNavigate } from "react-router-dom";

export default function Footer() {
  const navigate = useNavigate();
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <p>© 2026 EkoModa</p>
        <div>
          <button onClick={() => navigate("/pribeh")}>O nás</button>
          <button onClick={() => navigate("/contact")}>Kontakt</button>
        </div>
      </div>
    </footer>
  );
}
