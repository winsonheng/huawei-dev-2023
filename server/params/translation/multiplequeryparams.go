package translation

type MultipleQueryParams struct {
	SourceLanguageID uint     `json:"from"`
	TargetLanguageID uint     `json:"to"`
	ClientID         uint     `json:"clientID"`
	Queries          []string `json:"queries"`
}