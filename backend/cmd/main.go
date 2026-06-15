package main

import (
	"log"
	"net/http"
	"os"

	"ymmo-api/internal/database"
	"ymmo-api/internal/handlers"
	mw "ymmo-api/internal/middleware"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/joho/godotenv"
)

func main() {
	godotenv.Load()
	database.Connect()

	r := chi.NewRouter()

	// Middlewares globaux
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)

// CORS pour le frontend React
r.Use(func(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        w.Header().Set("Access-Control-Allow-Origin", "*")
        w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
        if r.Method == "OPTIONS" {
            w.WriteHeader(http.StatusOK)
            return
        }
        next.ServeHTTP(w, r)
    })
})

	// Routes publiques
	r.Post("/auth/login", handlers.Login)
	r.Post("/auth/register", handlers.Register)
	r.Get("/biens", handlers.GetBiens)
	r.Get("/biens/{id}", handlers.GetBien)

	// Routes protégées (JWT requis)
	r.Group(func(r chi.Router) {
		r.Use(mw.AuthMiddleware)
		r.Post("/biens", handlers.CreateBien)
		r.Put("/biens/{id}", handlers.UpdateBien)
		r.Delete("/biens/{id}", handlers.DeleteBien)
		r.Get("/users", handlers.GetUsers)
		r.Get("/users/{id}", handlers.GetUser)
	})

	port := os.Getenv("PORT")
	log.Printf("🚀 Serveur lancé sur http://localhost:%s", port)
	http.ListenAndServe(":"+port, r)
}