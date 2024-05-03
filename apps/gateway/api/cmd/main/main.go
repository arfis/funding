package main

import (
	"crowd-funding/api/cmd/server"
)

func Hello(name string) string {
	result := "Hello " + name
	return result
}

func main() {

	terminationChanel := make(chan int)
	var graphQlServer = server.GraphQLServer{}

	go graphQlServer.StartWebServer(8081, terminationChanel)

	<-terminationChanel
}
