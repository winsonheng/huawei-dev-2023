package clientviews

import "backend/models"

type View struct {
	ID   uint   `json:"id"`
	Name string `json:"name"`
}

func ViewFrom(client *models.Client) View {
	return View{
		ID:   client.ID,
		Name: client.Name,
	}
}

func ViewsFromArray(clients []models.Client) []View {
	views := make([]View, len(clients))
	for i, client := range clients {
		views[i] = ViewFrom(&client)
	}
	return views
}