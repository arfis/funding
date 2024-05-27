package tokenHandler

import (
	"fmt"
	database "github.com/arfis/crowd-funding/authorization/internal/db"
	"github.com/dgrijalva/jwt-go"
	"github.com/google/uuid"
	"os"
	"strconv"
	"time"
)

var JwtKey = []byte("your_secret_key") // Use a secret from your environment variables

type Claims struct {
	UserID     uuid.UUID `json:"userId"`
	Email      string    `json:"email"`
	Username   string    `json:"username"`
	Type       string    `json:"type"`
	AvatarUrl  string    `json:"avatarUrl"`
	ExternalId string    `json:"externalId"`
	jwt.StandardClaims
}

type TokenWithExpiration struct {
	Token      string
	Expiration time.Time
}

func GenerateJWT(user *database.User) (*TokenWithExpiration, error) {
	tokenValidityEnv := os.Getenv("ACCESS_TOKEN_VALIDITY_SECONDS")
	fmt.Printf("Access token valid: %d", tokenValidityEnv)
	if tokenValidityEnv == "" {
		fmt.Println("ACCESS_TOKEN_VALIDITY_SECONDS not set, defaulting to 60 seconds")
		tokenValidityEnv = "60" // Default value if not set
	}

	seconds, err := strconv.Atoi(tokenValidityEnv)

	expirationTime := time.Now().Add(time.Duration(seconds) * time.Second) // Token is valid for 72 hours
	claims := &Claims{
		UserID:     user.ID,
		Email:      user.Email,
		Username:   user.Username,
		Type:       user.Type,
		AvatarUrl:  user.AvatarURL,
		ExternalId: user.ExternalID,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: expirationTime.Unix(),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(JwtKey)

	if err != nil {
		return nil, err
	}

	return &TokenWithExpiration{
		Token:      tokenString,
		Expiration: expirationTime,
	}, nil
}

func ValidateJWT(tokenString string) (*Claims, error) {
	// Parse the token
	token, err := jwt.ParseWithClaims(tokenString, &Claims{}, func(token *jwt.Token) (interface{}, error) {
		// Make sure token's algorithm is what you expect
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}

		return JwtKey, nil
	})

	if err != nil {
		return nil, err
	}

	if claims, ok := token.Claims.(*Claims); ok && token.Valid {
		// Check if the token is expired
		if claims.ExpiresAt < time.Now().Unix() {
			return nil, fmt.Errorf("JWT is expired")
		}
		return claims, nil
	} else {
		return nil, fmt.Errorf("invalid JWT Token")
	}
}
