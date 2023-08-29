# translate-backend
backend for translate app

# Tech stack
- Golang: see https://go.dev/
- Gin framework: see https://gin-gonic.com/ 
- postgres DB: see https://www.postgresql.org/

# Setting up database
1. run ```createdb -h <DB_HOSTNAME> -p <DB_PORT> -U <DB_USER> <DB_NAME> --password```
2. create a .env.local file and copy contents of .env over. Replace fields accordingly

# Starting the server
1. run ```go mod download``` to get all dependencies
2. run ```go run main.go``` to start the server

# API spec
```/languages```

```GET```
Response:
```
{
  "id": uint,
  "name": string,
  "code": string
}
```

```POST```
Request:
```
{
  "name": string,
  "code": string
}
```
Response:
Same as ```GET```


```/clients```

```GET```
Response:
```
{
  "id": uint,
  "name": string,
}
```

```POST```
Request:
```
{
  "name": string
}
```
Response:
Same as ```GET```


```/translations```

```GET```
query params: 
```.../translations?from={sourceLanguageID}&to={targetLanguageID}&client={clientID}&q={something+to+translate}```
Response:
```
{
  "id": uint,
  "content": string,
  "languageID": uint,
}
```

```POST```
Request:
```
{
  "translations": [
    {
      "sourceLanguageID": uint,
      "text": string,
      "targetLanguageID": uint,
      "translation": string,
      "clientID": uint
    }, ...
  ]
}
```
Response:
Same as ```GET```

```POST```
```translations/multiple```
Request:
```
{
  "from": uint,
  "to": uint,
  "clientID": uint,
  "queries": []string
}
```
Response:
```
{
  translations: [
    {
      "id": uint,
      "content": string,
      "languageID": uint
    } ...
  ]
}
```

```POST```
```translations/by_client```
Request:
```
{
  "clientID": uint,
  "targetLanguageID": uint
}
```
Response:
```
{
  translations: [
    {
      "id": uint,
      "sourceText": string,
      "targetText": string
    },...
  ]
}
```

```/texts```

```GET```
```texts/by_client?client={clientID}&language={languageID}```
Response:
```
{
  "texts": [
    {
      "id": string,
      "content": string,
      "languageID": uint,
    }  
  ]
}
```

```POST```
```texts```
Request:
```
{
  "languageID": uint,
  "clientID": uint,
  "content": string,
}
```

Response:
```
{
  "text": {
    "id": uint
    "content": string
    "languageID": uint
  }
}
```
