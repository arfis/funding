package authorization

import (
	"encoding/json"
	database "github.com/arfis/crowd-funding/authorization/internal/db"
	"github.com/arfis/crowd-funding/authorization/internal/tokenHandler"
	"log"
	"net/http"
	"strings"
)

func AssignWalletHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:4200")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

	log.Println("Handling /assign-wallet endpoint")
	log.Println("Request Method:", r.Method)
	log.Println("Request URL:", r.URL.Path)

	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}

	// Extract the JWT token from the Authorization header
	authHeader := r.Header.Get("Authorization")
	if authHeader == "" {
		http.Error(w, "Authorization header is missing", http.StatusUnauthorized)
		return
	}

	tokenString := strings.TrimPrefix(authHeader, "Bearer ")
	claims, err := tokenHandler.ValidateJWT(tokenString)
	if err != nil {
		http.Error(w, "Invalid JWT token", http.StatusUnauthorized)
		return
	}

	var wa WalletAssignment
	err = json.NewDecoder(r.Body).Decode(&wa)
	if err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	db := database.GetConnection()
	var user database.User
	if err := db.Where("id = ?", claims.UserID).First(&user).Error; err != nil {
		http.Error(w, "User not found", http.StatusNotFound)
		return
	}

	user.WalletAddress = wa.WalletAddress
	db.Save(&user)

	response := map[string]string{
		"status":  "success",
		"message": "Wallet address assigned successfully",
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func HandleMetaMaskLogin(w http.ResponseWriter, r *http.Request) {
	var walletAssignment WalletAssignment
	err := json.NewDecoder(r.Body).Decode(&walletAssignment)
	if err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	var user database.User
	db := database.GetConnection()
	if err := db.Where("wallet_address = ?", walletAssignment.WalletAddress).First(&user).Error; err != nil {
		user = database.User{WalletAddress: walletAssignment.WalletAddress}
		db.Create(&user)
	}

	tokenWithExpiration, err := tokenHandler.GenerateJWT(&user)
	if err != nil {
		http.Error(w, "Failed to generate JWT", http.StatusInternalServerError)
		return
	}

	if err != nil {
		http.Error(w, "Failed to generate JWT", http.StatusInternalServerError)
		return
	}

	// Here, you would generally set the JWT token in an HTTP-only cookie, or return it in the response body
	//w.Header().Set("Token", jwtToken)

	HandleRedirection(w, r, tokenWithExpiration)
}
