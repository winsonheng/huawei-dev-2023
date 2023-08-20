const Languages = {
  en: {
    nativeName: "English",
    flag: "GB"
  },
  zh: {
    nativeName: "中文",
    flag: "CN"
  },
  fr: {
    nativeName: "français",
    flag: "FR"
  }
};

/**
 * Unsupported languages do not show up in the website's language selector.
 * However, they can be selected in the CustomTooltip so users can contribute to them.
 */
const UnsupportedLanguages = {
  ar: {
    nativeName: "عربي",
    flag: "SA"
  },
  de: {
    nativeName: "Deutsch",
    flag: "DE"
  },
  es: {
    nativeName: "español",
    flag: "ES"
  }
};

const DEFAULT_LANGUAGE = "en";

const CLIENT_IDS = require('./clientIds.json');

module.exports = { Languages, UnsupportedLanguages, DEFAULT_LANGUAGE, CLIENT_IDS };
