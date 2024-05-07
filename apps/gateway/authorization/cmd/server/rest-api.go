package server

import (
	"encoding/json"
	"fmt"
	"github.com/arfis/crowd-funding/authorization/internal/authorization"
	"github.com/arfis/crowd-funding/authorization/internal/tokenHandler"
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
	r.HandleFunc("/validate", validateJwtToken).Methods("POST")
	r.HandleFunc("/ping", pingHandler).Methods("GET")
	r.HandleFunc("/login", authorization.HandleGoogleLogin).Methods("GET")
	r.HandleFunc("/login/callback", authorization.HandleGoogleCallback).Methods("GET")
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
