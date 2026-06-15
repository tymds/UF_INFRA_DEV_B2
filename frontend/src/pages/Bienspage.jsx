import { useEffect, useState } from "react";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";

const navy = "#b94a3a";
const gold = "#b94a3a";

const s = {
  page: { padding: "3rem 2rem", maxWidth: "100%", background: "#ffffff", minHeight: "100vh", fontFamily: "'Inter', system-ui, -apple-system, sans-serif" },
  heading: { fontSize: "1.75rem", fontWeight: 700, color: navy, marginBottom: "2rem" },
  filters: {
    background: "#f4f4f4",
    border: "1px solid #e0e0e0",
    borderRadius: 12,
    padding: "1.5rem",
    marginBottom: "2rem",
  },
  filtersTitle: { fontSize: "0.8rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "#888", marginBottom: "1rem" },
  filtersGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1rem", alignItems: "end" },
  label: { display: "block", fontSize: "0.8rem", fontWeight: 500, color: "#6b6b6b", marginBottom: 6 },
  input: {
    width: "100%", padding: "0.55rem 0.75rem", border: "1px solid #e0e0e0",
    borderRadius: 8, fontSize: "0.9rem", background: "#ffffff", boxSizing: "border-box",
    outline: "none", color: "#1e1e1e",
  },
  filterBtn: {
    width: "100%", padding: "0.6rem", background: navy, color: "#ffffff",
    border: "none", borderRadius: 8, fontSize: "0.9rem", fontWeight: 500, cursor: "pointer",
  },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" },
  card: { background: "#ffffff", border: "1px solid #e0e0e0", borderRadius: 12, overflow: "hidden" },
  img: { background: "#f4f4f4", height: 180, display: "flex", alignItems: "center", justifyContent: "center", color: "#6b6b6b", fontSize: "0.85rem" },
  body: { padding: "1.25rem" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 },
  title: { fontSize: "1rem", fontWeight: 600, color: navy, margin: 0, flex: 1, paddingRight: 8 },
  badge: (s) => ({
    fontSize: "0.7rem", fontWeight: 600, padding: "3px 10px", borderRadius: 20, whiteSpace: "nowrap",
    background: s === "disponible" ? "rgba(45, 106, 79, 0.1)" : s === "en_négociation" ? "rgba(185, 74, 58, 0.1)" : "rgba(185, 74, 58, 0.1)",
    color: s === "disponible" ? "#2d6a4f" : s === "en_négociation" ? "#9e3a2c" : "#b94a3a",
  }),
  price: { fontSize: "1.25rem", fontWeight: 700, color: gold, margin: "0.5rem 0" },
  meta: { display: "flex", gap: "0.75rem", fontSize: "0.8rem", color: "#6b6b6b", flexWrap: "wrap", marginBottom: "0.75rem" },
  address: { fontSize: "0.82rem", color: "#6b6b6b", marginBottom: "1rem" },
  actions: { display: "flex", gap: "0.5rem" },
  btnPrimary: { flex: 1, padding: "0.6rem", background: navy, color: "#ffffff", border: "none", borderRadius: 8, fontSize: "0.85rem", fontWeight: 500, cursor: "pointer" },
  btnDanger: { flex: 1, padding: "0.6rem", background: "#ffffff", color: "#b94a3a", border: "1px solid #b94a3a", borderRadius: 8, fontSize: "0.85rem", fontWeight: 500, cursor: "pointer" },
  loading: { textAlign: "center", padding: "4rem", color: "#6b6b6b" },
  error: { textAlign: "center", padding: "1.5rem", color: "#b94a3a", background: "rgba(185, 74, 58, 0.1)", borderRadius: 8 },
  empty: { textAlign: "center", padding: "4rem", color: "#6b6b6b" },
  pagination: { display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem", marginTop: "3rem", padding: "1.5rem" },
  paginationButton: {
    padding: "0.75rem 1.5rem",
    background: navy,
    color: "#ffffff",
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

export default function BiensPage({ onSelectBien }) {
  const { user } = useAuth();
  const [biens, setBiens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({ ville: "", statut: "", type: "" });
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit] = useState(9);
  const [hasNext, setHasNext] = useState(false);

  async function fetchBiens(pageNum = page) {
    setLoading(true);
    setError("");
    try {
      const offset = (pageNum - 1) * limit;
      const activeFilters = Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== ""));
      const params = { ...activeFilters, limit, offset };
      const response = await api.getBiens(params);
      setBiens(response.biens);
      setTotal(response.total);
      setHasNext(response.hasNext);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchBiens();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  function handleApplyFilters() {
    setPage(1);
  }

  function handlePrevPage() {
    if (page > 1) setPage(page - 1);
  }

  function handleNextPage() {
    if (hasNext) setPage(page + 1);
  }

  function handleFilterChange(e) {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  }

  async function handleDelete(id) {
    if (!confirm("Supprimer ce bien définitivement ?")) return;
    try {
      await api.deleteBien(id);
      setBiens(biens.filter((b) => b.id !== id));
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div style={s.page}>
      <h2 style={s.heading}>Biens immobiliers</h2>

      <div style={s.filters}>
        <div style={s.filtersTitle}>Filtrer les biens</div>
        <div style={s.filtersGrid}>
          <div>
            <label style={s.label}>Ville</label>
            <input style={s.input} name="ville" placeholder="Toutes les villes" value={filters.ville} onChange={handleFilterChange} />
          </div>
          <div>
            <label style={s.label}>Statut</label>
            <select style={s.input} name="statut" value={filters.statut} onChange={handleFilterChange}>
              <option value="">Tous les statuts</option>
              <option value="disponible">Disponible</option>
              <option value="en_négociation">En négociation</option>
              <option value="vendu">Vendu</option>
            </select>
          </div>
          <div>
            <label style={s.label}>Type</label>
            <select style={s.input} name="type" value={filters.type} onChange={handleFilterChange}>
              <option value="">Tous les types</option>
              <option value="résidentiel">Résidentiel</option>
              <option value="professionnel">Professionnel</option>
            </select>
          </div>
          <div>
            <label style={s.label}>&nbsp;</label>
            <button style={s.filterBtn} onClick={handleApplyFilters}>Appliquer</button>
          </div>
        </div>
      </div>

      {loading && <div style={s.loading}>Chargement…</div>}
      {error && <div style={s.error}>{error}</div>}
      {!loading && biens.length === 0 && <div style={s.empty}>Aucun bien trouvé avec ces critères.</div>}

      {!loading && biens.length > 0 && (
        <>
          <div style={s.grid}>
            {biens.map((b) => (
              <div key={b.id} style={s.card}>
                {b.photo_url ? (
                  <div style={{ ...s.img, padding: 0, overflow: 'hidden' }}>
                    <img
                      src={b.photo_url}
                      alt={b.titre}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                ) : (
                  <div style={s.img}>Image non disponible</div>
                )}
                <div style={s.body}>
                  <div style={s.header}>
                    <h3 style={s.title}>{b.titre}</h3>
                    <span style={s.badge(b.statut)}>{b.statut}</span>
                  </div>
                  <div style={s.price}>{b.prix.toLocaleString("fr-FR")} €</div>
                  <div style={s.meta}>
                    <span>{b.type}</span>
                    <span>{b.surface} m²</span>
                    <span>{b.ville}</span>
                  </div>
                  <div style={s.address}>{b.adresse}</div>
                  <div style={s.actions}>
                    <button style={s.btnPrimary} onClick={() => onSelectBien(b.id)}>Voir détails</button>
                    {(user?.role === "commercial" || user?.role === "admin") && (
                      <button style={s.btnDanger} onClick={() => handleDelete(b.id)}>Supprimer</button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={s.pagination}>
            <button
              style={page > 1 ? s.paginationButton : s.paginationButtonDisabled}
              onClick={handlePrevPage}
              disabled={page <= 1}
            >
              Précédent
            </button>
            <span style={s.pageInfo}>
              Page {page} sur {Math.ceil(total / limit)}
            </span>
            <button
              style={hasNext ? s.paginationButton : s.paginationButtonDisabled}
              onClick={handleNextPage}
              disabled={!hasNext}
            >
              Suivant
            </button>
          </div>
        </>
      )}
    </div>
  );
}