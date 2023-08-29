package languageviews

import "backend/models"

type View struct {
	ID   uint   `json:"id"`
	Name string `json:"name"`
	Code string `json:"code"`
}

func ViewFrom(language *models.Language) View {
	return View{
		ID: language.ID,
		Name: language.Name,
		Code: language.Code,
	}
}

func ViewsFromArray(languages []models.Language) []View {
	views := make([]View, len(languages))
	for i, language := range languages {
		views[i] = ViewFrom(&language)
	}
	return views
}