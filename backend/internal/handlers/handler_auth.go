package handlers

import (
	"encoding/json"
	"net/http"
	"os"
	"time"

	"ymmo-api/internal/database"
	"ymmo-api/internal/models"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

func Login(w http.ResponseWriter, r *http.Request) {
	var payload models.LoginPayload
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		http.Error(w, "Body invalide", http.StatusBadRequest)
		return
	}

	var user models.User
	err := database.DB.QueryRow(
		"SELECT id, nom, prenom, email, password_hash, role FROM users WHERE email = ?",
		payload.Email,
	).Scan(&user.ID, &user.Nom, &user.Prenom, &user.Email, &user.PasswordHash, &user.Role)

	if err != nil {
		http.Error(w, "Email ou mot de passe incorrect", http.StatusUnauthorized)
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(payload.Password)); err != nil {
		http.Error(w, "Email ou mot de passe incorrect", http.StatusUnauthorized)
		return
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": user.ID,
		"role":    user.Role,
		"exp":     time.Now().Add(24 * time.Hour).Unix(),
	})

	tokenStr, err := token.SignedString([]byte(os.Getenv("JWT_SECRET")))
	if err != nil {
		http.Error(w, "Erreur génération token", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"token": tokenStr,
		"user":  user,
	})
}

func Register(w http.ResponseWriter, r *http.Request) {
	var payload models.RegisterPayload
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		http.Error(w, "Body invalide", http.StatusBadRequest)
		return
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(payload.Password), bcrypt.DefaultCost)
	if err != nil {
		http.Error(w, "Erreur hashage", http.StatusInternalServerError)
		return
	}

	role := "client"
	if payload.Role != "" {
		role = payload.Role
	}

	result, err := database.DB.Exec(
		"INSERT INTO users (nom, prenom, email, password_hash, role) VALUES (?, ?, ?, ?, ?)",
		payload.Nom, payload.Prenom, payload.Email, string(hash), role,
	)
	if err != nil {
		http.Error(w, "Email déjà utilisé", http.StatusConflict)
		return
	}

	id, _ := result.LastInsertId()
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"id":     id,
		"nom":    payload.Nom,
		"prenom": payload.Prenom,
		"email":  payload.Email,
		"role":   role,
	})
}