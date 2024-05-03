package server

import (
	graphqlImpl "crowd-funding/api/config/graphql"
	"fmt"
	"github.com/gorilla/handlers"
	"github.com/graphql-go/graphql"
	"github.com/graphql-go/handler"
	"log"
	"net/http"
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

	http.Handle("/graphql", handlers.CORS(corsOptions, corsHeaders, corsMethods)(h))
	http.HandleFunc("/sandbox", sandboxHandler)

	log.Println("Starting GraphQL server on http://localhost:", port)
	log.Fatal(http.ListenAndServe(fmt.Sprintf(":%d", port), nil))

	terminateChan <- 1
	return nil
}

func sandboxHandler(w http.ResponseWriter, r *http.Request) {
	http.ServeFile(w, r, "cmd/server/index.html")
}
