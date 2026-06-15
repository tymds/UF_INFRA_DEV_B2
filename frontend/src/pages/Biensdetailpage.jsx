import { useEffect, useState } from "react";
import { api } from "../api";

const navy = "#b94a3a";
const gold = "#b94a3a";

const s = {
  page: { maxWidth: 1200, margin: "0 auto", padding: "3rem 2rem", background: "#ffffff", fontFamily: "'Inter', system-ui, -apple-system, sans-serif" },
  back: {
    display: "inline-flex", alignItems: "center", gap: 6,
    color: navy, background: "#ffffff", border: "1px solid #e0e0e0",
    borderRadius: 8, padding: "0.65rem 1.25rem", fontSize: "0.9rem",
    cursor: "pointer", marginBottom: "2.5rem", fontWeight: 500, transition: "all 0.2s",
  },
  imgBox: {
    background: "linear-gradient(135deg, #f4f4f4 0%, #f4f4f4 100%)", height: 400, borderRadius: 16,
    display: "flex", alignItems: "center", justifyContent: "center",
    color: "#6b6b6b", fontSize: "1rem", marginBottom: "2.5rem", boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
  },
  container: { background: "#ffffff", borderRadius: 16, padding: "2.5rem", border: "1px solid #e0e0e0", marginBottom: "2rem" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem", flexWrap: "wrap", gap: "2rem" },
  title: { fontSize: "2.5rem", fontWeight: 700, color: navy, margin: 0, lineHeight: 1.2 },
  badges: { display: "flex", gap: "0.75rem", marginTop: "1rem", flexWrap: "wrap" },
  badge: (st) => ({
    fontSize: "0.75rem", fontWeight: 600, padding: "4px 12px", borderRadius: 20,
    background: st === "disponible" ? "rgba(45, 106, 79, 0.1)" : st === "en_négociation" ? "rgba(185, 74, 58, 0.1)" : "rgba(185, 74, 58, 0.1)",
    color: st === "disponible" ? "#2d6a4f" : st === "en_négociation" ? "#9e3a2c" : "#b94a3a",
  }),
  typeBadge: { fontSize: "0.75rem", fontWeight: 600, padding: "4px 12px", borderRadius: 20, background: "rgba(185, 74, 58, 0.1)", color: navy },
  priceBox: { textAlign: "right" },
  price: { fontSize: "2.5rem", fontWeight: 700, color: gold, margin: 0 },
  infoCard: { background: "#fffffffff", borderRadius: 12, padding: "2rem", marginBottom: "2rem", border: "1px solid #f4f4f4" },
  infoGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1.25rem" },
  infoLabel: { fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "#6b6b6b", marginBottom: 6 },
  infoValue: { fontSize: "1.1rem", fontWeight: 600, color: navy },
  descSection: { marginTop: "2rem", borderTop: "1px solid #f4f4f4", paddingTop: "2rem" },
  descTitle: { fontSize: "1.15rem", fontWeight: 600, color: navy, marginBottom: "1rem" },
  descText: { fontSize: "1rem", color: "#6b6b6b", lineHeight: 1.8 },
  loading: { textAlign: "center", padding: "4rem 2rem", color: "#6b6b6b", fontSize: "1rem", background: "#fffffffff" },
  error: { textAlign: "center", padding: "2rem", color: "#b94a3a", background: "rgba(185, 74, 58, 0.1)", borderRadius: 12, margin: "2rem" },
};

export default function BienDetailPage({ bienId, onBack }) {
  const [bien, setBien] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.getBien(bienId)
      .then(setBien)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [bienId]);

  if (loading) return <div style={s.loading}>Chargement du bien…</div>;
  if (error) return <div style={s.error}>{error}</div>;
  if (!bien) return null;

  return (
    <div style={s.page}>
      <button style={s.back} onClick={onBack}>← Retour</button>

      {bien.photo_url ? (
        <div style={{ ...s.imgBox, padding: 0, overflow: 'hidden' }}>
          <img
            src={bien.photo_url}
            alt={bien.titre}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      ) : (
        <div style={s.imgBox}>📷 Aperçu indisponible</div>
      )}

      <div style={s.container}>
        <div style={s.header}>
          <div>
            <h1 style={s.title}>{bien.titre}</h1>
            <div style={s.badges}>
              <span style={s.badge(bien.statut)}>{bien.statut}</span>
              <span style={s.typeBadge}>{bien.type}</span>
            </div>
          </div>
          <div style={s.priceBox}>
            <div style={s.price}>{bien.prix.toLocaleString("fr-FR")} €</div>
          </div>
        </div>

        <div style={s.infoCard}>
        <div style={s.infoGrid}>
          <div>
            <div style={s.infoLabel}>Surface</div>
            <div style={s.infoValue}>{bien.surface} m²</div>
          </div>
          <div>
            <div style={s.infoLabel}>Ville</div>
            <div style={s.infoValue}>{bien.ville}</div>
          </div>
          <div>
            <div style={s.infoLabel}>Adresse</div>
            <div style={s.infoValue}>{bien.adresse}</div>
          </div>
          <div>
            <div style={s.infoLabel}>Mis en ligne le</div>
            <div style={s.infoValue}>{new Date(bien.created_at).toLocaleDateString("fr-FR")}</div>
          </div>
        </div>

        {bien.description && (
          <div style={s.descSection}>
            <div style={s.descTitle}>Description</div>
            <p style={s.descText}>{bien.description}</p>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}