import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const navy = "#b94a3a";

const s = {
  wrap: { minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem", background: "linear-gradient(135deg, #b94a3a 0%, #9e3a2c 100%)", fontFamily: "'Inter', system-ui, -apple-system, sans-serif" },
  card: { background: "#ffffff", borderRadius: 16, border: "1px solid #e0e0e0", padding: "2.5rem", width: "100%", maxWidth: 420, boxShadow: "0 20px 60px rgba(0,0,0,0.15)" },
  logo: { textAlign: "center", marginBottom: "2rem" },
  logoText: { fontSize: "1.75rem", fontWeight: 700, color: navy, letterSpacing: "-0.5px" },
  logoSub: { fontSize: "0.85rem", color: "#6b6b6b", marginTop: 6 },
  title: { fontSize: "1.35rem", fontWeight: 600, color: navy, marginBottom: "1.75rem", textAlign: "center" },
  group: { marginBottom: "1.25rem" },
  label: { display: "block", fontSize: "0.82rem", fontWeight: 500, color: "#6b6b6b", marginBottom: 6 },
  input: {
    width: "100%", padding: "0.75rem 0.85rem", border: "1px solid #e0e0e0",
    borderRadius: 8, fontSize: "0.95rem", boxSizing: "border-box",
    outline: "none", color: "#1e1e1e", transition: "border-color 0.15s",
  },
  error: { background: "rgba(185, 74, 58, 0.1)", color: "#b94a3a", borderRadius: 8, padding: "0.75rem 1rem", fontSize: "0.875rem", marginBottom: "1rem" },
  btn: {
    width: "100%", padding: "0.85rem", background: navy, color: "#ffffff",
    border: "none", borderRadius: 8, fontSize: "1rem", fontWeight: 600,
    cursor: "pointer", marginTop: "0.5rem", transition: "background 0.2s",
  },
  switch: { textAlign: "center", marginTop: "1.5rem", fontSize: "0.875rem", color: "#6b6b6b" },
  switchBtn: { background: "none", border: "none", color: navy, fontWeight: 600, cursor: "pointer", padding: 0, textDecoration: "underline" },
  hint: { textAlign: "center", marginTop: "1.25rem", fontSize: "0.78rem", color: "#6b6b6b" },
};

export default function LoginPage({ onSwitch }) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={s.wrap}>
      <div style={s.card}>
        <div style={s.logo}>
          <div style={s.logoText}>Ymmo</div>
          <div style={s.logoSub}>Votre agence immobilière</div>
        </div>
        <h2 style={s.title}>Connexion à votre espace</h2>
        <form onSubmit={handleSubmit}>
          <div style={s.group}>
            <label style={s.label}>Adresse email</label>
            <input style={s.input} type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="votre@email.fr" />
          </div>
          <div style={s.group}>
            <label style={s.label}>Mot de passe</label>
            <input style={s.input} type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" />
          </div>
          {error && <div style={s.error}>{error}</div>}
          <button style={{ ...s.btn, opacity: loading ? 0.7 : 1 }} type="submit" disabled={loading}>
            {loading ? "Connexion…" : "Se connecter"}
          </button>
        </form>
        <div style={s.switch}>
          Pas encore de compte ?{" "}
          <button style={s.switchBtn} onClick={onSwitch}>Créer un compte</button>
        </div>
        <div style={s.hint}>Compte test : admin@ymmo.fr / password</div>
      </div>
    </div>
  );
}