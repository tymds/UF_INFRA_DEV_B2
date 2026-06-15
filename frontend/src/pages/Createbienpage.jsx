import { useState } from "react";
import { api } from "../api";

const navy = "#b94a3a";

const s = {
  page: { maxWidth: 800, margin: "0 auto", padding: "3rem 2rem", background: "#ffffff", minHeight: "100vh", fontFamily: "'Inter', system-ui, -apple-system, sans-serif" },
  back: {
    display: "inline-flex", alignItems: "center", gap: 6, color: navy,
    background: "none", border: "1px solid #e0e0e0", borderRadius: 8,
    padding: "0.5rem 1rem", fontSize: "0.9rem", cursor: "pointer", marginBottom: "2rem",
  },
  heading: { fontSize: "1.75rem", fontWeight: 700, color: navy, marginBottom: "2rem" },
  card: { background: "#ffffff", border: "1px solid #e0e0e0", borderRadius: 16, padding: "2rem" },
  section: { marginBottom: "1.75rem" },
  sectionTitle: { fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "#6b6b6b", marginBottom: "1rem", paddingBottom: "0.5rem", borderBottom: "1px solid #f4f4f4" },
  row: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" },
  group: { marginBottom: "1rem" },
  label: { display: "block", fontSize: "0.82rem", fontWeight: 500, color: "#6b6b6b", marginBottom: 6 },
  input: {
    width: "100%", padding: "0.65rem 0.85rem", border: "1px solid #e0e0e0",
    borderRadius: 8, fontSize: "0.95rem", boxSizing: "border-box",
    outline: "none", color: "#1e1e1e",
  },
  textarea: {
    width: "100%", padding: "0.65rem 0.85rem", border: "1px solid #e0e0e0",
    borderRadius: 8, fontSize: "0.95rem", boxSizing: "border-box",
    outline: "none", color: "#1e1e1e", resize: "vertical", minHeight: 100,
  },
  error: { background: "rgba(185, 74, 58, 0.1)", color: "#b94a3a", borderRadius: 8, padding: "0.75rem 1rem", fontSize: "0.875rem", marginBottom: "1rem" },
  success: { background: "rgba(45, 106, 79, 0.1)", color: "#2d6a4f", borderRadius: 12, padding: "2rem", textAlign: "center" },
  successTitle: { fontSize: "1.25rem", fontWeight: 600, marginBottom: "0.5rem" },
  successSub: { fontSize: "0.9rem", marginBottom: "1.5rem", color: "#2d6a4f" },
  btn: {
    width: "100%", padding: "0.8rem", background: navy, color: "#ffffff",
    border: "none", borderRadius: 8, fontSize: "1rem", fontWeight: 600, cursor: "pointer",
  },
  btnOutline: {
    width: "100%", padding: "0.8rem", background: "#ffffff", color: navy,
    border: `1px solid ${navy}`, borderRadius: 8, fontSize: "1rem", fontWeight: 600, cursor: "pointer",
  },
};

export default function CreateBienPage({ onBack }) {
  const [form, setForm] = useState({ titre: "", description: "", type: "résidentiel", prix: "", surface: "", adresse: "", ville: "", photo_url: "" });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (parseFloat(form.prix) <= 0) return setError("Le prix doit être supérieur à 0.");
    setLoading(true);
    try {
      await api.createBien({ ...form, prix: parseFloat(form.prix), surface: parseFloat(form.surface) });
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div style={s.page}>
        <div style={s.success}>
          <div style={s.successTitle}>Bien ajouté avec succès !</div>
          <p style={s.successSub}>Le bien a été enregistré dans la base de données.</p>
          <button style={s.btnOutline} onClick={onBack}>Retour à la liste</button>
        </div>
      </div>
    );
  }

  return (
    <div style={s.page}>
      <button style={s.back} onClick={onBack}>← Retour</button>
      <h2 style={s.heading}>Ajouter un bien</h2>

      <div style={s.card}>
        <form onSubmit={handleSubmit}>
          <div style={s.section}>
            <div style={s.sectionTitle}>Informations générales</div>
            <div style={s.group}>
              <label style={s.label}>Titre *</label>
              <input style={s.input} name="titre" value={form.titre} onChange={handleChange} required placeholder="Ex : Appartement T3 lumineux" />
            </div>
            <div style={s.group}>
              <label style={s.label}>Type</label>
              <select style={s.input} name="type" value={form.type} onChange={handleChange}>
                <option value="résidentiel">Résidentiel</option>
                <option value="professionnel">Professionnel</option>
              </select>
            </div>
            <div style={s.group}>
              <label style={s.label}>Description</label>
              <textarea style={s.textarea} name="description" value={form.description} onChange={handleChange} placeholder="Description détaillée du bien…" />
            </div>
          </div>

          <div style={s.section}>
            <div style={s.sectionTitle}>Prix & surface</div>
            <div style={s.row}>
              <div style={s.group}>
                <label style={s.label}>Prix (€) *</label>
                <input style={s.input} type="number" name="prix" value={form.prix} onChange={handleChange} required min="1" placeholder="250 000" />
              </div>
              <div style={s.group}>
                <label style={s.label}>Surface (m²)</label>
                <input style={s.input} type="number" name="surface" value={form.surface} onChange={handleChange} min="1" placeholder="80" />
              </div>
            </div>
          </div>

          <div style={s.section}>
            <div style={s.sectionTitle}>Localisation</div>
            <div style={s.row}>
              <div style={s.group}>
                <label style={s.label}>Adresse</label>
                <input style={s.input} name="adresse" value={form.adresse} onChange={handleChange} placeholder="12 Rue de la Paix" />
              </div>
              <div style={s.group}>
                <label style={s.label}>Ville</label>
                <input style={s.input} name="ville" value={form.ville} onChange={handleChange} placeholder="Paris" />
              </div>
            </div>
          </div>

          <div style={s.section}>
            <div style={s.sectionTitle}>Image</div>
            <div style={s.group}>
              <label style={s.label}>URL de l'image</label>
              <input style={s.input} name="photo_url" value={form.photo_url} onChange={handleChange} placeholder="https://example.com/image.jpg" />
            </div>
          </div>

          {error && <div style={s.error}>{error}</div>}
          <button style={{ ...s.btn, opacity: loading ? 0.7 : 1 }} type="submit" disabled={loading}>
            {loading ? "Enregistrement…" : "Créer le bien"}
          </button>
        </form>
      </div>
    </div>
  );
}