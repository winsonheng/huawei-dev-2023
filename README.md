# you&i18n - an i18n Crowdsourcing Tool
As developers who have experienced the dreaded process of i18n, we understand it's tough no matter how you approach it.

- _Hire professional translators?_
   - Costly for small businesses & solo developers
- _Use Google Translate?_
   - Inaccurate, lacks context and cultural nuances

But what if you could **crowdsource** translations from loyal users and open-source contributors?
Hence, we devised a Software-as-a-Service (SaaS) that removes all translation woes! 

### With you&i18n, everyone wins!
#### You Get:
- Free & accurate translations
- Increased community engagement

#### Contributors Get:
- Rewards on your application (e.g. in-game currency)
- Satisfaction for helping their favourite developers!

_**Together with you&i, we can make apps accessible to everyone!**_

## How It Works
### Custom Tooltip
We've designed a custom React tooltip that pops up when users hover over texts in _Contributor Mode_. Simply include the scripts in your app and users can:
- Rate the existing translation
- Suggest a better translation (for any language)

### Smart Translation Selection
Our AI-powered service determines the most accurate translations by assigning weights to users' ratings and calculating a similarity index between user submissions. Each translation is given a confidence score and we'll return the best one!

### Fallback Mechanisms
Don't be worried if some languages are not fully ready yet. We'll automatically use Huawei Cloud's state-of-the-art Natural Language Processing APIs to generate translations for you! For common words & phrases, we'll search our existing master database for your immediate use.

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
