package main

import (
	"fmt"
	"github.com/arfis/crowd-funding/authorization/cmd/server"
	database "github.com/arfis/crowd-funding/authorization/internal/db"
)

func Hello(name string) string {
	result := "Hello " + name
	return result
}

func main() {
	fmt.Println(Hello("authorization"))
	terminateChanel := make(chan int)
	restApi := server.RestApiServer{}
	database.Migrate()
	restApi.StartWebServer(8080, terminateChanel)
}
