import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";
import { DateTime } from "luxon";

i18next
  .use(LanguageDetector)
  .use(initReactI18next)
  .use(Backend)
  .init({
    debug: true,
    fallbackLng: "en",
    backend: {
      loadPath: "http://localhost:8000/players/getTranslations",
      request: (options, url, payload, callback) => {
        console.log("Attempting request...", options, url, payload);
        try {
          fetch("http://localhost:8000/players/getTranslations").then(async (result) => {
            console.log("Translation request successful", await result.json());
            callback(null, {
              data: result,
              status: 200, 
            });
          });
        } catch (e) {
          console.error(e);
          callback(null, {
            status: 500,
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