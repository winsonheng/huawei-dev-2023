import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";
import { DateTime } from "luxon";
import { HttpStatusCode } from "axios";
import { BACKEND_BASE_URL, CLIENT_ID, ROOT } from "./constants/config";
import { CLIENT_IDS } from "./constants/languages";
import { TRANSLATIONS_BY_CLIENT } from "./constants/endpoints";

i18next
  .use(LanguageDetector)
  .use(initReactI18next)
  .use(Backend)
  .init({
    debug: true,
    fallbackLng: "en",
    returnNull: false,
    parseMissingKeyHandler: (key) => {
      return key;
    },
    backend: {
      loadPath: "{{lng}}",
      request: (options, url, payload, callback) => {
        console.log("Attempting request...", options, url, payload);
        try {
          fetch(BACKEND_BASE_URL + TRANSLATIONS_BY_CLIENT, {
            method: "POST",
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': 'http://localhost:3000'
            },
            body: JSON.stringify({
              clientID: CLIENT_ID,
              targetLanguageID: CLIENT_IDS[url]
            })
          }).then(async (result) => {
            return result.json();
          }).then(result => {
            const translations = {};
            for (const key in result.translations) {
              const val = result.translations[key];
              translations[val.sourceText] = val.targetText;
            }

            callback(null, {
              data: translations,
              status: HttpStatusCode.Ok, 
            });
          });
        } catch (e) {
          console.error(e);
          callback(null, {
            status: HttpStatusCode.InternalServerError,
          });
        }
      },
    }
  });

i18next.services.formatter.add("DATETIME", (value, lng) => {
  return DateTime.fromJSDate(value)
    .setLocale(lng)
    .toLocaleString(DateTime.DATETIME_MED);
});

i18next.services.formatter.add("DATE", (value, lng) => {
  return DateTime.fromJSDate(value)
    .setLocale(lng)
    .toLocaleString(DateTime.DATE_FULL);
});

i18next.services.formatter.add("TIME", (value, lng) => {
  return DateTime.fromJSDate(value)
    .setLocale(lng)
    .toLocaleString(DateTime.TIME_SIMPLE);
});

// Custom load function to fetch translations on demand
async function loadTranslations(lngs, namespaces) {
  console.log("AYYYE LAMMAOAO", lngs, namespaces);
  // Fetch translation data from your server for specific lngs and namespaces
  const response = await fetch(`http://localhost:8000/players/getTranslations?lngs=${lngs}&ns=${namespaces}`);
  const data =  response.json();

  return data;
}

i18next.services.backendConnector.backend.load = loadTranslations;