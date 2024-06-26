package server

import (
	"encoding/json"
	"fmt"
	"github.com/arfis/crowd-funding/authorization/internal/authorization"
	"github.com/arfis/crowd-funding/authorization/internal/tokenHandler"
	"github.com/arfis/crowd-funding/authorization/pkg/user"
	"github.com/google/uuid"
	"github.com/gorilla/mux"
	"log"
	"net/http"
	"time"
)

type RestApiServer struct{}
type TokenRequest struct {
	Token string `json:"token"`
}

func (ra *RestApiServer) StartWebServer(port uint, terminateChan chan int) error {
	r := mux.NewRouter()
	fmt.Println("STARTED WEB SERVER")
	r.Use(corsMiddleware) // Use the CORS middleware

	r.HandleFunc("/validate", validateJwtToken).Methods("POST")
	r.HandleFunc("/ping", pingHandler).Methods("GET")
	r.HandleFunc("/user/{id}", ra.getUserByIDHandler).Methods("GET")
	r.HandleFunc("/login", authorization.HandleGoogleLogin).Methods("GET")
	r.HandleFunc("/login/callback", authorization.HandleGoogleCallback).Methods("GET")
	r.HandleFunc("/login/metamask", authorization.HandleMetaMaskLogin).Methods("POST", "OPTIONS")
	r.HandleFunc("/assign-wallet", authorization.AssignWalletHandler).Methods("POST", "OPTIONS")
	r.HandleFunc("/logout", func(w http.ResponseWriter, r *http.Request) {
		http.SetCookie(w, &http.Cookie{
			Name:     "AuthToken",
			Value:    "",
			Expires:  time.Unix(0, 0),
			HttpOnly: false,
			//Secure:   true,
			Path:     "/",
			SameSite: http.SameSiteLaxMode,
		})
		// Respond with logout success
	})
	//protectedRouteHandler := authorization.AuthMiddleware(http.HandlerFunc(protectedHandler))
	//mux.Handle("/protected", protectedRouteHandler) // Use Handle, not HandleFunc
	//mux.Handle("/protected", protectedRouteHandler)
	//r.Handle("/protected", protectedRouteHandler).Methods("GET")

	//r.HandleFunc("/invoice", createInvoiceHandler).Methods("POST")
	//r.HandleFunc("/invoice", getInvoicesHandler).Methods("GET")
	//r.HandleFunc("/invoice/{id}/send", sendInvoiceHandler).Methods("POST")

	log.Fatal(http.ListenAndServe(fmt.Sprintf(":%d", port), r))
	terminateChan <- 1

	return nil
}

func protectedHandler(w http.ResponseWriter, r *http.Request) {
	// This is a protected route
	w.Write([]byte("Access to protected resource granted"))
}

// Middleware to handle CORS
func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		log.Println("CORS Middleware invoked for request:", r.Method, r.URL.Path)
		w.Header().Set("Access-Control-Allow-Origin", "http://localhost:4200")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func validateJwtToken(w http.ResponseWriter, r *http.Request) {
	log.Println("CALLING THE VALIDATE JWT TOKEN")
	var tokenString *TokenRequest
	err := json.NewDecoder(r.Body).Decode(&tokenString)
	if err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if tokenString == nil {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}

	// Log the incoming token (for debug purposes; remove in production)
	log.Printf("Validating token: %s", tokenString.Token)
	claims, err := tokenHandler.ValidateJWT(tokenString.Token)
	if err != nil {
		// If there's an error, we return an unauthorized status and the error message.
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}

	// If the token is valid, return the claims as a JSON response.
	response := struct {
		Status  string               `json:"status"`
		Message string               `json:"message"`
		Claims  *tokenHandler.Claims `json:"claims"`
	}{
		Status:  "success",
		Message: "Token is valid",
		Claims:  claims,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)

	return
}

func pingHandler(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("pong"))
}

func (ra *RestApiServer) getUserByIDHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := uuid.Parse(vars["id"])
	if err != nil {
		http.Error(w, "Invalid user ID", http.StatusBadRequest)
		return
	}

	foundUser := user.FindUserById(id)
	if err != nil {
		http.Error(w, "User not found", http.StatusNotFound)
		return
	}

	response := struct {
		Email    string `json:"email"`
		Username string `json:"username"`
		IsActive bool   `json:"isActive"`
	}{
		Email:    foundUser.Email,
		Username: foundUser.Username,
		IsActive: foundUser.DeletedAt == nil,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}
