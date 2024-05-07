package main

import (
	"fmt"
	"github.com/arfis/crowd-funding/gateway/cmd/server"
	database "github.com/arfis/crowd-funding/gateway/internal/db"
	"github.com/arfis/crowd-funding/gateway/pkg/service"
	tickerUtil "github.com/arfis/crowd-funding/gateway/pkg/ticker"
)

func main() {

	terminationChanel := make(chan int)
	var graphQlServer = server.GraphQLServer{}
	investmentService := &service.InvestmentService{}

	startTicker(investmentService)
	database.Migrate()
	go graphQlServer.StartWebServer(8081, terminationChanel)
	fmt.Println("STARTED GATEWAY")
	<-terminationChanel

}

func startTicker(ticker tickerUtil.Ticker) {
	ticker.StartTicker(120)
}
