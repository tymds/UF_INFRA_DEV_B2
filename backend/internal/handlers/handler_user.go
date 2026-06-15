package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"ymmo-api/internal/database"
	"ymmo-api/internal/models"

	"github.com/go-chi/chi/v5"
)

func GetUsers(w http.ResponseWriter, r *http.Request) {
	rows, err := database.DB.Query("SELECT id, nom, prenom, email, role, created_at FROM users")
	if err != nil {
		http.Error(w, "Erreur BDD", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var users []models.User
	for rows.Next() {
		var u models.User
		rows.Scan(&u.ID, &u.Nom, &u.Prenom, &u.Email, &u.Role, &u.CreatedAt)
		users = append(users, u)
	}

	if users == nil {
		users = []models.User{}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(users)
}

func GetUser(w http.ResponseWriter, r *http.Request) {
	id, _ := strconv.Atoi(chi.URLParam(r, "id"))

	var u models.User
	err := database.DB.QueryRow(
		"SELECT id, nom, prenom, email, role, agence_id, created_at FROM users WHERE id = ?", id,
	).Scan(&u.ID, &u.Nom, &u.Prenom, &u.Email, &u.Role, &u.AgenceID, &u.CreatedAt)

	if err != nil {
		http.Error(w, "Utilisateur non trouvé", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(u)
}