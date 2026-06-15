package models

import "time"

type Agence struct {
	ID        int    `json:"id"`
	Nom       string `json:"nom"`
	Adresse   string `json:"adresse"`
	Ville     string `json:"ville"`
	Telephone string `json:"telephone"`
}

type User struct {
	ID           int       `json:"id"`
	Nom          string    `json:"nom"`
	Prenom       string    `json:"prenom"`
	Email        string    `json:"email"`
	PasswordHash string    `json:"-"`
	Role         string    `json:"role"`
	AgenceID     *int      `json:"agence_id"`
	CreatedAt    time.Time `json:"created_at"`
}

type Bien struct {
	ID           int       `json:"id"`
	Titre        string    `json:"titre"`
	Description  string    `json:"description"`
	Type         string    `json:"type"`
	Statut       string    `json:"statut"`
	Prix         float64   `json:"prix"`
	Surface      float64   `json:"surface"`
	Adresse      string    `json:"adresse"`
	Ville        string    `json:"ville"`
	AgenceID     *int      `json:"agence_id"`
	CommercialID *int      `json:"commercial_id"`
	PhotoURL     string    `json:"photo_url"`
	CreatedAt    time.Time `json:"created_at"`
}

type Photo struct {
	ID     int    `json:"id"`
	BienID int    `json:"bien_id"`
	URL    string `json:"url"`
	Ordre  int    `json:"ordre"`
}

type Transaction struct {
	ID              int     `json:"id"`
	BienID          int     `json:"bien_id"`
	ClientID        int     `json:"client_id"`
	CommercialID    int     `json:"commercial_id"`
	DateTransaction string  `json:"date_transaction"`
	PrixFinal       float64 `json:"prix_final"`
	Statut          string  `json:"statut"`
}

type LoginPayload struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type RegisterPayload struct {
	Nom      string `json:"nom"`
	Prenom   string `json:"prenom"`
	Email    string `json:"email"`
	Password string `json:"password"`
	Role     string `json:"role"`
}

type CreateBienPayload struct {
	Titre       string  `json:"titre"`
	Description string  `json:"description"`
	Type        string  `json:"type"`
	Prix        float64 `json:"prix"`
	Surface     float64 `json:"surface"`
	Adresse     string  `json:"adresse"`
	Ville       string  `json:"ville"`
	AgenceID    *int    `json:"agence_id"`
	PhotoURL    string  `json:"photo_url"`
}
