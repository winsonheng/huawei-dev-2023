package translationviews

import "backend/models"

type View struct {
	ID         uint   `json:"id"`
	SourceText string `json:"sourceText"`
	TargetText string `json:"targetText"`
}

func ViewFrom(translation *models.Translation) View {
	return View{
		ID: translation.ID,
		SourceText: translation.SourceText.Content,
		TargetText: translation.TargetText.Content,
	}
}

func ViewsFromArray(translations []models.Translation) []View {
	views := make([]View, len(translations))
	for i, translation := range translations {
		views[i] = ViewFrom(&translation)
	}
	return views
}