package main

import "github.com/arfis/crowd-funding/gateway/cmd/server"

func main() {

	terminationChanel := make(chan int)
	var graphQlServer = server.GraphQLServer{}

	go graphQlServer.StartWebServer(8081, terminationChanel)

	<-terminationChanel
}
