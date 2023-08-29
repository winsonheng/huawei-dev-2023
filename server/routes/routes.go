package routes

import (
	"backend/handlers/client"
	"backend/handlers/language"
	"backend/handlers/text"
	"backend/handlers/translation"
	"backend/handlers/user"

	"github.com/gin-gonic/gin"
)

func GetRoutes(r *gin.Engine) {
	getAuthRoutes(r)
	getLanguageRoutes(r)
	getClientRoutes(r)
	getTranslationRoutes(r)
	getTextRoutes(r)
}

func getAuthRoutes(r *gin.Engine) {
	authRoutes := r.Group("/auth")
	authRoutes.POST("/register", user.Register)
	authRoutes.POST("/login", user.Login)
}

func getLanguageRoutes(r *gin.Engine) {
	languageRoutes := r.Group("/languages")
	// languageRoutes.Use(middleware.JWTAuthMiddleware())
	languageRoutes.GET("", language.HandleList)
	languageRoutes.POST("", language.HandleCreate)
}

func getClientRoutes(r *gin.Engine) {
	clientRoutes := r.Group("/clients")
	// clientRoutes.Use(middleware.JWTAuthMiddleware())
	clientRoutes.GET("", client.HandleList)
	clientRoutes.POST("", client.HandleCreate)
}

func getTranslationRoutes(r *gin.Engine) {
	translationRoutes := r.Group("/translations")
	// translationRoutes.Use(middleware.JWTAuthMiddleware())
	translationRoutes.GET("", translation.HandleQuery)
	translationRoutes.POST("", translation.HandleCreate)
	translationRoutes.POST("/multiple", translation.HandleMultipleQuery)
	translationRoutes.POST("/by_client", translation.HandleListByClient)
}

func getTextRoutes(r *gin.Engine) {
	textRoutes := r.Group("/texts")
	textRoutes.POST("", text.HandleCreate)
	textRoutes.GET("/by_client", text.HandleList)
}