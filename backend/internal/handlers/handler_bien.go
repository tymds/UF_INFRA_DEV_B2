package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"ymmo-api/internal/database"
	"ymmo-api/internal/middleware"
	"ymmo-api/internal/models"

	"github.com/go-chi/chi/v5"
)

func GetBiens(w http.ResponseWriter, r *http.Request) {
	// Filtres optionnels via query params
	ville := r.URL.Query().Get("ville")
	statut := r.URL.Query().Get("statut")
	typeBien := r.URL.Query().Get("type")

	query := "SELECT id, titre, description, type, statut, prix, surface, adresse, ville, created_at FROM biens WHERE 1=1"
	args := []interface{}{}

	if ville != "" {
		query += " AND ville = ?"
		args = append(args, ville)
	}
	if statut != "" {
		query += " AND statut = ?"
		args = append(args, statut)
	}
	if typeBien != "" {
		query += " AND type = ?"
		args = append(args, typeBien)
	}

	rows, err := database.DB.Query(query, args...)
	if err != nil {
		http.Error(w, "Erreur BDD", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var biens []models.Bien
	for rows.Next() {
		var b models.Bien
		rows.Scan(&b.ID, &b.Titre, &b.Description, &b.Type, &b.Statut, &b.Prix, &b.Surface, &b.Adresse, &b.Ville, &b.CreatedAt)
		biens = append(biens, b)
	}

	if biens == nil {
		biens = []models.Bien{}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(biens)
}

func GetBien(w http.ResponseWriter, r *http.Request) {
	id, _ := strconv.Atoi(chi.URLParam(r, "id"))

	var b models.Bien
	err := database.DB.QueryRow(
		"SELECT id, titre, description, type, statut, prix, surface, adresse, ville, agence_id, commercial_id, created_at FROM biens WHERE id = ?", id,
	).Scan(&b.ID, &b.Titre, &b.Description, &b.Type, &b.Statut, &b.Prix, &b.Surface, &b.Adresse, &b.Ville, &b.AgenceID, &b.CommercialID, &b.CreatedAt)

	if err != nil {
		http.Error(w, "Bien non trouvé", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(b)
}

func CreateBien(w http.ResponseWriter, r *http.Request) {
	claims, _ := r.Context().Value(middleware.UserKey).(*middleware.Claims)

	var payload models.CreateBienPayload
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		http.Error(w, "Body invalide", http.StatusBadRequest)
		return
	}

	result, err := database.DB.Exec(
		"INSERT INTO biens (titre, description, type, statut, prix, surface, adresse, ville, agence_id, commercial_id) VALUES (?, ?, ?, 'disponible', ?, ?, ?, ?, ?, ?)",
		payload.Titre, payload.Description, payload.Type, payload.Prix, payload.Surface, payload.Adresse, payload.Ville, payload.AgenceID, claims.UserID,
	)
	if err != nil {
		http.Error(w, "Erreur création", http.StatusInternalServerError)
		return
	}

	id, _ := result.LastInsertId()
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]interface{}{"id": id, "message": "Bien créé"})
}

func UpdateBien(w http.ResponseWriter, r *http.Request) {
	id, _ := strconv.Atoi(chi.URLParam(r, "id"))

	var payload models.CreateBienPayload
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		http.Error(w, "Body invalide", http.StatusBadRequest)
		return
	}

	_, err := database.DB.Exec(
		"UPDATE biens SET titre=?, description=?, type=?, prix=?, surface=?, adresse=?, ville=? WHERE id=?",
		payload.Titre, payload.Description, payload.Type, payload.Prix, payload.Surface, payload.Adresse, payload.Ville, id,
	)
	if err != nil {
		http.Error(w, "Erreur mise à jour", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"message": "Bien mis à jour"})
}

func DeleteBien(w http.ResponseWriter, r *http.Request) {
	id, _ := strconv.Atoi(chi.URLParam(r, "id"))

	_, err := database.DB.Exec("DELETE FROM biens WHERE id = ?", id)
	if err != nil {
		http.Error(w, "Erreur suppression", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}