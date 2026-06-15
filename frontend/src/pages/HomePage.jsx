import { useEffect, useState } from "react";
import { api } from "../api";

const styles = {
  page: { fontFamily: "system-ui, -apple-system, sans-serif", color: "#2d2d2d", background: "#fafaf8" },
  hero: {
    background: "linear-gradient(135deg, #1a2e4a 0%, #2c4563 100%)",
    padding: "6rem 2rem",
    textAlign: "center",
    color: "#fff",
  },
  heroContent: { maxWidth: 700, margin: "0 auto" },
  heroTag: { fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#c9a84c", marginBottom: "1rem", fontWeight: 600 },
  heroTitle: { fontSize: "3rem", fontWeight: 700, margin: "0 0 1.25rem", lineHeight: 1.1 },
  heroSub: { fontSize: "1.15rem", color: "#d0d8e0", maxWidth: 600, margin: "0 auto", lineHeight: 1.6 },
  section: { padding: "4rem 2rem", maxWidth: 1200, margin: "0 auto" },
  sectionTag: { fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#c9a84c", fontWeight: 600, marginBottom: "0.75rem" },
  sectionTitle: { fontSize: "2rem", fontWeight: 700, marginBottom: "3rem", color: "#1a2e4a" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "2rem" },
  card: {
    background: "#fff",
    border: "1px solid #e8e8e4",
    borderRadius: 16,
    overflow: "hidden",
    transition: "transform 0.3s, box-shadow 0.3s",
    cursor: "pointer",
  },
  cardHover: { transform: "translateY(-4px)", boxShadow: "0 12px 24px rgba(0,0,0,0.08)" },
  imgPlaceholder: {
    background: "linear-gradient(135deg, #f0ede8 0%, #e8e4da 100%)",
    height: 220,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#999",
    fontSize: "0.85rem",
  },
  cardBody: { padding: "1.5rem" },
  cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem", gap: "0.5rem" },
  cardTitle: { fontSize: "1.1rem", fontWeight: 600, margin: 0, color: "#1a2e4a", flex: 1 },
  badge: (statut) => ({
    fontSize: "0.65rem",
    fontWeight: 700,
    padding: "4px 12px",
    borderRadius: 20,
    whiteSpace: "nowrap",
    background: statut === "disponible" ? "#e6f4ea" : statut === "en_négociation" ? "#fef7e6" : "#fee6e6",
    color: statut === "disponible" ? "#137333" : statut === "en_négociation" ? "#b06000" : "#c5221f",
    textTransform: "uppercase",
  }),
  price: { fontSize: "1.5rem", fontWeight: 700, color: "#c9a84c", margin: "0.75rem 0 1rem" },
  meta: { display: "flex", gap: "1.25rem", fontSize: "0.8rem", color: "#888", marginBottom: "1rem", flexWrap: "wrap" },
  address: { fontSize: "0.85rem", color: "#666", marginBottom: "1.25rem", fontWeight: 500 },
  btn: {
    display: "block",
    width: "100%",
    padding: "0.75rem",
    background: "#1a2e4a",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    fontSize: "0.9rem",
    fontWeight: 600,
    cursor: "pointer",
    textAlign: "center",
    transition: "background 0.2s",
  },
  loading: { textAlign: "center", padding: "4rem 2rem", color: "#999", fontSize: "1rem" },
  error: { textAlign: "center", padding: "2rem", color: "#c5221f", background: "#fee6e6", borderRadius: 12, margin: "2rem" },
  empty: { textAlign: "center", padding: "4rem 2rem", color: "#999", fontSize: "1rem" },
};

export default function HomePage({ onSelectBien }) {
  const [biens, setBiens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hovered, setHovered] = useState(null);

  useEffect(() => {
    api.getBiens()
      .then(setBiens)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={styles.page}>
      <div style={styles.hero}>
        <div style={styles.heroContent}>
          <p style={styles.heroTag}>🏡 Agence immobilière de confiance</p>
          <h1 style={styles.heroTitle}>Trouvez la propriété<br />de vos rêves</h1>
          <p style={styles.heroSub}>
            Découvrez notre sélection exclusive de biens à travers la France.
            Vente, location, investissement — nous vous accompagnons à chaque étape.
          </p>
        </div>
      </div>

      <div style={styles.section}>
        <p style={styles.sectionTag}>✨ Notre catalogue</p>
        <h2 style={styles.sectionTitle}>Biens disponibles</h2>

        {loading && <div style={styles.loading}>Chargement des propriétés…</div>}
        {error && <div style={styles.error}>{error}</div>}
        {!loading && biens.length === 0 && (
          <div style={styles.empty}>Aucun bien immobilier disponible pour le moment.</div>
        )}

        {!loading && biens.length > 0 && (
          <div style={styles.grid}>
            {biens.map((b) => (
              <div
                key={b.id}
                style={{ ...styles.card, ...(hovered === b.id ? styles.cardHover : {}) }}
                onMouseEnter={() => setHovered(b.id)}
                onMouseLeave={() => setHovered(null)}
              >
                <div style={styles.imgPlaceholder}>📷 Aperçu indisponible</div>
                <div style={styles.cardBody}>
                  <div style={styles.cardHeader}>
                    <h3 style={styles.cardTitle}>{b.titre}</h3>
                    <span style={styles.badge(b.statut)}>{b.statut}</span>
                  </div>
                  <div style={styles.price}>{b.prix.toLocaleString("fr-FR")} €</div>
                  <div style={styles.meta}>
                    <span>🏠 {b.type}</span>
                    <span>📐 {b.surface} m²</span>
                    <span>📍 {b.ville}</span>
                  </div>
                  <div style={styles.address}>{b.adresse}</div>
                  <button style={styles.btn} onClick={() => onSelectBien(b.id)}>
                    Voir les détails
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}