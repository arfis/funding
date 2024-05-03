package server

import (
	"fmt"
	"github.com/arfis/crowd-funding/authorization/internal/authorization"
	"github.com/gorilla/mux"
	"log"
	"net/http"
)

type RestApiServer struct{}

func (ra *RestApiServer) StartWebServer(port uint, terminateChan chan int) error {
	r := mux.NewRouter()
	r.HandleFunc("/ping", pingHandler).Methods("GET")
	r.HandleFunc("/login", authorization.HandleGoogleLogin).Methods("GET")
	r.HandleFunc("/login/callback", authorization.HandleGoogleCallback).Methods("GET")

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

func pingHandler(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("pong"))
}
