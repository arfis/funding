package authorization

import (
	"fmt"
	"github.com/arfis/crowd-funding/authorization/internal/tokenHandler"
	"net/http"
)

func HandleRedirection(w http.ResponseWriter, r *http.Request, tokenWithExpiration *tokenHandler.TokenWithExpiration) {
	// todo the expiration should be the same as the token has
	cookie := &http.Cookie{
		Name:     "AuthToken",
		Value:    tokenWithExpiration.Token,
		Expires:  tokenWithExpiration.Expiration,
		HttpOnly: false, // Ensures the cookie is sent only in HTTP(S) requests and not accessible through JavaScript
		Path:     "/",   // The cookie is available to all paths
	}

	// Set the cookie in the HTTP response header
	http.SetCookie(w, cookie)

	// Redirect the user to 'localhost:4200'
	// Note: In production, you would likely want to use an absolute URL with https
	fmt.Println("\nDoing redirection")
	http.Redirect(w, r, "http://localhost:4200", http.StatusSeeOther)
}
