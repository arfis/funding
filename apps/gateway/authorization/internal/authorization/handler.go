package authorization

import (
	"fmt"
	"net/http"
	"time"
)

func HandleRedirection(w http.ResponseWriter, r *http.Request, jwtToken string) {
	expiration := time.Now().Add(1 * time.Hour)
	cookie := &http.Cookie{
		Name:     "Token",
		Value:    jwtToken,
		Expires:  expiration,
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
