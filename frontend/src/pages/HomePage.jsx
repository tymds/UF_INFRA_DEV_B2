import { useEffect, useState, useCallback } from "react";
import { api } from "../api";

const styles = {
  page: { fontFamily: "'Inter', system-ui, -apple-system, sans-serif", color: "#1e1e1e", background: "#ffffff" },
  hero: {
    background: "linear-gradient(135deg, #b94a3a 0%, #2c4563 100%)",
    padding: "6rem 2rem",
    textAlign: "center",
    color: "#fff",
  },
  heroContent: { maxWidth: 700, margin: "0 auto" },
  heroTag: { fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#b94a3a", marginBottom: "1rem", fontWeight: 600 },
  heroTitle: { fontSize: "3rem", fontWeight: 700, margin: "0 0 1.25rem", lineHeight: 1.1 },
  heroSub: { fontSize: "1.15rem", color: "#6b6b6b", maxWidth: 600, margin: "0 auto", lineHeight: 1.6 },
  section: { padding: "4rem 2rem", maxWidth: 1200, margin: "0 auto" },
  sectionTag: { fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#b94a3a", fontWeight: 600, marginBottom: "0.75rem" },
  sectionTitle: { fontSize: "2rem", fontWeight: 700, marginBottom: "3rem", color: "#b94a3a" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "2rem" },
  card: {
    background: "#fff",
    border: "1px solid #e0e0e0",
    borderRadius: 16,
    overflow: "hidden",
    transition: "transform 0.3s, box-shadow 0.3s",
    cursor: "pointer",
  },
  cardHover: { transform: "translateY(-4px)", boxShadow: "0 12px 24px rgba(0,0,0,0.08)" },
  imgPlaceholder: {
    background: "linear-gradient(135deg, #f4f4f4 0%, #f4f4f4 100%)",
    height: 220,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#6b6b6b",
    fontSize: "0.85rem",
  },
  cardBody: { padding: "1.5rem" },
  cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem", gap: "0.5rem" },
  cardTitle: { fontSize: "1.1rem", fontWeight: 600, margin: 0, color: "#b94a3a", flex: 1 },
  badge: (statut) => ({
    fontSize: "0.65rem",
    fontWeight: 700,
    padding: "4px 12px",
    borderRadius: 20,
    whiteSpace: "nowrap",
    background: statut === "disponible" ? "rgba(45, 106, 79, 0.1)" : statut === "en_négociation" ? "rgba(185, 74, 58, 0.1)" : "rgba(185, 74, 58, 0.1)",
    color: statut === "disponible" ? "#2d6a4f" : statut === "en_négociation" ? "#9e3a2c" : "#b94a3a",
    textTransform: "uppercase",
  }),
  price: { fontSize: "1.5rem", fontWeight: 700, color: "#b94a3a", margin: "0.75rem 0 1rem" },
  meta: { display: "flex", gap: "1.25rem", fontSize: "0.8rem", color: "#6b6b6b", marginBottom: "1rem", flexWrap: "wrap" },
  address: { fontSize: "0.85rem", color: "#6b6b6b", marginBottom: "1.25rem", fontWeight: 500 },
  btn: {
    display: "block",
    width: "100%",
    padding: "0.75rem",
    background: "#b94a3a",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    fontSize: "0.9rem",
    fontWeight: 600,
    cursor: "pointer",
    textAlign: "center",
    transition: "background 0.2s",
  },
  loading: { textAlign: "center", padding: "4rem 2rem", color: "#6b6b6b", fontSize: "1rem" },
  error: { textAlign: "center", padding: "2rem", color: "#b94a3a", background: "rgba(185, 74, 58, 0.1)", borderRadius: 12, margin: "2rem" },
  empty: { textAlign: "center", padding: "4rem 2rem", color: "#6b6b6b", fontSize: "1rem" },
  pagination: { display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem", marginTop: "3rem", padding: "1.5rem" },
  paginationButton: {
    padding: "0.75rem 1.5rem",
    background: "#b94a3a",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    fontSize: "0.9rem",
    fontWeight: 600,
    cursor: "pointer",
    transition: "background 0.2s",
  },
  paginationButtonDisabled: {
    padding: "0.75rem 1.5rem",
    background: "#e0e0e0",
    color: "#6b6b6b",
    border: "none",
    borderRadius: 8,
    fontSize: "0.9rem",
    fontWeight: 600,
    cursor: "not-allowed",
  },
  pageInfo: { fontSize: "0.9rem", color: "#6b6b6b", margin: "0 1rem" },
};

export default function HomePage({ onSelectBien }) {
  const [biens, setBiens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hovered, setHovered] = useState(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit] = useState(9);
  const [hasNext, setHasNext] = useState(false);

  const fetchBiens = useCallback((pageNum) => {
    setLoading(true);
    const offset = (pageNum - 1) * limit;
    api.getBiens({ limit, offset })
      .then((response) => {
        setBiens(response.biens);
        setTotal(response.total);
        setHasNext(response.hasNext);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [limit]);

  useEffect(() => {
    fetchBiens(page);
  }, [page, fetchBiens]);

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (hasNext) setPage(page + 1);
  };

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
          <>
            <div style={styles.grid}>
              {biens.map((b) => (
                <div
                  key={b.id}
                  style={{ ...styles.card, ...(hovered === b.id ? styles.cardHover : {}) }}
                  onMouseEnter={() => setHovered(b.id)}
                  onMouseLeave={() => setHovered(null)}
                >
                  {b.photo_url ? (
                    <div style={{ ...styles.imgPlaceholder, padding: 0, overflow: 'hidden' }}>
                      <img
                        src={b.photo_url}
                        alt={b.titre}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                  ) : (
                    <div style={styles.imgPlaceholder}>📷 Aperçu indisponible</div>
                  )}
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
            <div style={styles.pagination}>
              <button
                style={page > 1 ? styles.paginationButton : styles.paginationButtonDisabled}
                onClick={handlePrevPage}
                disabled={page <= 1}
              >
                Précédent
              </button>
              <span style={styles.pageInfo}>
                Page {page} sur {Math.ceil(total / limit)}
              </span>
              <button
                style={hasNext ? styles.paginationButton : styles.paginationButtonDisabled}
                onClick={handleNextPage}
                disabled={!hasNext}
              >
                Suivant
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}