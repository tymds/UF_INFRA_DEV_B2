import { useState } from "react";
import { api } from "../api";

const navy = "#1a2e4a";

const s = {
  wrap: { minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem", background: "linear-gradient(135deg, #1a2e4a 0%, #2c4563 100%)" },
  card: { background: "#fff", borderRadius: 16, border: "1px solid #e8e8e4", padding: "2.5rem", width: "100%", maxWidth: 420, boxShadow: "0 20px 60px rgba(0,0,0,0.15)" },
  logo: { textAlign: "center", marginBottom: "2rem" },
  logoText: { fontSize: "1.75rem", fontWeight: 700, color: navy, letterSpacing: "-0.5px" },
  logoSub: { fontSize: "0.85rem", color: "#888", marginTop: 6 },
  title: { fontSize: "1.35rem", fontWeight: 600, color: navy, marginBottom: "1.75rem", textAlign: "center" },
  row: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" },
  group: { marginBottom: "1.25rem" },
  label: { display: "block", fontSize: "0.82rem", fontWeight: 500, color: "#555", marginBottom: 6 },
  input: {
    width: "100%", padding: "0.75rem 0.85rem", border: "1px solid #ddd",
    borderRadius: 8, fontSize: "0.95rem", boxSizing: "border-box",
    outline: "none", color: "#2d2d2d",
  },
  error: { background: "#fee6e6", color: "#c5221f", borderRadius: 8, padding: "0.75rem 1rem", fontSize: "0.875rem", marginBottom: "1rem" },
  success: { background: "#e6f4ea", color: "#137333", borderRadius: 12, padding: "1.5rem", textAlign: "center", marginBottom: "1.5rem" },
  btn: {
    width: "100%", padding: "0.85rem", background: navy, color: "#fff",
    border: "none", borderRadius: 8, fontSize: "1rem", fontWeight: 600,
    cursor: "pointer", marginTop: "0.5rem", transition: "background 0.2s",
  },
  switch: { textAlign: "center", marginTop: "1.5rem", fontSize: "0.875rem", color: "#666" },
  switchBtn: { background: "none", border: "none", color: navy, fontWeight: 600, cursor: "pointer", padding: 0, textDecoration: "underline" },
};

export default function RegisterPage({ onSwitch }) {
  const [form, setForm] = useState({ nom: "", prenom: "", email: "", password: "" });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.register({ ...form, role: "client" });
      setSuccess(true);
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
        <h2 style={s.title}>Créer un compte</h2>

        {success ? (
          <>
            <div style={s.success}>
              ✓ Compte créé avec succès !<br />
              <span style={{ fontSize: "0.85rem" }}>Vous pouvez maintenant vous connecter.</span>
            </div>
            <button style={s.btn} onClick={onSwitch}>Se connecter</button>
          </>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={s.row}>
              <div style={s.group}>
                <label style={s.label}>Nom</label>
                <input style={s.input} name="nom" value={form.nom} onChange={handleChange} required placeholder="Dupont" />
              </div>
              <div style={s.group}>
                <label style={s.label}>Prénom</label>
                <input style={s.input} name="prenom" value={form.prenom} onChange={handleChange} required placeholder="Jean" />
              </div>
            </div>
            <div style={s.group}>
              <label style={s.label}>Adresse email</label>
              <input style={s.input} type="email" name="email" value={form.email} onChange={handleChange} required placeholder="votre@email.fr" />
            </div>
            <div style={s.group}>
              <label style={s.label}>Mot de passe</label>
              <input style={s.input} type="password" name="password" value={form.password} onChange={handleChange} required placeholder="••••••••" minLength={6} />
            </div>
            {error && <div style={s.error}>{error}</div>}
            <button style={{ ...s.btn, opacity: loading ? 0.7 : 1 }} type="submit" disabled={loading}>
              {loading ? "Création…" : "Créer mon compte"}
            </button>
          </form>
        )}

        {!success && (
          <div style={s.switch}>
            Déjà un compte ?{" "}
            <button style={s.switchBtn} onClick={onSwitch}>Se connecter</button>
          </div>
        )}
      </div>
    </div>
  );
}