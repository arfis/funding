package authorization

import (
	"bytes"
	"encoding/json"
	"fmt"
	"github.com/dgrijalva/jwt-go"
	"github.com/google/uuid"
	"io"
	"log"
	"net/http"
	"os"
)

type ClaimResponse struct {
	Claims JwtTokenContent
}
type JwtTokenContent struct {
	UserID    uuid.UUID `json:"userId"`
	Email     string    `json:"email"`
	Username  string    `json:"username"`
	Type      string    `json:"type"`
	AvatarUrl string    `json:"avatarUrl"`
	jwt.StandardClaims
}

type User struct {
	ID           uuid.UUID `json:"id""`
	ExternalID   string    `json:"externalId"` // ID provided by the third-party service
	Username     string    `json:"username"`
	Email        string    `json:"email"`
	AvatarURL    string    `json:"avatarUrl"` // URL to the user's avatar picture
	Provider     string    `json:"provider"`  // Name of the third-party provider, e.g., "Google", "Facebook"
	PasswordHash string    `json:"passwordHash"`
	Type         string    `json:"type"`
	DeletedAt    string    `json:"deletedAt"` // This enables soft deletes
}

type TokenRequest struct {
	Token string `json:"token"`
}

// ValidateJWT sends a request to the authorization service to validate the JWT token
func ValidateJWT(token string) (*JwtTokenContent, error) {
	authorizationServiceURL := os.Getenv("AUTHORIZATION_SERVICE_URL")
	if authorizationServiceURL == "" {
		log.Fatal("AUTHORIZATION_SERVICE_URL not set")
		return nil, fmt.Errorf("environment variable AUTHORIZATION_SERVICE_URL not set")
	}

	authorizationServiceURL += "/validate"
	// Prepare the request body
	requestData := TokenRequest{
		Token: token,
	}
	requestBody, err := json.Marshal(requestData)
	if err != nil {
		log.Printf("Error marshaling token request: %s", err)
		return nil, err
	}

	// Create HTTP client and request
	client := &http.Client{}
	req, err := http.NewRequest("POST", authorizationServiceURL, bytes.NewBuffer(requestBody))
	if err != nil {
		log.Printf("Error creating request: %s", err)
		return nil, err
	}
	req.Header.Set("Content-Type", "application/json")

	// Send the request
	resp, err := client.Do(req)

	log.Printf("Response went correctly %v %v", resp, resp.Status)

	if resp.Status != "200 OK" {
		return nil, fmt.Errorf(resp.Status)
	}

	if err != nil {
		log.Printf("Error sending request to authorization service: %s", err)
		return nil, err
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		log.Printf("Error reading response body: %v", err)
		return nil, err
	}
	defer resp.Body.Close() // Always important to close the body

	claims, err := extractUserIdFromBody(body)
	if err != nil {
		log.Printf("Error extracting user ID: %v", err)
	} else {
		log.Printf("Extracted User ID: %s", claims)
	}

	return claims, nil
}

func GetUserById(userID uuid.UUID) *User {
	return nil
}

func extractUserIdFromBody(body []byte) (*JwtTokenContent, error) {
	var resp ClaimResponse
	err := json.Unmarshal(body, &resp)
	if err != nil {
		return nil, fmt.Errorf("error parsing JSON: %v", err)
	}

	return &resp.Claims, nil
}
