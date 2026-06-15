import { useEffect, useState } from "react";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";

const navy = "#1a2e4a";
const gold = "#c9a84c";

const s = {
  page: { padding: "3rem 2rem", maxWidth: "100%", background: "#fafaf8", minHeight: "100vh" },
  heading: { fontSize: "1.75rem", fontWeight: 700, color: navy, marginBottom: "2rem" },
  filters: {
    background: "#f8f7f4",
    border: "1px solid #e8e8e4",
    borderRadius: 12,
    padding: "1.5rem",
    marginBottom: "2rem",
  },
  filtersTitle: { fontSize: "0.8rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "#888", marginBottom: "1rem" },
  filtersGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1rem", alignItems: "end" },
  label: { display: "block", fontSize: "0.8rem", fontWeight: 500, color: "#555", marginBottom: 6 },
  input: {
    width: "100%", padding: "0.55rem 0.75rem", border: "1px solid #ddd",
    borderRadius: 8, fontSize: "0.9rem", background: "#fff", boxSizing: "border-box",
    outline: "none", color: "#2d2d2d",
  },
  filterBtn: {
    width: "100%", padding: "0.6rem", background: navy, color: "#fff",
    border: "none", borderRadius: 8, fontSize: "0.9rem", fontWeight: 500, cursor: "pointer",
  },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" },
  card: { background: "#fff", border: "1px solid #e8e8e4", borderRadius: 12, overflow: "hidden" },
  img: { background: "#f0ede8", height: 180, display: "flex", alignItems: "center", justifyContent: "center", color: "#aaa", fontSize: "0.85rem" },
  body: { padding: "1.25rem" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 },
  title: { fontSize: "1rem", fontWeight: 600, color: navy, margin: 0, flex: 1, paddingRight: 8 },
  badge: (s) => ({
    fontSize: "0.7rem", fontWeight: 600, padding: "3px 10px", borderRadius: 20, whiteSpace: "nowrap",
    background: s === "disponible" ? "#e6f4ea" : s === "en_négociation" ? "#fef7e6" : "#fee6e6",
    color: s === "disponible" ? "#137333" : s === "en_négociation" ? "#b06000" : "#c5221f",
  }),
  price: { fontSize: "1.25rem", fontWeight: 700, color: gold, margin: "0.5rem 0" },
  meta: { display: "flex", gap: "0.75rem", fontSize: "0.8rem", color: "#777", flexWrap: "wrap", marginBottom: "0.75rem" },
  address: { fontSize: "0.82rem", color: "#666", marginBottom: "1rem" },
  actions: { display: "flex", gap: "0.5rem" },
  btnPrimary: { flex: 1, padding: "0.6rem", background: navy, color: "#fff", border: "none", borderRadius: 8, fontSize: "0.85rem", fontWeight: 500, cursor: "pointer" },
  btnDanger: { flex: 1, padding: "0.6rem", background: "#fff", color: "#c5221f", border: "1px solid #c5221f", borderRadius: 8, fontSize: "0.85rem", fontWeight: 500, cursor: "pointer" },
  loading: { textAlign: "center", padding: "4rem", color: "#999" },
  error: { textAlign: "center", padding: "1.5rem", color: "#c5221f", background: "#fee6e6", borderRadius: 8 },
  empty: { textAlign: "center", padding: "4rem", color: "#999" },
};

export default function BiensPage({ onSelectBien }) {
  const { user } = useAuth();
  const [biens, setBiens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({ ville: "", statut: "", type: "" });

  async function fetchBiens() {
    setLoading(true);
    setError("");
    try {
      const activeFilters = Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== ""));
      const data = await api.getBiens(activeFilters);
      setBiens(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchBiens(); }, []);

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
            <button style={s.filterBtn} onClick={fetchBiens}>Appliquer</button>
          </div>
        </div>
      </div>

      {loading && <div style={s.loading}>Chargement…</div>}
      {error && <div style={s.error}>{error}</div>}
      {!loading && biens.length === 0 && <div style={s.empty}>Aucun bien trouvé avec ces critères.</div>}

      {!loading && biens.length > 0 && (
        <div style={s.grid}>
          {biens.map((b) => (
            <div key={b.id} style={s.card}>
              <div style={s.img}>Image non disponible</div>
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
      )}
    </div>
  );
}