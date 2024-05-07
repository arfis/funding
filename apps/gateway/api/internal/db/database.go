package database

import (
	"fmt"
	"github.com/arfis/crowd-funding/gateway/internal/dbModels"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"log"
	"os"
	"sync"
)

var (
	connection *gorm.DB
	once       sync.Once
)

func Migrate() {
	dbConnection := GetConnection()

	err := dbConnection.AutoMigrate(&dbModels.Project{}, &dbModels.Investment{}, &dbModels.Quiz{}, &dbModels.QuizTake{}, &dbModels.QuizQuestion{}, &dbModels.Answer{})

	if err != nil {
		fmt.Printf("There was an error while migrating")
	}
}

func GetConnection() *gorm.DB {
	once.Do(func() {
		host := os.Getenv("DB_HOST")         // Get the host from environment variables
		port := os.Getenv("DB_PORT")         // Get the port from environment variables
		user := os.Getenv("DB_USER")         // Get the user from environment variables
		password := os.Getenv("DB_PASSWORD") // Get the password from environment variables
		dbname := os.Getenv("DB_NAME")       // Get the database name from environment variables
		sslmode := "disable"
		timeZone := "Europe/Bratislava" // Changed from "Asia/Shanghai" to "Europe/Bratislava"

		dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=%s TimeZone=%s",
			host, user, password, dbname, port, sslmode, timeZone)

		// Connect to the database using GORM
		connectedDb, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
			//Logger: logger.Default.LogMode(logger.Info),
		})
		if err != nil {
			log.Fatalf("Failed to connect to database: %v", err)
		} else {
			fmt.Println("Connected to the database successfully.")
		}

		connection = connectedDb
	})

	return connection
}
