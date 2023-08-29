package utils

import (
	"bytes"
	"encoding/json"
	"net/http"
	"os"
	"time"
)

type DomainStruct struct {
	Name string `json:"name"`
}

type UserStruct struct {
	Name string `json:"name"`
	Password string `json:"password"`
	Domain DomainStruct `json:"domain"`
}

type PasswordStruct struct {
	User UserStruct `json:"user"`
}

type IdentityStruct struct {
	Methods []string `json:"methods"`
	Password PasswordStruct `json:"password"`
}

type ProjectStruct struct {
	Name string `json:"name"`
}

type ScopeStruct struct {
	Project ProjectStruct `json:"project"`
}

type AuthStruct struct {
	Identity IdentityStruct `json:"identity"`
	Scope ScopeStruct `json:"scope"`
}

type UserTokenParams struct {
	Auth AuthStruct `json:"auth"`
}

func generateParams() UserTokenParams {
	Domain := DomainStruct{
		Name: os.Getenv("ACCOUNT_NAME"),
	}
	User := UserStruct{
		Name: os.Getenv("IAM_USERNAME"),
		Password: os.Getenv("PASSWORD"),
		Domain: Domain,
	}
	Password := PasswordStruct{
		User: User,
	}
	Identity := IdentityStruct{
		Methods: []string{"password"},
		Password: Password,
	}
	Project := ProjectStruct{
		Name: os.Getenv("PROJECT_NAME"),
	}
	Scope := ScopeStruct{
		Project: Project,
	}
	Auth := AuthStruct{
		Identity: Identity,
		Scope: Scope,
	}
	return UserTokenParams{
		Auth: Auth,
	}
}

func GetAccessToken() (*string, error) {
	url := "https://iam." + os.Getenv("PROJECT_NAME") + ".myhuaweicloud.com/v3/auth/tokens"

	// create request body
	requestBody := generateParams()
	marshalled, err := json.Marshal(requestBody)

	if err != nil {
		return nil, err
	}

	// Create request
	request, err := http.NewRequest("POST", url, bytes.NewReader(marshalled))
	if err != nil {
		return nil, err
	}
	
	request.Header.Set("Content-Type", "application/json")

	// send request
	client := http.Client{Timeout: 10 * time.Second}
	res, err := client.Do(request)
	if err != nil {
		return nil, err
	}

	// retrieve token from header
	token := res.Header.Get("X-Subject-Token")

	return &token, nil
}