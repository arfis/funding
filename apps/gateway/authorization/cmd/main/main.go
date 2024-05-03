package main

import (
	"crowd-funding/authorization/cmd/server"
	"fmt"
)

func Hello(name string) string {
	result := "Hello " + name
	return result
}

func main() {
	fmt.Println(Hello("authorization"))
	terminateChanel := make(chan int)
	restApi := server.RestApiServer{}

	restApi.StartWebServer(8080, terminateChanel)
}
