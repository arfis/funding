package server

import (
	"context"
	"fmt"
	graphqlImpl "github.com/arfis/crowd-funding/gateway/config/graphql"
	"github.com/arfis/crowd-funding/gateway/internal/services/authorization"
	"github.com/gorilla/handlers"
	"github.com/graphql-go/graphql"
	"github.com/graphql-go/handler"
	"log"
	"net/http"
	"os"
)

type GraphQLServer struct{}

func (ra *GraphQLServer) StartWebServer(port uint, terminateChan chan int) error {
	rootQuery := graphqlImpl.GetRootQuery
	mutation := graphqlImpl.GetRootMutation
	schemaConfig := graphql.SchemaConfig{Query: rootQuery, Mutation: mutation}
	schema, err := graphql.NewSchema(schemaConfig)
	if err != nil {
		log.Fatalf("Failed to create GraphQL schema: %v", err)
		return err
	}

	h := handler.New(&handler.Config{
		Schema:   &schema,
		Pretty:   true,
		GraphiQL: true,
	})

	corsOptions := handlers.AllowedOrigins([]string{"http://localhost:4200"})
	corsHeaders := handlers.AllowedHeaders([]string{"X-Requested-With", "Content-Type", "Authorization"})
	corsMethods := handlers.AllowedMethods([]string{"GET", "POST", "PUT", "DELETE", "OPTIONS"})

	http.Handle("/graphql", handlers.CORS(corsOptions, corsHeaders, corsMethods)(validateJWTMiddleware(h)))
	http.HandleFunc("/sandbox", sandboxHandler)

	log.Println("Here!!Starting GraphQL server on http://localhost:", port)
	log.Fatal(http.ListenAndServe(fmt.Sprintf(":%d", port), nil))

	terminateChan <- 1
	return nil
}

func sandboxHandler(w http.ResponseWriter, r *http.Request) {
	http.ServeFile(w, r, "cmd/server/index.html")
}

func validateJWTMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		tokenString := r.Header.Get("Authorization")
		// todo: for testing purposes
		debugMode := os.Getenv("DEBUG_MODE")
		// Token is valid, pass down the c
		if debugMode == "true" && (tokenString == "Bearer 1" || tokenString == "") {
			next.ServeHTTP(w, r)
			return
		}
		// Assuming tokenString is prefixed with "Bearer ", strip that part.
		if tokenString == "" {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
		}

		if len(tokenString) > 7 && tokenString[:7] == "Bearer " {
			tokenString = tokenString[7:]
		}

		userDetail, err := authorization.ValidateJWT(tokenString)
		if err != nil {
			//If the token is invalid or expired, return an error.
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		// Token is valid, pass down the chain
		ctx := context.WithValue(r.Context(), "userDetail", userDetail)
		log.Printf("USER DETAIL %s", userDetail.Email)
		next.ServeHTTP(w, r.WithContext(ctx))
		//next.ServeHTTP(w, r)
	})
}
