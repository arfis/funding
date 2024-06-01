package service

import (
	"encoding/json"
	"fmt"
	"github.com/google/uuid"
	"net/http"
	"os"
	"time"
)

type User struct {
	Email    string `json:"email"`
	Username string `json:"username"`
	IsActive bool   `json:"isActive"`
}

type UserService struct {
}

func (userService *UserService) GetUserById(userId uuid.UUID) (*User, error) {
	var user *User
	authorizationServiceURL := os.Getenv("AUTHORIZATION_SERVICE_URL")

	if authorizationServiceURL == "" {
		return nil, fmt.Errorf("failed to call authorization service: AUTHORIZATION SERVICE URL MISSING")
	}

	url := fmt.Sprintf("%s/user/%s", authorizationServiceURL, userId.String())

	client := &http.Client{Timeout: 10 * time.Second}
	resp, err := client.Get(url)
	if err != nil {
		return user, fmt.Errorf("failed to call authorization service: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return user, fmt.Errorf("authorization service returned status: %d", resp.StatusCode)
	}

	if err := json.NewDecoder(resp.Body).Decode(&user); err != nil {
		return user, fmt.Errorf("failed to decode response: %w", err)
	}

	return user, nil
}
