package textviews

import "backend/models"

type View struct {
	ID         uint   `json:"id"`
	Content    string `json:"content"`
	LangaugeID uint   `json:"languageID"`
}

func ViewFrom(text *models.Text) View {
	return View{
		ID: text.ID,
		Content: text.Content,
		LangaugeID: text.LanguageID,
	}
}

func ViewsFromArray(texts []models.Text) []View {
	views := make([]View, len(texts))
	for i, text := range texts {
		views[i] = ViewFrom(&text)
	}
	return views
}

func ViewsFromPointerArray(texts []*models.Text) []*View {
	views := make([]*View, len(texts))
	for i, text := range texts {
		if text == nil {
			continue
		}
		view := ViewFrom(text)
		views[i] = &view
	}
	return views
}