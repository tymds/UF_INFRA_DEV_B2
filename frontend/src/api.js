const BASE_URL = "http://localhost:8080";

function getToken() {
return localStorage.getItem("token");
}

async function request(path, options = {}) {
const headers = { "Content-Type": "application/json" };
const token = getToken();
if (token) headers["Authorization"] = `Bearer ${token}`;

const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Erreur serveur");
}

if (res.status === 204) return null;
return res.json();
}

export const api = {
  // Auth
login: (email, password) =>
    request("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),

register: (data) =>
    request("/auth/register", { method: "POST", body: JSON.stringify(data) }),

  // Biens
getBiens: (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    return request(`/biens${params ? "?" + params : ""}`);
},

getBien: (id) => request(`/biens/${id}`),

createBien: (data) =>
    request("/biens", { method: "POST", body: JSON.stringify(data) }),

updateBien: (id, data) =>
    request(`/biens/${id}`, { method: "PUT", body: JSON.stringify(data) }),

deleteBien: (id) =>
    request(`/biens/${id}`, { method: "DELETE" }),

  // Users
getUsers: () => request("/users"),
};