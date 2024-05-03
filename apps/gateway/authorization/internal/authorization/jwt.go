package authorization

import (
	"golang.org/x/oauth2/jwt"
	"time"
)

var jwtKey = []byte("your_secret_key") // Use a secret from your environment variables

type Claims struct {
	UserID string `json:"userId"`
	Email  string `json:"email"`
	Credit int16  `json:"credit"`
	jwt.StandardClaims
}

func generateJWT(userID string, email string, credit int16) (string, error) {
	expirationTime := time.Now().Add(72 * time.Hour) // Token is valid for 72 hours
	claims := &Claims{
		UserID: userID,
		Email:  email,
		Credit: credit,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: expirationTime.Unix(),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(jwtKey)

	if err != nil {
		return "", err
	}

	return tokenString, nil
}
