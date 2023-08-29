package main

import (
	"backend/database"
	"backend/models"
	"backend/routes"
	"backend/seed"
	"fmt"
	"log"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	loadEnv()
	loadDatabase()
	seed.SeedDB()
	serveApplication()
}

func loadDatabase() {
	database.Connect()
	database.Database.AutoMigrate(&models.Client{})
	database.Database.AutoMigrate(&models.ClientText{})
	database.Database.AutoMigrate(&models.Language{})
	database.Database.AutoMigrate(&models.Text{})
	database.Database.AutoMigrate(&models.Translation{})
	database.Database.AutoMigrate(&models.User{})
}

func loadEnv() {
	err := godotenv.Load(".env.local")
	if err != nil {
		log.Fatal("Error loading .env file")
	}
}

func serveApplication() {
	router := gin.Default()

	config := cors.DefaultConfig()
	config.AllowHeaders = []string{"Content-Type", "Authorization", "Access-Control-Allow-Origin"}
	config.AllowOrigins = []string{"http://localhost:3000", "https://huawei-dev-challenge.web.app"}
	router.Use(cors.New(config))

	routes.GetRoutes(router)

	router.Run(":8000")
	fmt.Println("Server running on port 8000")
}
