package authorization

import (
	"encoding/json"
	"fmt"
	database "github.com/arfis/crowd-funding/authorization/internal/db"
	"github.com/arfis/crowd-funding/authorization/internal/tokenHandler"
	"github.com/arfis/crowd-funding/authorization/pkg/user"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
	"io"
	"net/http"
	"os"
)

type TokenRequest struct {
	Token string `json:"token"`
}
type WalletAssignment struct {
	GoogleToken   string `json:"googleToken"`
	WalletAddress string `json:"walletAddress"`
}

type GoogleUserInfo struct {
	ID            string `json:"id"`
	Email         string `json:"email"`
	VerifiedEmail bool   `json:"verified_email"`
	Name          string `json:"name"` // 'Name' field contains the full name
	GivenName     string `json:"given_name"`
	FamilyName    string `json:"family_name"`
	Picture       string `json:"picture"`
	Locale        string `json:"locale"`
}

var googleOauthConfig = &oauth2.Config{
	RedirectURL:  "http://localhost:3000/login/callback",
	ClientID:     os.Getenv("AUTH_GOOGLE_CLIENT_ID"),
	ClientSecret: os.Getenv("AUTH_GOOGLE_SECRET"),
	Scopes:       []string{"https://www.googleapis.com/auth/userinfo.email"},
	Endpoint:     google.Endpoint,
}

// Redirect user to Google's consent page
func HandleGoogleLogin(w http.ResponseWriter, r *http.Request) {
	url := googleOauthConfig.AuthCodeURL("state-token", oauth2.AccessTypeOffline)
	http.Redirect(w, r, url, http.StatusTemporaryRedirect)
}

func HandleGoogleCallback(w http.ResponseWriter, r *http.Request) {
	context := r.Context()
	code := r.URL.Query().Get("code")
	token, err := googleOauthConfig.Exchange(context, code)
	if err != nil {
		http.Error(w, "Failed to exchange token: "+err.Error(), http.StatusBadRequest)
		return
	}

	client := &http.Client{}
	req, err := http.NewRequest("GET", "https://www.googleapis.com/oauth2/v2/userinfo", nil)
	if err != nil {
		http.Error(w, "Failed to create request: "+err.Error(), http.StatusBadRequest)
		return
	}

	// Set the Authorization header
	req.Header.Set("Authorization", "Bearer "+token.AccessToken)

	// Perform the HTTP GET request
	resp, err := client.Do(req)
	if err != nil {
		http.Error(w, "Failed to get user info: "+err.Error(), http.StatusBadRequest)
		return
	}
	defer resp.Body.Close() // Don't forget to close the response body

	// Read the response body
	responseData, err := io.ReadAll(resp.Body)
	if err != nil {
		http.Error(w, "Failed to read response body: "+err.Error(), http.StatusBadRequest)
		return
	}

	// Unmarshal JSON data
	var userInfo GoogleUserInfo
	fmt.Printf("\nTOKEN DATA: %v", responseData)
	if err := json.Unmarshal(responseData, &userInfo); err != nil {
		http.Error(w, "Failed to unmarshal JSON: "+err.Error(), http.StatusBadRequest)
		return
	}

	fmt.Printf("\nUser from google %v", userInfo)
	dbUser := &database.User{
		ExternalID:   userInfo.ID,
		Username:     userInfo.GivenName,
		Email:        userInfo.Email,
		AvatarURL:    userInfo.Picture,
		Provider:     "GOOGLE",
		PasswordHash: "",
	}

	if dbUser, err = user.CreateUser(dbUser); err != nil {
		fmt.Errorf("there was an error creating the user")
	}

	tokenWithExpiration, err := tokenHandler.GenerateJWT(dbUser)
	if err != nil {
		http.Error(w, "Failed to generate JWT", http.StatusInternalServerError)
		return
	}

	// Here, you would generally set the JWT token in an HTTP-only cookie, or return it in the response body
	//w.Header().Set("Token", jwtToken)

	HandleRedirection(w, r, tokenWithExpiration)

	defer resp.Body.Close()
	// Read and handle response from Google to get user data, typically decode JSON response

	// Handle login logic, session creation, etc.
}

func assignWalletHandler(w http.ResponseWriter, r *http.Request) {
	var wa WalletAssignment
	err := json.NewDecoder(r.Body).Decode(&wa)
	if err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	googleID, err := tokenHandler.ValidateJWT(wa.GoogleToken)
	if err != nil {
		http.Error(w, "Invalid Google token", http.StatusUnauthorized)
		return
	}

	var user database.User
	db := database.GetConnection()
	if err := db.Where("google_id = ?", googleID).First(&user).Error; err != nil {
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
