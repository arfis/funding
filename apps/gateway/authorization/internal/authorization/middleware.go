package authorization

import (
	"fmt"
	"golang.org/x/oauth2/jwt"
	"net/http"
)

func TokenAuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Retrieve the token from the cookie
		c, err := r.Cookie("AuthToken")
		if err != nil {
			if err == http.ErrNoCookie {
				// If the cookie is not set, return an unauthorized status
				w.WriteHeader(http.StatusUnauthorized)
				return
			}
			// For any other type of error, return a bad request status
			w.WriteHeader(http.StatusBadRequest)
			return
		}

		// Get the JWT string from the cookie
		tokenStr := c.Value

		// Initialize a new instance of `Claims`
		claims := &jwt.StandardClaims{}

		// Parse the JWT string and store the result in `claims`
		token, err := jwt.ParseWithClaims(tokenStr, claims, func(token *jwt.Token) (interface{}, error) {
			return jwtKey, nil
		})
		if err != nil {
			if err == jwt.ErrSignatureInvalid {
				w.WriteHeader(http.StatusUnauthorized)
				return
			}
			w.WriteHeader(http.StatusBadRequest)
			return
		}
		if !token.Valid {
			w.WriteHeader(http.StatusUnauthorized)
			return
		}

		// If everything is OK, serve the next handler
		fmt.Printf("Verified JWT claims: %+v\n", claims)
		next.ServeHTTP(w, r)
	})
}
